from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.shipment import Shipment
from app.models.expense import Expense

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
            "Pending",
            "In Transit"
        ])
    ).count()

    total_expenses = db.query(
        func.coalesce(func.sum(Expense.amount), 0)
    ).filter(
        Expense.is_archived == False
    ).scalar()

    return {
        "total_customers": total_customers,
        "total_invoices": total_invoices,
        "total_payments": total_payments,
        "active_shipments": active_shipments,
        "total_expenses": total_expenses
    }
