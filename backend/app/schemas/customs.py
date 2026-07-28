from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

CustomsStatusLiteral = Literal["pending", "in_progress", "released"]


class CustomsCreate(BaseModel):
    shipment_id: int
    duty_amount: float = 0
    vat_amount: float = 0
    port_charges: float = 0
    free_time_expiry: Optional[str] = None
    notes: Optional[str] = None


class CustomsUpdate(BaseModel):
    status: Optional[CustomsStatusLiteral] = None
    duty_amount: Optional[float] = None
    vat_amount: Optional[float] = None
    port_charges: Optional[float] = None
    free_time_expiry: Optional[str] = None
    notes: Optional[str] = None


class CustomsResponse(BaseModel):
    id: int
    shipment_id: int
    status: str
    duty_amount: float
    vat_amount: float
    port_charges: float
    free_time_expiry: Optional[str] = None
    released_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    model_config = {
        "from_attributes": True
    }
