from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

ReturnStatusLiteral = Literal["pending", "resolved"]
ConditionLiteral = Literal["good", "damaged"]
OutcomeLiteral = Literal["back_to_stock", "quarantine", "return_to_customer"]


class ReturnCreate(BaseModel):
    delivery_id: int


class ReturnResolve(BaseModel):
    condition: ConditionLiteral
    outcome: OutcomeLiteral
    notes: Optional[str] = None


class ReturnResponse(BaseModel):
    id: int
    delivery_id: int
    status: ReturnStatusLiteral
    condition: Optional[str] = None
    outcome: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    model_config = {
        "from_attributes": True
    }