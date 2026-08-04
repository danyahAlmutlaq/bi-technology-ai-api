from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class ShipmentCreate(BaseModel):
    customer_id: int
    delivery_company_id: int
    shipping_cost: float = 0.0
    service_type: Optional[str] = "domestic"
    container_number: Optional[str] = None
    bill_of_lading_number: Optional[str] = None
    vessel_name: Optional[str] = None
    arrival_date: Optional[str] = None
    notes: Optional[str] = None
class ShipmentUpdate(BaseModel):
    tracking_number: Optional[str] = None
    shipping_cost: Optional[float] = None
    service_type: Optional[str] = None
    container_number: Optional[str] = None
    bill_of_lading_number: Optional[str] = None
    vessel_name: Optional[str] = None
    arrival_date: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
class ShipmentResponse(BaseModel):
    id: int
    customer_id: int
    delivery_company_id: int
    tracking_number: Optional[str]
    shipping_cost: float
    service_type: Optional[str]
    container_number: Optional[str] = None
    bill_of_lading_number: Optional[str] = None
    vessel_name: Optional[str] = None
    arrival_date: Optional[str] = None
    order_id: Optional[int] = None
    status: str
    notes: Optional[str]
    created_at: datetime
    total_invoiced: float = 0.0
    total_paid: float = 0.0
    balance: float = 0.0
    financial_status: str = "no_invoice"
    model_config = {
        "from_attributes": True
    }
