from sqlalchemy.orm import Session
from app.models.invoice import Invoice
from app.models.payment import Payment


def get_order_financials(order_id, db: Session) -> dict:
    if not order_id:
        return {"total_invoiced": 0.0, "total_paid": 0.0, "balance": 0.0, "financial_status": "no_invoice"}
    invoices = db.query(Invoice).filter(Invoice.order_id == order_id).all()
    total_invoiced = sum(inv.total or 0 for inv in invoices)
    invoice_ids = [inv.id for inv in invoices]
    total_paid = 0.0
    if invoice_ids:
        payments = db.query(Payment).filter(Payment.invoice_id.in_(invoice_ids)).all()
        total_paid = sum(p.amount or 0 for p in payments)
    balance = round(total_invoiced - total_paid, 2)
    if total_invoiced <= 0:
        financial_status = "no_invoice"
    elif balance <= 0:
        financial_status = "paid"
    elif total_paid > 0:
        financial_status = "partial"
    else:
        financial_status = "unpaid"
    return {
        "total_invoiced": round(total_invoiced, 2),
        "total_paid": round(total_paid, 2),
        "balance": balance,
        "financial_status": financial_status,
    }
