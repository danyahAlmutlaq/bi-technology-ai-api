from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.customer import Customer
from app.models.booking import Booking
from app.models.invoice import Invoice
from app.models.invoice_line_item import InvoiceLineItem
from app.models.picking import Picking
from app.models.delivery_company import DeliveryCompany
from app.models.shipment import Shipment
from app.models.customs import CustomsClearance
from app.models.receiving import Receiving
from app.models.inventory import Inventory
from app.finance import get_order_financials
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


def attach_financials(order: Order, db: Session) -> Order:
    fin = get_order_financials(order.id, db)
    order.total_invoiced = fin["total_invoiced"]
    order.total_paid = fin["total_paid"]
    order.balance = fin["balance"]
    order.financial_status = fin["financial_status"]
    return order


@router.post("/", response_model=OrderResponse)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    get_active_customer(order_data.customer_id, db)
    if order_data.inventory_item_id:
        inventory_item = db.query(Inventory).filter(Inventory.id == order_data.inventory_item_id).first()
        if not inventory_item:
            raise HTTPException(status_code=404, detail="الصنف غير موجود بالمخزون")
        requested_qty = order_data.quantity or 1
        if inventory_item.quantity < requested_qty:
            raise HTTPException(status_code=400, detail=f"الكمية غير كافية بالمخزون (المتوفر: {inventory_item.quantity})")
        inventory_item.quantity -= requested_qty
    order = Order(
        order_number=generate_order_number(),
        customer_id=order_data.customer_id,
        title=order_data.title,
        amount=order_data.amount,
        priority=order_data.priority,
        due_date=order_data.due_date,
        owner=order_data.owner,
        notes=order_data.notes,
        origin=order_data.origin,
        destination=order_data.destination,
        recipient_name=order_data.recipient_name,
        recipient_phone=order_data.recipient_phone,
        recipient_address=order_data.recipient_address,
        service_type=order_data.service_type,
        package_count=order_data.package_count or 1,
        delivery_company_id=order_data.delivery_company_id,
        delivery_method=order_data.delivery_method or "internal",
        inventory_item_id=order_data.inventory_item_id,
        quantity=order_data.quantity or 1,
        status="new",
        progress=PROGRESS_MAP["new"],
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    db.add(Picking(order_id=order.id, status="pending"))
    db.commit()
    return attach_financials(order, db)


@router.get("/", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.is_archived == False).order_by(Order.created_at.desc()).all()
    return [attach_financials(o, db) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return attach_financials(get_order_or_404(order_id, db), db)


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
    return attach_financials(order, db)


@router.patch("/{order_id}/advance", response_model=OrderResponse)
def advance_order(order_id: int, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    if order.status != "completed":
        current_index = STATUS_CHAIN.index(order.status)
        next_index = min(current_index + 1, len(STATUS_CHAIN) - 1)
        order.status = STATUS_CHAIN[next_index]
        order.progress = PROGRESS_MAP[order.status]
        if order.status == "ready_to_ship":
            existing = db.query(Picking).filter(Picking.order_id == order.id).first()
            if not existing:
                picking_record = Picking(order_id=order.id, status="pending")
                db.add(picking_record)
        db.commit()
        db.refresh(order)
    return attach_financials(order, db)


@router.patch("/{order_id}/toggle-invoice", response_model=OrderResponse)
def toggle_invoice_ready(order_id: int, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    invoice_id = None
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
            db.add(InvoiceLineItem(
                invoice_id=invoice.id,
                source_type="order",
                source_id=order.id,
                description=f"طلب {order.order_number}",
                amount=order.amount,
            ))
            db.commit()
            invoice_id = invoice.id
        else:
            invoice_id = existing.id
    else:
        existing = db.query(Invoice).filter(Invoice.order_id == order.id).first()
        if existing:
            invoice_id = existing.id
    order.invoice_ready = not order.invoice_ready
    db.commit()
    db.refresh(order)
    order.invoice_id = invoice_id
    return attach_financials(order, db)


@router.patch("/{order_id}/toggle-shipment", response_model=OrderResponse)
def toggle_shipment_ready(
    order_id: int,
    payload: OrderShipmentToggle = OrderShipmentToggle(),
    db: Session = Depends(get_db),
):
    order = get_order_or_404(order_id, db)
    if not order.shipment_ready:
        origin = order.origin or payload.origin
        destination = order.destination or payload.destination
        service_type = order.service_type or payload.service_type or "domestic"
        package_count = order.package_count or payload.package_count or 1
        if not origin or not destination:
            raise HTTPException(
                status_code=400,
                detail="أدخلي نقطة الانطلاق والوجهة لإنشاء الحجز",
            )
        booking = db.query(Booking).filter(Booking.order_id == order.id).first()
        if not booking:
            booking = Booking(
                booking_number=generate_booking_number_for_order(),
                customer_id=order.customer_id,
                service_type=service_type,
                item_name=payload.item_name,
                origin=origin,
                destination=destination,
                package_count=package_count,
                notes=f"تم الإنشاء تلقائيًا من الطلب {order.order_number}",
                order_id=order.id,
            )
            db.add(booking)
            db.flush()
        package_count = booking.package_count or package_count
        if booking.status != "converted_to_shipment":
            if order.delivery_company_id:
                company = db.query(DeliveryCompany).filter(
                    DeliveryCompany.id == order.delivery_company_id
                ).first()
            else:
                price_field = (
                    DeliveryCompany.international_sell_price
                    if service_type == "international"
                    else DeliveryCompany.domestic_sell_price
                )
                company = (
                    db.query(DeliveryCompany)
                    .filter(price_field.isnot(None), price_field > 0)
                    .order_by(price_field.asc())
                    .first()
                ) or db.query(DeliveryCompany).order_by(DeliveryCompany.id.asc()).first()
            if company:
                shipping_cost = (
                    company.international_sell_price
                    if service_type == "international"
                    else company.domestic_sell_price
                ) or 0.0
                shipment = Shipment(
                    customer_id=order.customer_id,
                    delivery_company_id=company.id,
                    shipping_cost=shipping_cost,
                    service_type=service_type,
                    order_id=order.id,
                    notes=f"تم الإنشاء تلقائيًا من الطلب {order.order_number}",
                )
                db.add(shipment)
                db.flush()
                if service_type == "international":
                    db.add(CustomsClearance(shipment_id=shipment.id, status="pending"))
                else:
                    db.add(Receiving(
                        shipment_id=shipment.id,
                        expected_quantity=package_count,
                        status="pending",
                    ))
                booking.status = "converted_to_shipment"
    order.shipment_ready = not order.shipment_ready
    db.commit()
    db.refresh(order)
    return attach_financials(order, db)


@router.delete("/{order_id}")
def archive_order(order_id: int, db: Session = Depends(get_db)):
    order = get_order_or_404(order_id, db)
    order.is_archived = True
    db.commit()
    return {"message": "Order archived successfully"}
