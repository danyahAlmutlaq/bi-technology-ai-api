from pydantic import BaseModel
from datetime import datetime


class PaymentCreate(BaseModel):
    customer_id: int
    invoice_id: int
    amount: float
    payment_method: str


class PaymentResponse(BaseModel):
    id: int
    customer_id: int
    invoice_id: int
    amount: float
    payment_method: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
