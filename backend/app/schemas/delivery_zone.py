from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DeliveryZoneCreate(BaseModel):
    name: str
    city: Optional[str] = None


class DeliveryZoneUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    is_active: Optional[bool] = None


class DeliveryZoneResponse(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    is_active: bool
    created_at: datetime
    model_config = {
        "from_attributes": True
    }
