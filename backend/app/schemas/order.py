from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

OrderStatusLiteral = Literal["new", "pending_approval", "in_progress", "ready_to_ship", "completed"]
OrderPriorityLiteral = Literal["high", "medium", "normal"]


class OrderBase(BaseModel):
    customer_id: int
    title: str
    amount: float = 0
    priority: OrderPriorityLiteral = "normal"
    due_date: Optional[str] = None
    owner: Optional[str] = None
    notes: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    recipient_name: Optional[str] = None
    recipient_phone: Optional[str] = None
    recipient_address: Optional[str] = None
    service_type: Optional[str] = None
    package_count: Optional[int] = None
    delivery_company_id: Optional[int] = None
    delivery_method: Optional[str] = "internal"
    inventory_item_id: Optional[int] = None
    quantity: Optional[int] = 1


class OrderCreate(OrderBase):
    pass
class OrderShipmentToggle(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    service_type: Optional[str] = None
    package_count: Optional[int] = None


class OrderUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    priority: Optional[OrderPriorityLiteral] = None
    due_date: Optional[str] = None
    owner: Optional[str] = None
    notes: Optional[str] = None


class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: OrderStatusLiteral
    progress: int
    invoice_ready: bool
    shipment_ready: bool
    invoice_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
