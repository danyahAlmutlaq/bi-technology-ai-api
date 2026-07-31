from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.delivery import Delivery
from app.models.expense import Expense
from app.models.inventory import Inventory
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.schemas.insights import InsightsResponse

router = APIRouter(prefix="/insights", tags=["Insights"])

INACTIVITY_DAYS = 45


def _aware(value):
    if value is not None and value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


@router.get("/", response_model=InsightsResponse)
def get_insights(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    prev_month_end = month_start - timedelta(seconds=1)
    prev_month_start = prev_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # --- أولوية التحصيل: فواتير غير مدفوعة بالكامل، مرتبة حسب المبلغ المفتوح ---
    unpaid_invoices = db.query(Invoice).filter(Invoice.status != "paid").all()
    overdue_items = []
    total_open = 0.0
    for inv in unpaid_invoices:
        paid = (
            db.query(func.coalesce(func.sum(Payment.amount), 0))
            .filter(Payment.invoice_id == inv.id)
            .scalar()
            or 0.0
        )
        open_amount = max(0.0, (inv.total or 0.0) - paid)
        if open_amount <= 0:
            continue
        total_open += open_amount
        customer = db.query(Customer).filter(Customer.id == inv.customer_id).first()
        created_at = _aware(inv.created_at)
        days_since = (now - created_at).days if created_at else 0
        overdue_items.append(
            {
                "customer_name": customer.name if customer else "غير معروف",
                "invoice_number": inv.invoice_number,
                "open_amount": round(open_amount, 2),
                "days_since_issued": days_since,
            }
        )
    overdue_items.sort(key=lambda x: x["open_amount"], reverse=True)
    overdue_items = overdue_items[:5]

    # --- تنبيهات المخزون: أصناف وصلت أو تحت الحد الأدنى ---
    low_stock_rows = db.query(Inventory).filter(Inventory.quantity <= Inventory.minimum).all()
    low_stock_items = [
        {
            "name": item.name,
            "sku": item.sku,
            "quantity": item.quantity,
            "minimum": item.minimum,
            "suggested_reorder": max(item.maximum - item.quantity, item.minimum),
        }
        for item in low_stock_rows
    ]
    low_stock_items.sort(key=lambda x: (x["minimum"] - x["quantity"]), reverse=True)
    low_stock_items = low_stock_items[:8]

    # --- أفضل العملاء حسب إجمالي الفوترة ---
    top_rows = (
        db.query(
            Invoice.customer_id,
            func.sum(Invoice.total).label("rev"),
            func.count(Invoice.id).label("cnt"),
        )
        .group_by(Invoice.customer_id)
        .order_by(func.sum(Invoice.total).desc())
        .limit(5)
        .all()
    )
    top_customers = []
    for customer_id, rev, cnt in top_rows:
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        top_customers.append(
            {
                "customer_name": customer.name if customer else "غير معروف",
                "total_revenue": round(rev or 0.0, 2),
                "invoice_count": cnt,
            }
        )

    # --- عملاء بلا نشاط حديث (بدون فاتورة آخر 45 يوم، أو بلا فواتير إطلاقًا) ---
    active_customers = db.query(Customer).filter(Customer.is_archived == False).all()  # noqa: E712
    inactive_items = []
    for customer in active_customers:
        last_invoice = (
            db.query(Invoice)
            .filter(Invoice.customer_id == customer.id)
            .order_by(Invoice.created_at.desc())
            .first()
        )
        if last_invoice is None:
            inactive_items.append({"customer_name": customer.name, "days_since_last_activity": None})
            continue
        created_at = _aware(last_invoice.created_at)
        days = (now - created_at).days if created_at else None
        if days is not None and days >= INACTIVITY_DAYS:
            inactive_items.append({"customer_name": customer.name, "days_since_last_activity": days})
    inactive_items.sort(key=lambda x: (x["days_since_last_activity"] is None, -(x["days_since_last_activity"] or 0)))
    inactive_items = inactive_items[:5]

    # --- أداء التسليم ---
    def delivery_rate(start, end):
        total = db.query(Delivery).filter(Delivery.created_at >= start, Delivery.created_at < end).count()
        delivered = (
            db.query(Delivery)
            .filter(Delivery.created_at >= start, Delivery.created_at < end, Delivery.status == "delivered")
            .count()
        )
        rate = round((delivered / total) * 100, 1) if total else 0.0
        return total, delivered, rate

    total_this, delivered_this, rate_this = delivery_rate(month_start, now)
    _, _, rate_last = delivery_rate(prev_month_start, month_start)

    delivered_rows = (
        db.query(Delivery)
        .filter(Delivery.status == "delivered", Delivery.delivered_at.isnot(None))
        .filter(Delivery.created_at >= month_start)
        .all()
    )
    durations = []
    for d in delivered_rows:
        created = _aware(d.created_at)
        delivered_at = _aware(d.delivered_at)
        if created and delivered_at:
            durations.append((delivered_at - created).total_seconds() / 86400)
    avg_days = round(sum(durations) / len(durations), 1) if durations else None

    # --- اللقطة المالية الشهرية ---
    def sum_in_range(model, start, end, extra_filter=None):
        q = db.query(func.coalesce(func.sum(model.amount), 0)).filter(
            model.created_at >= start, model.created_at < end
        )
        if extra_filter is not None:
            q = q.filter(extra_filter)
        return q.scalar() or 0.0

    collected_this = sum_in_range(Payment, month_start, now)
    collected_last = sum_in_range(Payment, prev_month_start, month_start)
    expenses_this = sum_in_range(Expense, month_start, now, extra_filter=(Expense.is_archived == False))  # noqa: E712
    expenses_last = sum_in_range(
        Expense, prev_month_start, month_start, extra_filter=(Expense.is_archived == False)  # noqa: E712
    )

    return {
        "overdue_invoices": overdue_items,
        "total_open_amount": round(total_open, 2),
        "low_stock": low_stock_items,
        "top_customers": top_customers,
        "inactive_customers": inactive_items,
        "delivery": {
            "total_this_month": total_this,
            "delivered_this_month": delivered_this,
            "delivery_rate_percent": rate_this,
            "avg_delivery_days": avg_days,
            "delivery_rate_last_month": rate_last,
        },
        "financial": {
            "collected_this_month": round(collected_this, 2),
            "collected_last_month": round(collected_last, 2),
            "expenses_this_month": round(expenses_this, 2),
            "expenses_last_month": round(expenses_last, 2),
            "net_this_month": round(collected_this - expenses_this, 2),
        },
        "generated_at": now.isoformat(),
    }
