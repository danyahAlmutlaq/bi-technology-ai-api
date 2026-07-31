from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.shipment import Shipment
from app.models.customs import CustomsClearance
from app.models.invoice import Invoice
from app.models.invoice_line_item import InvoiceLineItem
from app.schemas.billing import PendingCustomerCharges, PendingChargeItem, GenerateInvoiceRequest
from app.schemas.invoice import InvoiceResponse

router = APIRouter(prefix="/billing", tags=["Billing"])


def billed_source_ids(db: Session, source_type: str) -> set:
    return {row[0] for row in db.query(InvoiceLineItem.source_id).filter(InvoiceLineItem.source_type == source_type).all()}


def collect_customer_charges(db: Session, customer_id: int):
    billed_orders = billed_source_ids(db, "order")
    billed_shipments = billed_source_ids(db, "shipment")
    billed_customs = billed_source_ids(db, "customs")

    items = []

    orders = db.query(Order).filter(
        Order.customer_id == customer_id,
        Order.invoice_ready == True,
        Order.is_archived == False,
    ).all()
    for o in orders:
        if o.id in billed_orders:
            continue
        items.append(("order", o.id, f"طلب {o.order_number}", o.amount))

    shipments = db.query(Shipment).filter(Shipment.customer_id == customer_id).all()
    for s in shipments:
        if s.id not in billed_shipments and s.shipping_cost:
            items.append(("shipment", s.id, f"شحن {s.tracking_number or ('#' + str(s.id))}", s.shipping_cost))
        customs_list = db.query(CustomsClearance).filter(
            CustomsClearance.shipment_id == s.id,
            CustomsClearance.is_archived == False,
        ).all()
        for c in customs_list:
            if c.id in billed_customs:
                continue
            customs_total = c.duty_amount + c.vat_amount + c.port_charges
            if customs_total:
                items.append(("customs", c.id, f"جمارك شحنة #{s.id}", customs_total))

    return items


@router.get("/pending", response_model=list[PendingCustomerCharges])
def get_pending_charges(db: Session = Depends(get_db)):
    customers = db.query(Customer).filter(Customer.is_archived == False).all()
    result = []
    for customer in customers:
        items = collect_customer_charges(db, customer.id)
        if items:
            result.append(PendingCustomerCharges(
                customer_id=customer.id,
                customer_name=customer.name,
                total_amount=sum(i[3] for i in items),
                items=[PendingChargeItem(source_type=i[0], source_id=i[1], description=i[2], amount=i[3]) for i in items],
            ))
    return result


@router.post("/generate", response_model=InvoiceResponse)
def generate_invoice(data: GenerateInvoiceRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    line_items = collect_customer_charges(db, customer.id)
    if not line_items:
        raise HTTPException(status_code=400, detail="No pending charges for this customer")

    amount = sum(item[3] for item in line_items)
    tax_amount = amount * 0.15
    total = amount + tax_amount

    invoice = Invoice(
        customer_id=customer.id,
        invoice_number="",
        amount=amount,
        tax_amount=tax_amount,
        total=total,
        status="draft",
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    invoice.invoice_number = f"INV-{invoice.id:05d}"
    db.commit()

    for source_type, source_id, description, item_amount in line_items:
        db.add(InvoiceLineItem(
            invoice_id=invoice.id,
            source_type=source_type,
            source_id=source_id,
            description=description,
            amount=item_amount,
        ))
    db.commit()
    db.refresh(invoice)
    return invoice