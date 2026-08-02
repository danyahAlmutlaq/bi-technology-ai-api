from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.picking import Picking
from app.models.order import Order
from app.schemas.picking import PickingCreate, PickingReportMissing, PickingResponse

router = APIRouter(prefix="/picking", tags=["Picking & Packing"])


def get_order_or_404(order_id: int, db: Session) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def get_picking_or_404(picking_id: int, db: Session) -> Picking:
    record = db.query(Picking).filter(
        Picking.id == picking_id, Picking.is_archived == False
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Picking record not found")
    return record


@router.post("/", response_model=PickingResponse)
def create_picking(data: PickingCreate, db: Session = Depends(get_db)):
    get_order_or_404(data.order_id, db)
    record = Picking(order_id=data.order_id, status="pending")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=list[PickingResponse])
def get_picking_list(db: Session = Depends(get_db)):
    return db.query(Picking).filter(
        Picking.is_archived == False
    ).order_by(Picking.created_at.desc()).all()


@router.patch("/{picking_id}/start", response_model=PickingResponse)
def start_picking(picking_id: int, db: Session = Depends(get_db)):
    record = get_picking_or_404(picking_id, db)
    if record.status not in ("pending", "missing"):
        raise HTTPException(status_code=400, detail="Cannot start picking from current status")
    record.status = "picking"
    db.commit()
    db.refresh(record)
    return record


@router.patch("/{picking_id}/report-missing", response_model=PickingResponse)
def report_missing(picking_id: int, data: PickingReportMissing, db: Session = Depends(get_db)):
    record = get_picking_or_404(picking_id, db)
    if record.status != "picking":
        raise HTTPException(status_code=400, detail="Can only report missing items while picking")
    record.status = "missing"
    record.missing_notes = data.missing_notes
    db.commit()
    db.refresh(record)
    return record


@router.patch("/{picking_id}/pack", response_model=PickingResponse)
def pack_order(picking_id: int, db: Session = Depends(get_db)):
    record = get_picking_or_404(picking_id, db)
    if record.status != "picking":
        raise HTTPException(status_code=400, detail="Order must be in picking status before packing")
    record.status = "packed"
    record.delivery_number = f"DLV-{record.id:05d}"
    record.packed_at = datetime.utcnow()
    record.box_code = f"BOX-{record.id:05d}"
    order = db.query(Order).filter(Order.id == record.order_id).first()
    if order:
        order.shipment_ready = True
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{picking_id}")
def archive_picking(picking_id: int, db: Session = Depends(get_db)):
    record = get_picking_or_404(picking_id, db)
    record.is_archived = True
    db.commit()
    return {"message": "Picking record archived successfully"}