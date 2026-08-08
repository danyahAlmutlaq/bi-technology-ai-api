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

    if payment_data.amount > remaining_amount + 1:
        raise HTTPException(
            status_code=400,
            detail="Payment amount is greater than remaining invoice amount"
        )

    if payment_data.amount > remaining_amount:
        payment_data.amount = remaining_amount

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


def _recompute_invoice_status(invoice: Invoice, db: Session):
    paid_total = db.query(func.sum(Payment.amount)).filter(
        Payment.invoice_id == invoice.id
    ).scalar() or 0
    if paid_total <= 0:
        invoice.status = "draft"
    elif paid_total >= invoice.total:
        invoice.status = "paid"
    else:
        invoice.status = "partially_paid"


@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, payment_data: PaymentCreate, db: Session = Depends(get_db)):

    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    invoice = db.query(Invoice).filter(Invoice.id == payment.invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    other_paid = db.query(func.sum(Payment.amount)).filter(
        Payment.invoice_id == payment.invoice_id,
        Payment.id != payment_id,
    ).scalar() or 0

    remaining_amount = invoice.total - other_paid

    if payment_data.amount > remaining_amount + 1:
        raise HTTPException(
            status_code=400,
            detail="Payment amount is greater than remaining invoice amount"
        )

    payment.amount = min(payment_data.amount, remaining_amount)
    payment.payment_method = payment_data.payment_method

    _recompute_invoice_status(invoice, db)

    db.commit()
    db.refresh(payment)

    return payment


@router.delete("/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):

    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    invoice = db.query(Invoice).filter(Invoice.id == payment.invoice_id).first()

    db.delete(payment)
    db.flush()

    if invoice:
        _recompute_invoice_status(invoice, db)

    db.commit()

    return {"detail": "Payment deleted"}
