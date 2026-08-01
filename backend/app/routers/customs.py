from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customs import CustomsClearance
from app.models.shipment import Shipment
from app.models.receiving import Receiving
from app.schemas.customs import CustomsCreate, CustomsUpdate, CustomsResponse

router = APIRouter(prefix="/customs", tags=["Customs"])


def get_shipment_or_404(shipment_id: int, db: Session) -> Shipment:
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@router.post("/", response_model=CustomsResponse)
def create_customs(data: CustomsCreate, db: Session = Depends(get_db)):
    get_shipment_or_404(data.shipment_id, db)
    record = CustomsClearance(
        shipment_id=data.shipment_id,
        duty_amount=data.duty_amount,
        vat_amount=data.vat_amount,
        port_charges=data.port_charges,
        free_time_expiry=data.free_time_expiry,
        notes=data.notes,
        status="pending",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=list[CustomsResponse])
def get_customs_list(db: Session = Depends(get_db)):
    return db.query(CustomsClearance).filter(CustomsClearance.is_archived == False).order_by(CustomsClearance.created_at.desc()).all()


@router.put("/{customs_id}", response_model=CustomsResponse)
def update_customs(customs_id: int, data: CustomsUpdate, db: Session = Depends(get_db)):
    record = db.query(CustomsClearance).filter(CustomsClearance.id == customs_id, CustomsClearance.is_archived == False).first()
    if not record:
        raise HTTPException(status_code=404, detail="Customs record not found")
    if data.status is not None:
        record.status = data.status
        if data.status == "released" and record.released_at is None:
            record.released_at = datetime.utcnow()
            existing = db.query(Receiving).filter(
                Receiving.shipment_id == record.shipment_id
            ).first()
            if not existing:
                receiving_record = Receiving(
                    shipment_id=record.shipment_id,
                    expected_quantity=1,
                    status="pending",
                )
                db.add(receiving_record)
    if data.duty_amount is not None:
        record.duty_amount = data.duty_amount
    if data.vat_amount is not None:
        record.vat_amount = data.vat_amount
    if data.port_charges is not None:
        record.port_charges = data.port_charges
    if data.free_time_expiry is not None:
        record.free_time_expiry = data.free_time_expiry
    if data.notes is not None:
        record.notes = data.notes
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{customs_id}")
def archive_customs(customs_id: int, db: Session = Depends(get_db)):
    record = db.query(CustomsClearance).filter(CustomsClearance.id == customs_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Customs record not found")
    record.is_archived = True
    db.commit()
    return {"message": "Customs record archived successfully"}
