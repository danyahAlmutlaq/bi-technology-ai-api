from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models.receiving import Receiving
from app.models.shipment import Shipment
from app.models.inventory import Inventory
from app.models.booking import Booking
from app.models.picking import Picking
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.receiving import ReceivingCreate, ReceivingRecordArrival, ReceivingResponse, ReceivingUpdate
def require_admin(current_user: User):
    if current_user.role != "مدير النظام":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="صلاحية مدير النظام مطلوبة"
        )
def generate_inventory_sku_for_receiving() -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    suffix = uuid4().hex[:6].upper()
    return "INV-" + today + "-" + suffix
router = APIRouter(prefix="/receiving", tags=["Receiving"])


@router.post("/migrate-received-by")
def migrate_received_by(db: Session = Depends(get_db)):
    try:
        db.execute(text("ALTER TABLE receiving_records ADD COLUMN received_by VARCHAR"))
        db.commit()
        return {"status": "added"}
    except Exception as exc:
        db.rollback()
        return {"status": "already_exists_or_skipped", "detail": str(exc)}
def get_shipment_or_404(shipment_id: int, db: Session) -> Shipment:
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment
@router.post("/", response_model=ReceivingResponse)
def create_receiving(data: ReceivingCreate, db: Session = Depends(get_db)):
    get_shipment_or_404(data.shipment_id, db)
    record = Receiving(
        shipment_id=data.shipment_id,
        expected_quantity=data.expected_quantity,
        status="pending",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
@router.get("/", response_model=list[ReceivingResponse])
def get_receiving_list(db: Session = Depends(get_db)):
    return db.query(Receiving).filter(Receiving.is_archived == False).order_by(Receiving.created_at.desc()).all()
@router.patch("/{receiving_id}/receive", response_model=ReceivingResponse)
def record_arrival(receiving_id: int, data: ReceivingRecordArrival, db: Session = Depends(get_db)):
    record = db.query(Receiving).filter(Receiving.id == receiving_id, Receiving.is_archived == False).first()
    if not record:
        raise HTTPException(status_code=404, detail="Receiving record not found")
    record.actual_quantity = data.actual_quantity
    record.storage_location = data.storage_location
    record.damage_notes = data.damage_notes
    record.received_by = data.received_by
    record.handling_fee = data.handling_fee or 0
    record.storage_fee = data.storage_fee or 0
    record.status = "received" if data.actual_quantity >= record.expected_quantity else "discrepancy"
    record.received_at = datetime.utcnow()
    if record.status == "received":
        shipment = db.query(Shipment).filter(Shipment.id == record.shipment_id).first()
        if shipment:
            existing = db.query(Inventory).filter(
                Inventory.shipment_id == record.shipment_id
            ).first()
            if not existing:
                related_booking = None
                if shipment.order_id:
                    related_booking = db.query(Booking).filter(Booking.order_id == shipment.order_id).first()
                item_label = (
                    (related_booking.item_name if related_booking and related_booking.item_name else None)
                    or ("بضاعة مستلمة - " + (shipment.tracking_number or ("شحنة " + str(shipment.id))))
                )
                inventory_item = Inventory(
                    name=item_label,
                    sku=generate_inventory_sku_for_receiving(),
                    quantity=data.actual_quantity,
                    unit_price=0,
                    customer_id=shipment.customer_id,
                    location=data.storage_location,
                    shipment_id=shipment.id,
                    batch_number=("حجز " + related_booking.booking_number) if related_booking else None,
                )
                db.add(inventory_item)
            if shipment.order_id:
                existing_picking = db.query(Picking).filter(
                    Picking.order_id == shipment.order_id
                ).first()
                if not existing_picking:
                    db.add(Picking(order_id=shipment.order_id, status="pending"))
    db.commit()
    db.refresh(record)
    return record
@router.patch("/{receiving_id}", response_model=ReceivingResponse)
def update_receiving(
    receiving_id: int,
    data: ReceivingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    record = db.query(Receiving).filter(Receiving.id == receiving_id, Receiving.is_archived == False).first()
    if not record:
        raise HTTPException(status_code=404, detail="Receiving record not found")
    if data.expected_quantity is not None:
        record.expected_quantity = data.expected_quantity
        if record.actual_quantity is not None:
            record.status = "received" if record.actual_quantity >= record.expected_quantity else "discrepancy"
    db.commit()
    db.refresh(record)
    return record
@router.patch("/{receiving_id}/send-receipt", response_model=ReceivingResponse)
def send_receipt(receiving_id: int, db: Session = Depends(get_db)):
    record = db.query(Receiving).filter(Receiving.id == receiving_id, Receiving.is_archived == False).first()
    if not record:
        raise HTTPException(status_code=404, detail="Receiving record not found")
    if record.status == "pending":
        raise HTTPException(status_code=400, detail="Cannot send receipt before goods are received")
    record.receipt_sent = True
    db.commit()
    db.refresh(record)
    return record
@router.delete("/{receiving_id}")
def archive_receiving(receiving_id: int, db: Session = Depends(get_db)):
    record = db.query(Receiving).filter(Receiving.id == receiving_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Receiving record not found")
    record.is_archived = True
    db.commit()
    return {"message": "Receiving record archived successfully"}
