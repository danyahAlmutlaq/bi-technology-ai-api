from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None
    receipt_file: Optional[str] = None
    approved_by: Optional[int] = None


class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    receipt_file: Optional[str] = None
    approved_by: Optional[int] = None
    status: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    category: str
    amount: float
    description: Optional[str]
    receipt_file: Optional[str]
    approved_by: Optional[int]
    status: str
    is_archived: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
