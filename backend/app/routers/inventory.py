from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
    InventoryResponse,
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.post("/", response_model=InventoryResponse)
def create_inventory(
    inventory_data: InventoryCreate,
    db: Session = Depends(get_db)
):

    inventory = Inventory(
        name=inventory_data.name,
        sku=inventory_data.sku,
        quantity=inventory_data.quantity,
        unit_price=inventory_data.unit_price,
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
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

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
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    db.delete(inventory)
    db.commit()

    return {
        "message": "Inventory deleted successfully"
    }
