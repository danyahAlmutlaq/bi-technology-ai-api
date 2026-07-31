import csv
import io
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.expense import Expense
from app.models.inventory import Inventory
from app.models.invoice import Invoice
from app.models.order import Order
from app.models.payment import Payment

router = APIRouter(prefix="/reports", tags=["Reports"])

INACTIVITY_DAYS = 45
ARABIC_MONTHS = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
]
CUSTOMER_TYPE_LABELS = {"individual": "أفراد", "company": "شركات"}


def _aware(value):
    if value is not None and value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def _add_months(dt, n):
    total = dt.month - 1 + n
    year = dt.year + total // 12
    month = total % 12 + 1
    return dt.replace(year=year, month=month, day=1, hour=0, minute=0, second=0, microsecond=0)


def _month_buckets(now, count=6):
    buckets = []
    for i in range(count - 1, -1, -1):
        start = _add_months(now, -i)
        end = _add_months(now, -i + 1)
        label = f"{ARABIC_MONTHS[start.month - 1]} {start.year}"
        buckets.append({"key": start.strftime("%Y-%m"), "label": label, "start": start, "end": end})
    return buckets


def _growth(current, previous):
    if previous:
        return round(((current - previous) / previous) * 100, 1)
    return 100.0 if current > 0 else 0.0


def _sum_amount(db, model, start, end, extra_filter=None):
    q = db.query(func.coalesce(func.sum(model.amount), 0)).filter(
        model.created_at >= start, model.created_at < end
    )
    if extra_filter is not None:
        q = q.filter(extra_filter)
    return q.scalar() or 0.0


def _open_amount(db, invoice: Invoice) -> float:
    paid = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(Payment.invoice_id == invoice.id)
        .scalar()
        or 0.0
    )
    return max(0.0, (invoice.total or 0.0) - paid)


# ---------------------------------------------------------------- financial
def _financial_report(db: Session, now, buckets):
    monthly_trend = []
    for bucket in buckets:
        start, end = bucket["start"], bucket["end"]
        invoiced = _sum_amount(db, Invoice, start, end)
        collected = _sum_amount(db, Payment, start, end)
        expenses = _sum_amount(db, Expense, start, end, extra_filter=(Expense.is_archived == False))  # noqa: E712
        monthly_trend.append(
            {
                "month": bucket["key"],
                "label": bucket["label"],
                "invoiced": round(invoiced, 2),
                "collected": round(collected, 2),
                "expenses": round(expenses, 2),
                "net": round(collected - expenses, 2),
            }
        )

    total_invoiced = round(db.query(func.coalesce(func.sum(Invoice.total), 0)).scalar() or 0.0, 2)
    total_collected = round(db.query(func.coalesce(func.sum(Payment.amount), 0)).scalar() or 0.0, 2)
    total_expenses = round(
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(Expense.is_archived == False)  # noqa: E712
        .scalar()
        or 0.0,
        2,
    )
    unpaid = db.query(Invoice).filter(Invoice.status != "paid").all()
    total_outstanding = round(sum(_open_amount(db, inv) for inv in unpaid), 2)

    category_rows = (
        db.query(Expense.category, func.sum(Expense.amount).label("total"))
        .filter(Expense.is_archived == False)  # noqa: E712
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .limit(5)
        .all()
    )
    top_expense_categories = [
        {"category": category or "غير مصنف", "amount": round(total or 0.0, 2)} for category, total in category_rows
    ]

    this_month = monthly_trend[-1]
    prev_month = monthly_trend[-2] if len(monthly_trend) > 1 else {"collected": 0, "net": 0}
    collected_growth = _growth(this_month["collected"], prev_month["collected"])

    insights = []
    insights.append(
        f"التحصيل هذا الشهر {'ارتفع' if collected_growth >= 0 else 'تراجع'} بنسبة {abs(collected_growth)}% عن الشهر الماضي."
    )
    if total_outstanding > 0:
        insights.append(f"فيه {total_outstanding:,.0f} ر.س مستحقات مفتوحة تحتاج متابعة تحصيل.")
    else:
        insights.append("لا توجد مستحقات مفتوحة حاليًا — التحصيل ممتاز.")
    if top_expense_categories:
        insights.append(f"أكبر بند مصاريف هو \"{top_expense_categories[0]['category']}\".")

    return {
        "kpis": {
            "total_invoiced": total_invoiced,
            "total_collected": total_collected,
            "total_expenses": total_expenses,
            "total_outstanding": total_outstanding,
            "net_this_month": this_month["net"],
            "collected_growth_percent": collected_growth,
        },
        "monthly_trend": monthly_trend,
        "top_expense_categories": top_expense_categories,
        "insights": insights,
    }


# ---------------------------------------------------------------- customers
def _customers_report(db: Session, now, buckets):
    all_customers = db.query(Customer).all()
    active_customers = [c for c in all_customers if not c.is_archived]

    monthly_growth = []
    for bucket in buckets:
        start, end = bucket["start"], bucket["end"]
        count = db.query(Customer).filter(Customer.created_at >= start, Customer.created_at < end).count()
        monthly_growth.append({"month": bucket["key"], "label": bucket["label"], "new_customers": count})

    new_this_month = monthly_growth[-1]["new_customers"]
    prev_month_count = monthly_growth[-2]["new_customers"] if len(monthly_growth) > 1 else 0
    growth_percent = _growth(new_this_month, prev_month_count)

    type_counts = {}
    for c in active_customers:
        key = CUSTOMER_TYPE_LABELS.get(c.customer_type, "غير محدد")
        type_counts[key] = type_counts.get(key, 0) + 1
    by_type = [{"type": key, "count": value} for key, value in type_counts.items()]

    top_rows = (
        db.query(Invoice.customer_id, func.sum(Invoice.total).label("rev"), func.count(Invoice.id).label("cnt"))
        .group_by(Invoice.customer_id)
        .order_by(func.sum(Invoice.total).desc())
        .limit(10)
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

    inactive_count = 0
    for customer in active_customers:
        last_invoice = (
            db.query(Invoice)
            .filter(Invoice.customer_id == customer.id)
            .order_by(Invoice.created_at.desc())
            .first()
        )
        if last_invoice is None:
            inactive_count += 1
            continue
        created_at = _aware(last_invoice.created_at)
        days = (now - created_at).days if created_at else None
        if days is not None and days >= INACTIVITY_DAYS:
            inactive_count += 1

    insights = [f"انضم {new_this_month} عميل جديد هذا الشهر."]
    if inactive_count > 0:
        insights.append(f"{inactive_count} عميل بدون نشاط منذ {INACTIVITY_DAYS} يوم فأكثر يحتاجون متابعة.")
    if top_customers:
        insights.append(f"أعلى عميل تعاملًا هو \"{top_customers[0]['customer_name']}\".")

    return {
        "kpis": {
            "total_customers": len(active_customers),
            "new_this_month": new_this_month,
            "inactive_customers": inactive_count,
            "new_customers_growth_percent": growth_percent,
        },
        "monthly_growth": monthly_growth,
        "by_type": by_type,
        "top_customers": top_customers,
        "insights": insights,
    }


# ---------------------------------------------------------------- inventory
def _inventory_report(db: Session):
    items = db.query(Inventory).all()
    total_value = sum((item.quantity or 0) * (item.unit_price or 0) for item in items)
    low_stock = [item for item in items if item.quantity <= item.minimum and item.quantity > 0]
    out_of_stock = [item for item in items if item.quantity <= 0]

    category_map = {}
    warehouse_map = {}
    for item in items:
        value = (item.quantity or 0) * (item.unit_price or 0)
        cat_key = item.category or "عام"
        wh_key = item.warehouse or "المستودع الرئيسي"
        cat = category_map.setdefault(cat_key, {"category": cat_key, "quantity": 0, "value": 0.0})
        cat["quantity"] += item.quantity or 0
        cat["value"] += value
        wh = warehouse_map.setdefault(wh_key, {"warehouse": wh_key, "quantity": 0, "value": 0.0})
        wh["quantity"] += item.quantity or 0
        wh["value"] += value

    by_category = sorted(category_map.values(), key=lambda x: x["value"], reverse=True)
    by_warehouse = sorted(warehouse_map.values(), key=lambda x: x["value"], reverse=True)
    for row in by_category:
        row["value"] = round(row["value"], 2)
    for row in by_warehouse:
        row["value"] = round(row["value"], 2)

    top_movement = sorted(items, key=lambda item: abs(item.movement or 0), reverse=True)[:5]
    top_movement_rows = [
        {"name": item.name, "sku": item.sku, "movement": item.movement or 0} for item in top_movement
    ]

    insights = []
    if low_stock:
        insights.append(f"{len(low_stock)} صنف وصل للحد الأدنى ويحتاج إعادة طلب قريبًا.")
    if out_of_stock:
        insights.append(f"{len(out_of_stock)} صنف نفد من المخزون بالكامل.")
    if not low_stock and not out_of_stock:
        insights.append("كل الأصناف ضمن المستوى الآمن حاليًا.")
    if by_category:
        insights.append(f"أعلى تصنيف من حيث القيمة هو \"{by_category[0]['category']}\".")

    return {
        "kpis": {
            "total_value": round(total_value, 2),
            "total_items": len(items),
            "low_stock_count": len(low_stock),
            "out_of_stock_count": len(out_of_stock),
        },
        "by_category": by_category,
        "by_warehouse": by_warehouse,
        "top_movement": top_movement_rows,
        "insights": insights,
    }


# --------------------------------------------------------------- operational
def _operational_report(db: Session, buckets):
    orders = db.query(Order).filter(Order.is_archived == False).all()  # noqa: E712
    status_counts = {}
    for order in orders:
        status_counts[order.status] = status_counts.get(order.status, 0) + 1
    orders_by_status = [{"status": status, "count": count} for status, count in status_counts.items()]

    priority_counts = {}
    for order in orders:
        priority_counts[order.priority] = priority_counts.get(order.priority, 0) + 1
    orders_by_priority = [{"priority": priority, "count": count} for priority, count in priority_counts.items()]

    orders_trend = []
    for bucket in buckets:
        start, end = bucket["start"], bucket["end"]
        count = db.query(Order).filter(Order.created_at >= start, Order.created_at < end).count()
        total_amount = (
            db.query(func.coalesce(func.sum(Order.amount), 0))
            .filter(Order.created_at >= start, Order.created_at < end)
            .scalar()
            or 0.0
        )
        orders_trend.append(
            {"month": bucket["key"], "label": bucket["label"], "orders": count, "amount": round(total_amount, 2)}
        )

    completed = status_counts.get("completed", 0) + status_counts.get("done", 0) + status_counts.get("delivered", 0)
    total_orders = len(orders)
    completion_rate = round((completed / total_orders) * 100, 1) if total_orders else 0.0

    insights = [f"معدل إنجاز الطلبات الحالي {completion_rate}%."]
    if orders_by_status:
        busiest = max(orders_by_status, key=lambda x: x["count"])
        insights.append(f"أكثر حالة متكررة بين الطلبات هي \"{busiest['status']}\" ({busiest['count']} طلب).")
    this_month_orders = orders_trend[-1]["orders"] if orders_trend else 0
    prev_month_orders = orders_trend[-2]["orders"] if len(orders_trend) > 1 else 0
    order_growth = _growth(this_month_orders, prev_month_orders)
    insights.append(
        f"عدد الطلبات هذا الشهر {'ارتفع' if order_growth >= 0 else 'تراجع'} بنسبة {abs(order_growth)}% عن الشهر الماضي."
    )

    return {
        "kpis": {
            "total_orders": total_orders,
            "completed_orders": completed,
            "completion_rate_percent": completion_rate,
            "orders_growth_percent": order_growth,
        },
        "orders_by_status": orders_by_status,
        "orders_by_priority": orders_by_priority,
        "orders_trend": orders_trend,
        "insights": insights,
    }


@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    buckets = _month_buckets(now, 6)
    return {
        "financial": _financial_report(db, now, buckets),
        "customers": _customers_report(db, now, buckets),
        "inventory": _inventory_report(db),
        "operational": _operational_report(db, buckets),
        "generated_at": now.isoformat(),
    }


@router.get("/export")
def export_report(type: str, db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)

    if type == "financial":
        writer.writerow(["رقم الفاتورة", "العميل", "تاريخ الإصدار", "المبلغ", "الضريبة", "الإجمالي", "المحصل", "المتبقي", "الحالة"])
        invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).all()
        for inv in invoices:
            customer = db.query(Customer).filter(Customer.id == inv.customer_id).first()
            paid = (inv.total or 0.0) - _open_amount(db, inv)
            created_at = _aware(inv.created_at)
            writer.writerow(
                [
                    inv.invoice_number,
                    customer.name if customer else "غير معروف",
                    created_at.strftime("%Y-%m-%d") if created_at else "",
                    round(inv.amount or 0.0, 2),
                    round(inv.tax_amount or 0.0, 2),
                    round(inv.total or 0.0, 2),
                    round(paid, 2),
                    round(_open_amount(db, inv), 2),
                    inv.status,
                ]
            )
    elif type == "customers":
        writer.writerow(["الاسم", "النوع", "الهاتف", "البريد", "المدينة", "عدد الطلبات", "إجمالي المبيعات", "المستحق", "الحالة", "تاريخ الانضمام"])
        customers = db.query(Customer).order_by(Customer.created_at.desc()).all()
        for customer in customers:
            total_orders = db.query(Order).filter(Order.customer_id == customer.id).count()
            total_spent = (
                db.query(func.coalesce(func.sum(Invoice.total), 0))
                .filter(Invoice.customer_id == customer.id)
                .scalar()
                or 0.0
            )
            unpaid = db.query(Invoice).filter(Invoice.customer_id == customer.id, Invoice.status != "paid").all()
            outstanding = sum(_open_amount(db, inv) for inv in unpaid)
            created_at = _aware(customer.created_at)
            writer.writerow(
                [
                    customer.name,
                    CUSTOMER_TYPE_LABELS.get(customer.customer_type, "غير محدد"),
                    customer.phone or "",
                    customer.email or "",
                    customer.city or "",
                    total_orders,
                    round(total_spent, 2),
                    round(outstanding, 2),
                    "موقوف" if customer.is_archived else "نشط",
                    created_at.strftime("%Y-%m-%d") if created_at else "",
                ]
            )
    elif type == "inventory":
        writer.writerow(["SKU", "الاسم", "التصنيف", "المستودع", "الكمية", "الحد الأدنى", "الحد الأقصى", "سعر الوحدة", "القيمة الإجمالية", "الحالة"])
        items = db.query(Inventory).order_by(Inventory.name).all()
        for item in items:
            value = (item.quantity or 0) * (item.unit_price or 0)
            writer.writerow(
                [
                    item.sku,
                    item.name,
                    item.category or "",
                    item.warehouse or "",
                    item.quantity,
                    item.minimum,
                    item.maximum,
                    round(item.unit_price or 0.0, 2),
                    round(value, 2),
                    item.status,
                ]
            )
    elif type == "operational":
        writer.writerow(["رقم الطلب", "العميل", "العنوان", "المبلغ", "الحالة", "الأولوية", "نسبة الإنجاز", "تاريخ الإنشاء"])
        orders = db.query(Order).filter(Order.is_archived == False).order_by(Order.created_at.desc()).all()  # noqa: E712
        for order in orders:
            customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
            created_at = _aware(order.created_at)
            writer.writerow(
                [
                    order.order_number,
                    customer.name if customer else "غير معروف",
                    order.title,
                    round(order.amount or 0.0, 2),
                    order.status,
                    order.priority,
                    f"{order.progress}%",
                    created_at.strftime("%Y-%m-%d") if created_at else "",
                ]
            )
    else:
        raise HTTPException(status_code=400, detail="نوع تقرير غير معروف")

    csv_content = "﻿" + output.getvalue()
    filename = f"{type}-report.csv"
    return Response(
        content=csv_content,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
