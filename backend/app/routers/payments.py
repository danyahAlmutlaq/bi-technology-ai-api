from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentResponse


router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/", response_model=PaymentResponse)
def create_payment(payment_data: PaymentCreate, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == payment_data.customer_id).first()

    if not customer or customer.is_archived:
        raise HTTPException(status_code=404, detail="Customer not found")

    invoice = db.query(Invoice).filter(Invoice.id == payment_data.invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if invoice.customer_id != payment_data.customer_id:
        raise HTTPException(
            status_code=400,
            detail="This invoice does not belong to this customer"
        )

    paid_before = db.query(func.sum(Payment.amount)).filter(
        Payment.invoice_id == payment_data.invoice_id
    ).scalar()

    if paid_before is None:
        paid_before = 0

    remaining_amount = invoice.total - paid_before

    if payment_data.amount > remaining_amount:
        raise HTTPException(
            status_code=400,
            detail="Payment amount is greater than remaining invoice amount"
        )

    payment = Payment(
        customer_id=payment_data.customer_id,
        invoice_id=payment_data.invoice_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method
    )

    db.add(payment)

    paid_after = paid_before + payment_data.amount

    if paid_after >= invoice.total:
        invoice.status = "paid"
    else:
        invoice.status = "partially_paid"

    db.commit()
    db.refresh(payment)

    return payment


@router.get("/", response_model=list[PaymentResponse])
def get_payments(db: Session = Depends(get_db)):

    payments = db.query(Payment).all()

    return payments
