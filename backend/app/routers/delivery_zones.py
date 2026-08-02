from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.delivery_zone import DeliveryZone
from app.schemas.delivery_zone import DeliveryZoneCreate, DeliveryZoneUpdate, DeliveryZoneResponse

router = APIRouter(prefix="/delivery-zones", tags=["Delivery Zones"])


@router.get("/", response_model=list[DeliveryZoneResponse])
def list_delivery_zones(db: Session = Depends(get_db)):
    return db.query(DeliveryZone).order_by(DeliveryZone.name.asc()).all()


@router.post("/", response_model=DeliveryZoneResponse, status_code=201)
def create_delivery_zone(data: DeliveryZoneCreate, db: Session = Depends(get_db)):
    existing = db.query(DeliveryZone).filter(DeliveryZone.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="توجد منطقة بنفس الاسم")
    zone = DeliveryZone(name=data.name, city=data.city)
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone


@router.put("/{zone_id}", response_model=DeliveryZoneResponse)
def update_delivery_zone(zone_id: int, data: DeliveryZoneUpdate, db: Session = Depends(get_db)):
    zone = db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="المنطقة غير موجودة")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(zone, field, value)
    db.commit()
    db.refresh(zone)
    return zone


@router.delete("/{zone_id}")
def archive_delivery_zone(zone_id: int, db: Session = Depends(get_db)):
    zone = db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="المنطقة غير موجودة")
    zone.is_active = False
    db.commit()
    return {"message": "Delivery zone archived successfully"}
