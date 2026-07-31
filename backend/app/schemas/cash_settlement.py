from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime

CashSettlementStatusLiteral = Literal["pending", "settled"]


class PendingDeliveryItem(BaseModel):
    delivery_id: int
    picking_id: int
    recipient_name: Optional[str] = None
    cash_collected: float
    delivered_at: Optional[datetime] = None


class PendingDriverGroup(BaseModel):
    driver_name: str
    total_amount: float
    deliveries: List[PendingDeliveryItem]


class CashSettlementCreate(BaseModel):
    driver_name: str
    notes: Optional[str] = None


class CashSettlementItemResponse(BaseModel):
    id: int
    delivery_id: int
    amount: float
    model_config = {"from_attributes": True}


class CashSettlementResponse(BaseModel):
    id: int
    driver_name: str
    total_amount: float
    status: CashSettlementStatusLiteral
    notes: Optional[str] = None
    created_at: datetime
    settled_at: Optional[datetime] = None
    items: List[CashSettlementItemResponse] = []
    model_config = {"from_attributes": True}