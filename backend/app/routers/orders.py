from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.customer import Customer
from app.models.booking import Booking
from app.models.invoice import Invoice
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse, OrderShipmentToggle

router = APIRouter(prefix="/orders", tags=["Orders"])

STATUS_CHAIN = ["new", "pending_approval", "in_progress", "ready_to_ship", "completed"]
PROGRESS_MAP = {
    "new": 8,
    "pending_approval": 20,
    "in_progress": 58,
    "ready_to_ship": 86,
    "completed": 100,
}


def generate_order_number() -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    suffix = uuid4().hex[:6].upper()
    return f"ORD-{today}-{suffix}"
def generate_booking_number_for_order() -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    suffix = uuid4().hex[:6].upper()
    return f"BKG-{today}-{suffix}"


def get_active_customer(customer_id: int, db: Session) -> Customer:
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.is_archived == False,
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def get_order_or_404(order_id: int, db: Session) -> Order:
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.is_archived == False,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=OrderResponse)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    get_active_customer(order_data.customer_id, db)
    order = Order(
        order_number=generate_order_number(),
        customer_id=order_data.customer_id,
        title=order_data.title,
        amount=order_data.amount,
        priority=order_data.priority,
        due_date=order_data.due_date,
        owner=order_data.owner,
        notes=order_data.notes,
        status="new",
        progress=PROGRESS_MAP["new"],
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.is_archived == False).order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return get_order_or_404(order_id, db)


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(order_id: int, order_data: OrderUpdate, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    if order_data.title is not None:
        order.title = order_data.title
    if order_data.amount is not None:
        order.amount = order_data.amount
    if order_data.priority is not None:
        order.priority = order_data.priority
    if order_data.due_date is not None:
        order.due_date = order_data.due_date
    if order_data.owner is not None:
        order.owner = order_data.owner
    if order_data.notes is not None:
        order.notes = order_data.notes
    db.commit()
    db.refresh(order)
    return order


@router.patch("/{order_id}/advance", response_model=OrderResponse)
def advance_order(order_id: int, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    if order.status != "completed":
        current_index = STATUS_CHAIN.index(order.status)
        next_index = min(current_index + 1, len(STATUS_CHAIN) - 1)
        order.status = STATUS_CHAIN[next_index]
        order.progress = PROGRESS_MAP[order.status]
        db.commit()
        db.refresh(order)
    return order


@router.patch("/{order_id}/toggle-invoice", response_model=OrderResponse)
def toggle_invoice_ready(order_id: int, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    if not order.invoice_ready:
        existing = db.query(Invoice).filter(Invoice.order_id == order.id).first()
        if not existing:
            tax_amount = order.amount * 0.15
            total = order.amount + tax_amount
            invoice = Invoice(
                customer_id=order.customer_id,
                invoice_number="",
                amount=order.amount,
                tax_amount=tax_amount,
                total=total,
                status="draft",
                order_id=order.id,
            )
            db.add(invoice)
            db.commit()
            db.refresh(invoice)
            invoice.invoice_number = f"INV-{invoice.id:05d}"
            db.commit()
    order.invoice_ready = not order.invoice_ready
    db.commit()
    db.refresh(order)
    return order


@router.patch("/{order_id}/toggle-shipment", response_model=OrderResponse)
def toggle_shipment_ready(
    order_id: int,
    payload: OrderShipmentToggle = OrderShipmentToggle(),
    db: Session = Depends(get_db),
):
    order = get_order_or_404(order_id, db)
    if not order.shipment_ready:
        existing = db.query(Booking).filter(Booking.order_id == order.id).first()
        if not existing:
            if not payload.origin or not payload.destination:
                raise HTTPException(
                    status_code=400,
                    detail="أدخلي نقطة الانطلاق والوجهة لإنشاء الحجز",
                )
            booking = Booking(
                booking_number=generate_booking_number_for_order(),
                customer_id=order.customer_id,
                service_type=payload.service_type or "domestic",
                origin=payload.origin,
                destination=payload.destination,
                package_count=payload.package_count or 1,
               notes=f"تم الإنشاء تلقائيًا من الطلب {order.order_number}",
                order_id=order.id,
            )
            db.add(booking)
    order.shipment_ready = not order.shipment_ready
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
def archive_order(order_id: int, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    order.is_archived = True
    db.commit()
    return {"message": "Order archived successfully"}
