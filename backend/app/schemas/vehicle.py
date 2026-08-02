from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VehicleCreate(BaseModel):
    plate: str
    driver_name: Optional[str] = None
    capacity: Optional[str] = None


class VehicleUpdate(BaseModel):
    plate: Optional[str] = None
    driver_name: Optional[str] = None
    capacity: Optional[str] = None
    is_active: Optional[bool] = None


class VehicleResponse(BaseModel):
    id: int
    plate: str
    driver_name: Optional[str] = None
    capacity: Optional[str] = None
    is_active: bool
    created_at: datetime
    model_config = {
        "from_attributes": True
    }
