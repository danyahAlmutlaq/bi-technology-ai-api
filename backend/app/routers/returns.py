from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.return_record import ReturnRecord
from app.models.delivery import Delivery
from app.schemas.return_record import ReturnCreate, ReturnResolve, ReturnResponse

router = APIRouter(prefix="/returns", tags=["Returns"])


def get_return_or_404(return_id: int, db: Session) -> ReturnRecord:
    record = db.query(ReturnRecord).filter(
        ReturnRecord.id == return_id, ReturnRecord.is_archived == False
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Return record not found")
    return record


@router.post("/", response_model=ReturnResponse)
def create_return(data: ReturnCreate, db: Session = Depends(get_db)):
    delivery = db.query(Delivery).filter(Delivery.id == data.delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery record not found")
    if delivery.status != "failed":
        raise HTTPException(status_code=400, detail="Only failed deliveries can be returned")
    existing = db.query(ReturnRecord).filter(
        ReturnRecord.delivery_id == data.delivery_id, ReturnRecord.is_archived == False
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A return record already exists for this delivery")
    record = ReturnRecord(delivery_id=data.delivery_id, status="pending")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=list[ReturnResponse])
def get_returns(db: Session = Depends(get_db)):
    return db.query(ReturnRecord).filter(
        ReturnRecord.is_archived == False
    ).order_by(ReturnRecord.created_at.desc()).all()


@router.patch("/{return_id}/resolve", response_model=ReturnResponse)
def resolve_return(return_id: int, data: ReturnResolve, db: Session = Depends(get_db)):
    record = get_return_or_404(return_id, db)
    if record.status != "pending":
        raise HTTPException(status_code=400, detail="Return already resolved")
    record.status = "resolved"
    record.condition = data.condition
    record.outcome = data.outcome
    record.notes = data.notes
    record.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{return_id}")
def archive_return(return_id: int, db: Session = Depends(get_db)):
    record = get_return_or_404(return_id, db)
    record.is_archived = True
    db.commit()
    return {"message": "Return record archived successfully"}