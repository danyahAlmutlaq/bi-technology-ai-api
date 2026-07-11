from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InventoryCreate(BaseModel):
    name: str
    sku: str
    quantity: int
    unit_price: float


class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    status: Optional[str] = None


class InventoryResponse(BaseModel):
    id: int
    name: str
    sku: str
    quantity: int
    unit_price: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
