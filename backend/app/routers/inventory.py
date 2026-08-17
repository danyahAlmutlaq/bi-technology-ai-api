from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.inventory import Inventory
from app.models.customer import Customer
from app.models.inventory_movement import InventoryMovement
from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
    InventoryResponse,
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


def generate_sku(category: str | None) -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    suffix = uuid4().hex[:6].upper()
    return f"INV-{today}-{suffix}"


def get_active_customer(customer_id: int, db: Session) -> Customer:
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.is_archived == False,
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("/", response_model=InventoryResponse)
def create_inventory(
    inventory_data: InventoryCreate,
    db: Session = Depends(get_db)
):
    get_active_customer(inventory_data.customer_id, db)
    inventory = Inventory(
        name=inventory_data.name,
        sku=generate_sku(inventory_data.category),
        quantity=inventory_data.quantity,
        unit_price=inventory_data.unit_price,
        customer_id=inventory_data.customer_id,
        category=inventory_data.category,
        warehouse=inventory_data.warehouse,
        location=inventory_data.location,
        batch_number=inventory_data.batch_number,
        shipment_id=inventory_data.shipment_id,
        minimum=inventory_data.minimum,
        maximum=inventory_data.maximum,
    )
    db.add(inventory)
    db.commit()
    db.refresh(inventory)
    return inventory


@router.get("/", response_model=list[InventoryResponse])
def get_inventory(db: Session = Depends(get_db)):
    inventory = db.query(Inventory).all()
    return inventory


@router.put("/{inventory_id}", response_model=InventoryResponse)
def update_inventory(
    inventory_id: int,
    inventory_data: InventoryUpdate,
    db: Session = Depends(get_db)
):
    inventory = db.query(Inventory).filter(
        Inventory.id == inventory_id
    ).first()
    if not inventory:
        raise HTTPException(status_code=404, detail="Item not found")
    _quantity_before_update = inventory.quantity
    if inventory_data.customer_id is not None:
        get_active_customer(inventory_data.customer_id, db)
        inventory.customer_id = inventory_data.customer_id
    if inventory_data.name is not None:
        inventory.name = inventory_data.name
    if inventory_data.sku is not None:
        inventory.sku = inventory_data.sku
    if inventory_data.quantity is not None:
        inventory.quantity = inventory_data.quantity
    if inventory_data.unit_price is not None:
        inventory.unit_price = inventory_data.unit_price
    if inventory_data.status is not None:
        inventory.status = inventory_data.status
    if inventory_data.category is not None:
        inventory.category = inventory_data.category
    if inventory_data.warehouse is not None:
        inventory.warehouse = inventory_data.warehouse
    if inventory_data.location is not None:
        inventory.location = inventory_data.location
    if inventory_data.batch_number is not None:
        inventory.batch_number = inventory_data.batch_number
    if inventory_data.shipment_id is not None:
        inventory.shipment_id = inventory_data.shipment_id
    if inventory_data.minimum is not None:
        inventory.minimum = inventory_data.minimum
    if inventory_data.maximum is not None:
        inventory.maximum = inventory_data.maximum
    if inventory_data.movement is not None:
        inventory.movement = inventory_data.movement
    if inventory.quantity != _quantity_before_update:
        delta = inventory.quantity - _quantity_before_update
        db.add(InventoryMovement(
            inventory_id=inventory.id,
            movement_type="in" if delta > 0 else "out",
            quantity=abs(delta),
            balance_after=inventory.quantity,
            reference="تعديل يدوي للكمية",
        ))
    db.commit()
    db.refresh(inventory)
    return inventory


@router.patch("/{inventory_id}/restock", response_model=InventoryResponse)
def restock_inventory(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    inventory = db.query(Inventory).filter(
        Inventory.id == inventory_id
    ).first()
    if not inventory:
        raise HTTPException(status_code=404, detail="Item not found")
    add_amount = max(inventory.minimum, 10)
    old_quantity = inventory.quantity
    inventory.quantity = min(inventory.maximum, inventory.quantity + add_amount)
    inventory.movement = abs(inventory.movement) + 5
    actual_added = inventory.quantity - old_quantity
    if actual_added > 0:
        db.add(InventoryMovement(
            inventory_id=inventory.id,
            movement_type="in",
            quantity=actual_added,
            balance_after=inventory.quantity,
            reference="توريد",
        ))
    db.commit()
    db.refresh(inventory)
    return inventory


@router.delete("/{inventory_id}")
def delete_inventory(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    inventory = db.query(Inventory).filter(
        Inventory.id == inventory_id
    ).first()
    if not inventory:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(inventory)
    db.commit()
    return {"message": "Inventory deleted successfully"}


@router.get("/{inventory_id}/movements")
def get_inventory_movements(inventory_id: int, db: Session = Depends(get_db)):
    movements = (
        db.query(InventoryMovement)
        .filter(InventoryMovement.inventory_id == inventory_id)
        .order_by(InventoryMovement.created_at.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "inventory_id": m.inventory_id,
            "movement_type": m.movement_type,
            "quantity": m.quantity,
            "balance_after": m.balance_after,
            "reference": m.reference,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in movements
    ]
