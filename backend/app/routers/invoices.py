import base64
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.administration import CompanySettings
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse

router = APIRouter(prefix="/invoices", tags=["Invoices"])

# بيانات افتراضية تُستخدم فقط إذا ما فيه إعدادات شركة محفوظة بقاعدة البيانات
DEFAULT_COMPANY = {
    "company_name": "BI Technology",
    "tax_number": "311893389900003",
    "commercial_registration": None,
    "phone": "0575909918",
    "email": None,
    "address": "الرياض - الدريهمية - شارع صيدا - مبنى سوبر أوفيس",
    "website": None,
    "logo_path": None,
}
# عدّلي هذي القيم لو تغيّرت بيانات الحساب البنكي
BANK_NAME = "مصرف الراجحي"
BANK_ACCOUNT_NUMBER = "SA1780000454608014112255"


def _aware(value):
    if value is not None and value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def _iso(value):
    value = _aware(value)
    return value.isoformat() if value else None


def _build_zatca_qr(seller_name: str, vat_number: str, timestamp_iso: str, invoice_total: float, vat_total: float) -> str:
    """يبني QR كود متوافق مع مواصفة هيئة الزكاة والضريبة والجمارك (TLV -> Base64)."""

    def tlv(tag: int, value: str) -> bytes:
        value_bytes = value.encode("utf-8")
        return bytes([tag, len(value_bytes)]) + value_bytes

    payload = (
        tlv(1, seller_name)
        + tlv(2, vat_number)
        + tlv(3, timestamp_iso)
        + tlv(4, f"{invoice_total:.2f}")
        + tlv(5, f"{vat_total:.2f}")
    )
    return base64.b64encode(payload).decode("utf-8")


@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == invoice_data.customer_id).first()
    if not customer or customer.is_archived:
        raise HTTPException(status_code=404, detail="Customer not found")
    tax_amount = invoice_data.amount * 0.15
    total = invoice_data.amount + tax_amount
    invoice = Invoice(
        customer_id=invoice_data.customer_id,
        invoice_number="",
        amount=invoice_data.amount,
        tax_amount=tax_amount,
        total=total,
        status="draft",
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    invoice.invoice_number = f"INV-{invoice.id:05d}"
    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("/")
def get_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).all()
    result = []
    for invoice in invoices:
        customer = db.query(Customer).filter(Customer.id == invoice.customer_id).first()
        payments = db.query(Payment).filter(Payment.invoice_id == invoice.id).all()
        paid_total = sum(p.amount for p in payments)
        due_amount = max(0.0, (invoice.total or 0.0) - paid_total)
        result.append(
            {
                "id": invoice.id,
                "customer_id": invoice.customer_id,
                "customer_name": customer.name if customer else "غير معروف",
                "invoice_number": invoice.invoice_number,
                "amount": round(invoice.amount or 0.0, 2),
                "tax_amount": round(invoice.tax_amount or 0.0, 2),
                "total": round(invoice.total or 0.0, 2),
                "paid_amount": round(paid_total, 2),
                "due_amount": round(due_amount, 2),
                "status": invoice.status,
                "created_at": _iso(invoice.created_at),
            }
        )
    return result


@router.get("/{invoice_id}/print")
def get_invoice_print(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    customer = db.query(Customer).filter(Customer.id == invoice.customer_id).first()
    settings = db.query(CompanySettings).first()
    company = {
        "company_name": (settings.company_name if settings and settings.company_name else DEFAULT_COMPANY["company_name"]),
        "tax_number": (settings.tax_number if settings and settings.tax_number else DEFAULT_COMPANY["tax_number"]),
        "commercial_registration": (settings.commercial_registration if settings else DEFAULT_COMPANY["commercial_registration"]),
        "phone": (settings.phone if settings and settings.phone else DEFAULT_COMPANY["phone"]),
        "email": (settings.email if settings else DEFAULT_COMPANY["email"]),
        "address": (settings.address if settings and settings.address else DEFAULT_COMPANY["address"]),
        "website": (settings.website if settings else DEFAULT_COMPANY["website"]),
        "logo_path": (settings.logo_path if settings else DEFAULT_COMPANY["logo_path"]),
        "bank_name": BANK_NAME,
        "bank_account_number": BANK_ACCOUNT_NUMBER,
    }
    payments = (
        db.query(Payment)
        .filter(Payment.invoice_id == invoice.id)
        .order_by(Payment.created_at.desc())
        .all()
    )
    paid_amount = sum(p.amount for p in payments)
    due_amount = max(0.0, (invoice.total or 0.0) - paid_amount)
    created_at = _aware(invoice.created_at)
    due_date = created_at + timedelta(days=14) if created_at else None

    items = []
    for item in invoice.items:
        line_tax = round((item.amount or 0.0) * 0.15, 2)
        items.append(
            {
                "description": item.description,
                "quantity": 1,
                "unit_price": round(item.amount or 0.0, 2),
                "tax_percent": 15,
                "discount_percent": 0,
                "total": round((item.amount or 0.0) + line_tax, 2),
            }
        )

    qr_data = _build_zatca_qr(
        seller_name=company["company_name"],
        vat_number=company["tax_number"] or "",
        timestamp_iso=created_at.isoformat() if created_at else datetime.now(timezone.utc).isoformat(),
        invoice_total=invoice.total or 0.0,
        vat_total=invoice.tax_amount or 0.0,
    )

    return {
        "invoice": {
            "id": invoice.id,
            "invoice_number": invoice.invoice_number,
            "amount": round(invoice.amount or 0.0, 2),
            "tax_amount": round(invoice.tax_amount or 0.0, 2),
            "total": round(invoice.total or 0.0, 2),
            "status": invoice.status,
            "created_at": _iso(invoice.created_at),
            "due_date": _iso(due_date),
        },
        "customer": {
            "name": customer.name if customer else "غير معروف",
            "phone": customer.phone if customer else None,
            "email": customer.email if customer else None,
            "address": customer.address if customer else None,
            "city": customer.city if customer else None,
            "tax_number": customer.tax_number if customer else None,
        },
        "company": company,
        "items": items,
        "payments": [
            {"amount": round(p.amount, 2), "payment_method": p.payment_method, "created_at": _iso(p.created_at)}
            for p in payments
        ],
        "paid_amount": round(paid_amount, 2),
        "due_amount": round(due_amount, 2),
        "payment_status": "paid" if due_amount <= 0 and paid_amount > 0 else ("partial" if paid_amount > 0 else "unpaid"),
        "qr_data": qr_data,
    }


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(invoice_id: int, invoice_data: InvoiceUpdate, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    if invoice_data.status is not None:
        invoice.status = invoice_data.status
    db.commit()
    db.refresh(invoice)
    return invoice
