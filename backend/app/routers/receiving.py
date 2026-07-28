from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.receiving import Receiving
from app.models.shipment import Shipment
from app.schemas.receiving import ReceivingCreate, ReceivingRecordArrival, ReceivingResponse

router = APIRouter(prefix="/receiving", tags=["Receiving"])


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
    record.status = "received" if data.actual_quantity >= record.expected_quantity else "discrepancy"
    record.received_at = datetime.utcnow()
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
