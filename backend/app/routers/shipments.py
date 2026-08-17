from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models.customer import Customer
from app.models.delivery_company import DeliveryCompany
from app.models.shipment import Shipment
from app.models.customs import CustomsClearance
from app.models.receiving import Receiving
from app.models.booking import Booking
from datetime import datetime
from app.finance import get_order_financials
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentResponse

router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("/migrate-container-type")
def migrate_container_type(db: Session = Depends(get_db)):
    try:
        db.execute(text("ALTER TABLE shipments ADD COLUMN container_type VARCHAR"))
        db.commit()
        return {"status": "added"}
    except Exception as exc:
        db.rollback()
        return {"status": "already_exists_or_skipped", "detail": str(exc)}


def attach_shipment_financials(shipment: Shipment, db: Session) -> Shipment:
    fin = get_order_financials(shipment.order_id, db)
    shipment.total_invoiced = fin["total_invoiced"]
    shipment.total_paid = fin["total_paid"]
    shipment.balance = fin["balance"]
    shipment.financial_status = fin["financial_status"]
    return shipment


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
        shipping_cost=shipment_data.shipping_cost,
        service_type=shipment_data.service_type,
        container_number=shipment_data.container_number,
        container_type=shipment_data.container_type,
        bill_of_lading_number=shipment_data.bill_of_lading_number,
        vessel_name=shipment_data.vessel_name,
        arrival_date=shipment_data.arrival_date,
        notes=shipment_data.notes
    )
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    # توليد رقم التتبع تلقائي بصيغة SHP-00001 بعد ما نعرف الـ id
    shipment.tracking_number = f"SHP-{shipment.id:05d}"
    db.commit()
    db.refresh(shipment)
    return attach_shipment_financials(shipment, db)


@router.get("/", response_model=list[ShipmentResponse])
def get_shipments(db: Session = Depends(get_db)):
    shipments = db.query(Shipment).all()
    return [attach_shipment_financials(s, db) for s in shipments]


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return attach_shipment_financials(shipment, db)


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
    if shipment_data.service_type is not None:
        shipment.service_type = shipment_data.service_type
    if shipment_data.container_number is not None:
        shipment.container_number = shipment_data.container_number
    if shipment_data.container_type is not None:
        shipment.container_type = shipment_data.container_type
    if shipment_data.bill_of_lading_number is not None:
        shipment.bill_of_lading_number = shipment_data.bill_of_lading_number
    if shipment_data.vessel_name is not None:
        shipment.vessel_name = shipment_data.vessel_name
    if shipment_data.arrival_date is not None:
        shipment.arrival_date = shipment_data.arrival_date
    if shipment_data.status is not None:
        shipment.status = shipment_data.status
        if shipment_data.status == "in_transit" and shipment.service_type == "international":
            existing = db.query(CustomsClearance).filter(
                CustomsClearance.shipment_id == shipment.id
            ).first()
            if not existing:
                customs_record = CustomsClearance(
                    shipment_id=shipment.id,
                    status="pending",
                    notes="تم الإنشاء تلقائيًا من الشحنة " + (shipment.tracking_number or str(shipment.id)),
                )
                db.add(customs_record)
        if shipment_data.status == "customs_cleared" and shipment.service_type == "international":
            customs_record2 = db.query(CustomsClearance).filter(
                CustomsClearance.shipment_id == shipment.id
            ).first()
            if customs_record2 and customs_record2.status != "released":
                customs_record2.status = "released"
                if customs_record2.released_at is None:
                    customs_record2.released_at = datetime.utcnow()
            existing_receiving = db.query(Receiving).filter(
                Receiving.shipment_id == shipment.id
            ).first()
            if not existing_receiving:
                expected_qty = 1
                if shipment.order_id:
                    linked_booking = db.query(Booking).filter(
                        Booking.order_id == shipment.order_id
                    ).first()
                    if linked_booking and linked_booking.package_count:
                        expected_qty = linked_booking.package_count
                receiving_record = Receiving(
                    shipment_id=shipment.id,
                    expected_quantity=expected_qty,
                    status="pending",
                )
                db.add(receiving_record)
    if shipment_data.notes is not None:
        shipment.notes = shipment_data.notes
    db.commit()
    db.refresh(shipment)
    return attach_shipment_financials(shipment, db)


@router.delete("/{shipment_id}")
def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    db.delete(shipment)
    db.commit()
    return {"message": "Shipment deleted successfully"}
