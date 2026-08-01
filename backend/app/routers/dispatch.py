from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.dispatch import DispatchRoute, DispatchItem
from app.models.picking import Picking
from app.models.delivery import Delivery
from app.schemas.dispatch import DispatchCreate, DispatchUpdate, DispatchAddItem, DispatchResponse

router = APIRouter(prefix="/dispatch", tags=["Dispatch"])


def get_route_or_404(route_id: int, db: Session) -> DispatchRoute:
    route = db.query(DispatchRoute).filter(
        DispatchRoute.id == route_id, DispatchRoute.is_archived == False
    ).first()
    if not route:
        raise HTTPException(status_code=404, detail="Dispatch route not found")
    return route


@router.post("/", response_model=DispatchResponse)
def create_route(data: DispatchCreate, db: Session = Depends(get_db)):
    route = DispatchRoute(
        driver_name=data.driver_name,
        vehicle_plate=data.vehicle_plate,
        notes=data.notes,
        status="building",
    )
    db.add(route)
    db.commit()
    db.refresh(route)
    # توليد رقم الخط تلقائي بصيغة RT-00001
    route.route_number = f"RT-{route.id:05d}"
    db.commit()
    db.refresh(route)
    return route


@router.get("/", response_model=list[DispatchResponse])
def get_routes(db: Session = Depends(get_db)):
    return db.query(DispatchRoute).filter(
        DispatchRoute.is_archived == False
    ).order_by(DispatchRoute.created_at.desc()).all()


@router.put("/{route_id}", response_model=DispatchResponse)
def update_route(route_id: int, data: DispatchUpdate, db: Session = Depends(get_db)):
    route = get_route_or_404(route_id, db)
    if data.driver_name is not None:
        route.driver_name = data.driver_name
    if data.vehicle_plate is not None:
        route.vehicle_plate = data.vehicle_plate
    if data.notes is not None:
        route.notes = data.notes
    db.commit()
    db.refresh(route)
    return route


@router.post("/{route_id}/items", response_model=DispatchResponse)
def add_item(route_id: int, data: DispatchAddItem, db: Session = Depends(get_db)):
    route = get_route_or_404(route_id, db)
    if route.status != "building":
        raise HTTPException(status_code=400, detail="Cannot add items to a dispatched route")
    picking = db.query(Picking).filter(Picking.id == data.picking_id).first()
    if not picking:
        raise HTTPException(status_code=404, detail="Picking record not found")
    if picking.status != "packed":
        raise HTTPException(status_code=400, detail="Order must be packed before adding to a route")
    existing = db.query(DispatchItem).filter(DispatchItem.picking_id == data.picking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="This order is already assigned to a route")
    item = DispatchItem(dispatch_id=route_id, picking_id=data.picking_id, scanned=False)
    db.add(item)
    db.commit()
    db.refresh(route)
    return route


@router.patch("/{route_id}/items/{item_id}/scan", response_model=DispatchResponse)
def scan_item(route_id: int, item_id: int, db: Session = Depends(get_db)):
    route = get_route_or_404(route_id, db)
    item = db.query(DispatchItem).filter(
        DispatchItem.id == item_id, DispatchItem.dispatch_id == route_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Dispatch item not found")
    item.scanned = True
    db.commit()
    db.refresh(route)
    return route


@router.patch("/{route_id}/close", response_model=DispatchResponse)
def close_route(route_id: int, db: Session = Depends(get_db)):
    route = get_route_or_404(route_id, db)
    if not route.items:
        raise HTTPException(status_code=400, detail="Cannot close an empty route")
    if any(not item.scanned for item in route.items):
        raise HTTPException(status_code=400, detail="All boxes must be scanned before closing the route")
    route.status = "dispatched"
    route.dispatched_at = datetime.utcnow()
    for item in route.items:
        picking = db.query(Picking).filter(Picking.id == item.picking_id).first()
        if picking:
            picking.status = "dispatched"
            existing = db.query(Delivery).filter(
                Delivery.picking_id == picking.id, Delivery.is_archived == False
            ).first()
            if not existing:
                delivery_record = Delivery(picking_id=picking.id, status="out_for_delivery")
                db.add(delivery_record)
    db.commit()
    db.refresh(route)
    return route


@router.delete("/{route_id}")
def archive_route(route_id: int, db: Session = Depends(get_db)):
    route = get_route_or_404(route_id, db)
    route.is_archived = True
    db.commit()
    return {"message": "Dispatch route archived successfully"}