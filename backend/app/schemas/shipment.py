from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ShipmentCreate(BaseModel):
    customer_id: int
    delivery_company_id: int
    shipping_cost: float = 0.0
    service_type: Optional[str] = "domestic"
    notes: Optional[str] = None


class ShipmentUpdate(BaseModel):
    tracking_number: Optional[str] = None
    shipping_cost: Optional[float] = None
    service_type: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ShipmentResponse(BaseModel):
    id: int
    customer_id: int
    delivery_company_id: int
    tracking_number: Optional[str]
    shipping_cost: float
    service_type: Optional[str]
    status: str
    notes: Optional[str]
    created_at: datetime
    model_config = {
        "from_attributes": True
    }