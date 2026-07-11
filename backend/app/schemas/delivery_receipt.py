from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DeliveryReceiptCreate(BaseModel):
    shipment_id: int
    recipient_name: str
    proof_image_url: Optional[str] = None
    notes: Optional[str] = None


class DeliveryReceiptUpdate(BaseModel):
    recipient_name: Optional[str] = None
    proof_image_url: Optional[str] = None
    notes: Optional[str] = None


class DeliveryReceiptResponse(BaseModel):
    id: int
    shipment_id: int
    recipient_name: str
    proof_image_url: Optional[str]
    notes: Optional[str]
    is_archived: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
