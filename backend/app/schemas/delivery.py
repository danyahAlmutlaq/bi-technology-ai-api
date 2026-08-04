from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
DeliveryStatusLiteral = Literal["out_for_delivery", "delivered", "failed"]
class DeliveryCreate(BaseModel):
    picking_id: int
class DeliveryComplete(BaseModel):
    recipient_name: str
    proof_image_url: Optional[str] = None
    cash_collected: float = 0
    notes: Optional[str] = None
    delivery_fee: Optional[float] = None
class DeliveryFail(BaseModel):
    failure_reason: str
    notes: Optional[str] = None
class DeliveryResponse(BaseModel):
    id: int
    picking_id: int
    status: DeliveryStatusLiteral
    recipient_name: Optional[str] = None
    proof_image_url: Optional[str] = None
    cash_collected: float
    failure_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    delivered_at: Optional[datetime] = None
    delivery_fee: float = 0
    model_config = {
        "from_attributes": True
    }
