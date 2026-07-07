from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InvoiceCreate(BaseModel):
    customer_id: int
    invoice_number: str
    amount: float


class InvoiceUpdate(BaseModel):
    status: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: int
    customer_id: int
    invoice_number: str
    amount: float
    tax_amount: float
    total: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
