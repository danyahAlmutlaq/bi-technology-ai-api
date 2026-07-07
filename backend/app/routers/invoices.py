from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse


router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == invoice_data.customer_id).first()

    if not customer or customer.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    tax_amount = invoice_data.amount * 0.15
    total = invoice_data.amount + tax_amount

    invoice = Invoice(
        customer_id=invoice_data.customer_id,
        invoice_number=invoice_data.invoice_number,
        amount=invoice_data.amount,
        tax_amount=tax_amount,
        total=total,
        status="draft"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return invoice


@router.get("/", response_model=list[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db)):

    invoices = db.query(Invoice).all()

    return invoices


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):

    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
    db: Session = Depends(get_db)
):

    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    if invoice_data.status is not None:
        invoice.status = invoice_data.status

    db.commit()
    db.refresh(invoice)

    return invoice
