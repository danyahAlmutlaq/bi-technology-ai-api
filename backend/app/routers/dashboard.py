from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.shipment import Shipment
from app.models.expense import Expense
from app.models.inventory import Inventory
from app.schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    total_customers = db.query(Customer).filter(
        Customer.is_archived == False
    ).count()
    total_invoices = db.query(Invoice).count()
    total_payments = db.query(
        func.coalesce(func.sum(Payment.amount), 0)
    ).scalar()
    active_shipments = db.query(Shipment).filter(
        Shipment.status.in_([
            "pending",
            "in_transit",
            "dispatched",
        ])
    ).count()
    total_expenses = db.query(
        func.coalesce(func.sum(Expense.amount), 0)
    ).filter(
        Expense.is_archived == False
    ).scalar()

    total_invoiced = db.query(
        func.coalesce(func.sum(Invoice.total), 0)
    ).scalar()
    open_amount = max(0.0, total_invoiced - total_payments)
    collection_rate = round((total_payments / total_invoiced) * 100) if total_invoiced else 0
    due_invoices = db.query(Invoice).filter(
        Invoice.status != "paid"
    ).count()

    low_stock_count = db.query(Inventory).filter(
        Inventory.quantity <= Inventory.minimum
    ).count()

    return {
        "total_customers": total_customers,
        "total_invoices": total_invoices,
        "total_payments": total_payments,
        "active_shipments": active_shipments,
        "total_expenses": total_expenses,
        "total_invoiced": total_invoiced,
        "open_amount": open_amount,
        "collection_rate": collection_rate,
        "due_invoices": due_invoices,
        "low_stock_count": low_stock_count,
    }
