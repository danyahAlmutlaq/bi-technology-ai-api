from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class DeliveryCompanyCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    tracking_url: Optional[str] = None
    notes: Optional[str] = None
    domestic_cost_price: Optional[float] = None
    domestic_sell_price: Optional[float] = None
    international_cost_price: Optional[float] = None
    international_sell_price: Optional[float] = None
    responsibility_note: Optional[str] = None
    is_internal_fleet: Optional[bool] = False


class DeliveryCompanyUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    tracking_url: Optional[str] = None
    notes: Optional[str] = None
    domestic_cost_price: Optional[float] = None
    domestic_sell_price: Optional[float] = None
    international_cost_price: Optional[float] = None
    international_sell_price: Optional[float] = None
    responsibility_note: Optional[str] = None
    is_internal_fleet: Optional[bool] = None


class DeliveryCompanyResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[EmailStr]
    tracking_url: Optional[str]
    notes: Optional[str]
    domestic_cost_price: Optional[float] = None
    domestic_sell_price: Optional[float] = None
    international_cost_price: Optional[float] = None
    international_sell_price: Optional[float] = None
    responsibility_note: Optional[str] = None
    is_internal_fleet: bool = False
    is_archived: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
