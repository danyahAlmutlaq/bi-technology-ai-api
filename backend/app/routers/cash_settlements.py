from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.delivery import Delivery
from app.models.dispatch import DispatchItem, DispatchRoute
from app.models.cash_settlement import CashSettlement, CashSettlementItem
from app.schemas.cash_settlement import (
    PendingDriverGroup,
    PendingDeliveryItem,
    CashSettlementCreate,
    CashSettlementConfirm,
    CashSettlementResponse,
)

router = APIRouter(prefix="/cash", tags=["Cash (COD)"])


def get_driver_name(delivery: Delivery, db: Session):
    item = db.query(DispatchItem).filter(DispatchItem.picking_id == delivery.picking_id).first()
    if not item:
        return None
    route = db.query(DispatchRoute).filter(DispatchRoute.id == item.dispatch_id).first()
    return route.driver_name if route else None


@router.get("/pending", response_model=list[PendingDriverGroup])
def get_pending_cash(db: Session = Depends(get_db)):
    settled_ids = {row[0] for row in db.query(CashSettlementItem.delivery_id).all()}
    deliveries = db.query(Delivery).filter(
        Delivery.status == "delivered",
        Delivery.cash_collected > 0,
    ).all()
    groups: dict[str, list[Delivery]] = {}
    for delivery in deliveries:
        if delivery.id in settled_ids:
            continue
        driver_name = get_driver_name(delivery, db) or "غير محدد"
        groups.setdefault(driver_name, []).append(delivery)
    result = []
    for driver_name, items in groups.items():
        result.append(PendingDriverGroup(
            driver_name=driver_name,
            total_amount=sum(d.cash_collected for d in items),
            deliveries=[
                PendingDeliveryItem(
                    delivery_id=d.id,
                    picking_id=d.picking_id,
                    recipient_name=d.recipient_name,
                    cash_collected=d.cash_collected,
                    delivered_at=d.delivered_at,
                ) for d in items
            ],
        ))
    return result


@router.post("/settlements", response_model=CashSettlementResponse)
def create_settlement(data: CashSettlementCreate, db: Session = Depends(get_db)):
    settled_ids = {row[0] for row in db.query(CashSettlementItem.delivery_id).all()}
    deliveries = db.query(Delivery).filter(
        Delivery.status == "delivered",
        Delivery.cash_collected > 0,
    ).all()
    driver_deliveries = [
        d for d in deliveries
        if d.id not in settled_ids and (get_driver_name(d, db) or "غير محدد") == data.driver_name
    ]
    if not driver_deliveries:
        raise HTTPException(status_code=400, detail="No pending cash for this driver")
    total = sum(d.cash_collected for d in driver_deliveries)
    settlement = CashSettlement(driver_name=data.driver_name, total_amount=total, status="pending", notes=data.notes)
    db.add(settlement)
    db.commit()
    db.refresh(settlement)
    for d in driver_deliveries:
        db.add(CashSettlementItem(settlement_id=settlement.id, delivery_id=d.id, amount=d.cash_collected))
    db.commit()
    db.refresh(settlement)
    return settlement


@router.get("/settlements", response_model=list[CashSettlementResponse])
def get_settlements(db: Session = Depends(get_db)):
    settlements = db.query(CashSettlement).order_by(CashSettlement.created_at.desc()).all()
    delivery_ids = {item.delivery_id for settlement in settlements for item in settlement.items}
    deliveries_by_id = {}
    if delivery_ids:
        for d in db.query(Delivery).filter(Delivery.id.in_(delivery_ids)).all():
            deliveries_by_id[d.id] = d
    for settlement in settlements:
        for item in settlement.items:
            delivery = deliveries_by_id.get(item.delivery_id)
            item.recipient_name = delivery.recipient_name if delivery else None
            item.delivered_at = delivery.delivered_at if delivery else None
    return settlements


@router.patch("/settlements/{settlement_id}/confirm", response_model=CashSettlementResponse)
def confirm_settlement(settlement_id: int, data: CashSettlementConfirm, db: Session = Depends(get_db)):
    settlement = db.query(CashSettlement).filter(CashSettlement.id == settlement_id).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")
    if settlement.status != "pending":
        raise HTTPException(status_code=400, detail="Settlement already confirmed")
    discrepancy = round(data.counted_amount - settlement.total_amount, 2)
    if abs(discrepancy) > 0.01:
        raise HTTPException(
            status_code=400,
            detail=(
                "يوجد فرق قدره "
                + f"{abs(discrepancy):.2f}"
                + " ر.س بين المبلغ المُستلم ("
                + f"{data.counted_amount:.2f}"
                + ") والمبلغ المتوقع بالنظام ("
                + f"{settlement.total_amount:.2f}"
                + "). تحققي من المبلغ قبل التأكيد."
            ),
        )
    settlement.counted_amount = data.counted_amount
    settlement.discrepancy = discrepancy
    settlement.status = "settled"
    settlement.settled_at = datetime.utcnow()
    db.commit()
    db.refresh(settlement)
    return settlement