from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.delivery_company import DeliveryCompany
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentResponse


router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("/", response_model=ShipmentResponse)
def create_shipment(shipment_data: ShipmentCreate, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == shipment_data.customer_id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    delivery_company = db.query(DeliveryCompany).filter(
        DeliveryCompany.id == shipment_data.delivery_company_id
    ).first()

    if not delivery_company:
        raise HTTPException(status_code=404, detail="Delivery company not found")

    shipment = Shipment(
        customer_id=shipment_data.customer_id,
        delivery_company_id=shipment_data.delivery_company_id,
        tracking_number=shipment_data.tracking_number,
        shipping_cost=shipment_data.shipping_cost,
        notes=shipment_data.notes
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return shipment


@router.get("/", response_model=list[ShipmentResponse])
def get_shipments(db: Session = Depends(get_db)):

    shipments = db.query(Shipment).all()

    return shipments


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):

    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    return shipment


@router.put("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(
    shipment_id: int,
    shipment_data: ShipmentUpdate,
    db: Session = Depends(get_db)
):

    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    if shipment_data.tracking_number is not None:
        shipment.tracking_number = shipment_data.tracking_number

    if shipment_data.shipping_cost is not None:
        shipment.shipping_cost = shipment_data.shipping_cost

    if shipment_data.status is not None:
        shipment.status = shipment_data.status

    if shipment_data.notes is not None:
        shipment.notes = shipment_data.notes

    db.commit()
    db.refresh(shipment)

    return shipment


@router.delete("/{shipment_id}")
def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):

    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()

    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    db.delete(shipment)
    db.commit()

    return {"message": "Shipment deleted successfully"}
