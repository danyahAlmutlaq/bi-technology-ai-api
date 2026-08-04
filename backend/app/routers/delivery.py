from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.delivery import Delivery
from app.models.picking import Picking
from app.models.return_record import ReturnRecord
from app.models.user import User
from app.routers.auth import get_current_user
from app.finance import get_order_financials
from app.schemas.delivery import DeliveryCreate, DeliveryComplete, DeliveryFail, DeliveryResponse

router = APIRouter(prefix="/delivery", tags=["Delivery"])


def get_delivery_or_404(delivery_id: int, db: Session) -> Delivery:
    record = db.query(Delivery).filter(
        Delivery.id == delivery_id, Delivery.is_archived == False
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Delivery record not found")
    return record


@router.post("/", response_model=DeliveryResponse)
def create_delivery(data: DeliveryCreate, db: Session = Depends(get_db)):
    picking = db.query(Picking).filter(Picking.id == data.picking_id).first()
    if not picking:
        raise HTTPException(status_code=404, detail="Picking record not found")
    if picking.status != "dispatched":
        raise HTTPException(status_code=400, detail="Order must be dispatched before starting delivery")
    existing = db.query(Delivery).filter(
        Delivery.picking_id == data.picking_id, Delivery.is_archived == False
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A delivery record already exists for this order")
    record = Delivery(picking_id=data.picking_id, status="out_for_delivery")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=list[DeliveryResponse])
def get_deliveries(db: Session = Depends(get_db)):
    return db.query(Delivery).filter(
        Delivery.is_archived == False
    ).order_by(Delivery.created_at.desc()).all()


@router.patch("/{delivery_id}/complete", response_model=DeliveryResponse)
def complete_delivery(delivery_id: int, data: DeliveryComplete, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = get_delivery_or_404(delivery_id, db)
    if record.status != "out_for_delivery":
        raise HTTPException(status_code=400, detail="Delivery is not out for delivery")
    gate_picking = db.query(Picking).filter(Picking.id == record.picking_id).first()
    if gate_picking and gate_picking.order_id:
        fin = get_order_financials(gate_picking.order_id, db)
        if fin["financial_status"] in ("unpaid", "partial") and current_user.role != "مدير النظام":
            raise HTTPException(
                status_code=403,
                detail=f"يوجد مستحقات على هذا الطلب بقيمة {fin['balance']:.0f} ريال - إكمال التسليم يحتاج موافقة مدير النظام",
            )
    record.status = "delivered"
    record.recipient_name = data.recipient_name
    record.proof_image_url = data.proof_image_url
    record.cash_collected = data.cash_collected
    record.notes = data.notes
    record.delivered_at = datetime.utcnow()
    picking = db.query(Picking).filter(Picking.id == record.picking_id).first()
    if picking:
        picking.status = "delivered"
    db.commit()
    db.refresh(record)
    return record


@router.patch("/{delivery_id}/fail", response_model=DeliveryResponse)
def fail_delivery(delivery_id: int, data: DeliveryFail, db: Session = Depends(get_db)):
    record = get_delivery_or_404(delivery_id, db)
    if record.status != "out_for_delivery":
        raise HTTPException(status_code=400, detail="Delivery is not out for delivery")
    record.status = "failed"
    record.failure_reason = data.failure_reason
    record.notes = data.notes
    existing = db.query(ReturnRecord).filter(
        ReturnRecord.delivery_id == record.id, ReturnRecord.is_archived == False
    ).first()
    if not existing:
        return_record = ReturnRecord(delivery_id=record.id, status="pending")
        db.add(return_record)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{delivery_id}")
def archive_delivery(delivery_id: int, db: Session = Depends(get_db)):
    record = get_delivery_or_404(delivery_id, db)
    record.is_archived = True
    db.commit()
    return {"message": "Delivery record archived successfully"}
