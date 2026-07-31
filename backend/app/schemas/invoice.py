from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class InvoiceCreate(BaseModel):
    customer_id: int
    amount: float


class InvoiceUpdate(BaseModel):
    status: Optional[str] = None


class InvoiceLineItemResponse(BaseModel):
    id: int
    source_type: str
    source_id: int
    description: str
    amount: float
    model_config = {
        "from_attributes": True
    }


class InvoiceResponse(BaseModel):
    id: int
    customer_id: int
    invoice_number: str
    amount: float
    tax_amount: float
    total: float
    status: str
    created_at: datetime
    items: List[InvoiceLineItemResponse] = []
    model_config = {
        "from_attributes": True
    }