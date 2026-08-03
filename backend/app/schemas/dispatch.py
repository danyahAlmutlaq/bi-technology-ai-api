from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime

DispatchStatusLiteral = Literal["building", "dispatched"]


class DispatchCreate(BaseModel):
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    vehicle_plate: Optional[str] = None
    notes: Optional[str] = None


class DispatchUpdate(BaseModel):
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    vehicle_plate: Optional[str] = None
    notes: Optional[str] = None


class DispatchAddItem(BaseModel):
    picking_id: int
class DispatchScanInput(BaseModel):
    box_code: str


class DispatchItemResponse(BaseModel):
    id: int
    dispatch_id: int
    picking_id: int
    scanned: bool
    model_config = {
        "from_attributes": True
    }


class DispatchResponse(BaseModel):
    id: int
    route_number: Optional[str] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    vehicle_plate: Optional[str] = None
    status: DispatchStatusLiteral
    notes: Optional[str] = None
    created_at: datetime
    dispatched_at: Optional[datetime] = None
    items: List[DispatchItemResponse] = []
    model_config = {
        "from_attributes": True
    }