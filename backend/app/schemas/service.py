from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServiceCreate(BaseModel):
    name: str
    price: float
    duration: Optional[str] = None
    notes: Optional[str] = None


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    notes: Optional[str] = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    price: float
    duration: Optional[str]
    notes: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class ServiceRequestCreate(BaseModel):
    customer_id: int
    service_id: int
    description: Optional[str] = None


class ServiceRequestUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[str] = None


class ServiceRequestResponse(BaseModel):
    id: int
    customer_id: int
    service_id: int
    description: Optional[str]
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
