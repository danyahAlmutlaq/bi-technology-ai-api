from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InventoryCreate(BaseModel):
    name: str
    quantity: int
    unit_price: float
    customer_id: int
    category: Optional[str] = "عام"
    warehouse: Optional[str] = "المستودع الرئيسي"
    location: Optional[str] = None
    batch_number: Optional[str] = None
    shipment_id: Optional[int] = None
    minimum: Optional[int] = 5
    maximum: Optional[int] = 50


class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    status: Optional[str] = None
    category: Optional[str] = None
    warehouse: Optional[str] = None
    location: Optional[str] = None
    batch_number: Optional[str] = None
    shipment_id: Optional[int] = None
    customer_id: Optional[int] = None
    minimum: Optional[int] = None
    maximum: Optional[int] = None
    movement: Optional[int] = None


class InventoryResponse(BaseModel):
    id: int
    name: str
    sku: str
    quantity: int
    unit_price: float
    status: str
    category: Optional[str] = None
    warehouse: Optional[str] = None
    location: Optional[str] = None
    batch_number: Optional[str] = None
    shipment_id: Optional[int] = None
    customer_id: Optional[int] = None
    minimum: int
    maximum: int
    movement: int
    created_at: datetime
    model_config = {
        "from_attributes": True
    }
