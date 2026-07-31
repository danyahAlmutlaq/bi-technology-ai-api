from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

PickingStatusLiteral = Literal["pending", "picking", "missing", "packed", "dispatched", "delivered"]
class PickingCreate(BaseModel):
    order_id: int


class PickingReportMissing(BaseModel):
    missing_notes: str


class PickingResponse(BaseModel):
    id: int
    order_id: int
    status: PickingStatusLiteral
    delivery_number: Optional[str] = None
    missing_notes: Optional[str] = None
    created_at: datetime
    packed_at: Optional[datetime] = None
    model_config = {
        "from_attributes": True
    }