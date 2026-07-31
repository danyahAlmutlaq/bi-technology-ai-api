from pydantic import BaseModel
from typing import List, Literal


class PendingChargeItem(BaseModel):
    source_type: Literal["order", "shipment", "customs"]
    source_id: int
    description: str
    amount: float


class PendingCustomerCharges(BaseModel):
    customer_id: int
    customer_name: str
    total_amount: float
    items: List[PendingChargeItem]


class GenerateInvoiceRequest(BaseModel):
    customer_id: int