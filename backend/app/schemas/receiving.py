from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReceivingCreate(BaseModel):
    shipment_id: int
    expected_quantity: int


class ReceivingRecordArrival(BaseModel):
    actual_quantity: int
    storage_location: Optional[str] = None
    damage_notes: Optional[str] = None


class ReceivingResponse(BaseModel):
    id: int
    shipment_id: int
    expected_quantity: int
    actual_quantity: Optional[int] = None
    storage_location: Optional[str] = None
    damage_notes: Optional[str] = None
    status: str
    receipt_sent: bool
    received_at: Optional[datetime] = None
    created_at: datetime
    model_config = {
        "from_attributes": True
    }
