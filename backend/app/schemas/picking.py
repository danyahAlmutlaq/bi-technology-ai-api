from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
PickingStatusLiteral = Literal["pending", "picking", "missing", "packed", "dispatched", "delivered"]
class PickingCreate(BaseModel):
    order_id: int
class PickingReportMissing(BaseModel):
    missing_notes: str
class PickingPackPayload(BaseModel):
    packing_fee: Optional[float] = None
class PickingResponse(BaseModel):
    id: int
    order_id: int
    status: PickingStatusLiteral
    delivery_number: Optional[str] = None
    missing_notes: Optional[str] = None
    created_at: datetime
    packed_at: Optional[datetime] = None
    box_code: Optional[str] = None
    packing_fee: float = 0
    model_config = {
        "from_attributes": True
    }
