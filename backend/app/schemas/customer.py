from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(default=None, max_length=500)
    tax_number: Optional[str] = Field(default=None, max_length=50)
    notes: Optional[str] = Field(default=None, max_length=1000)


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(default=None, max_length=500)
    tax_number: Optional[str] = Field(default=None, max_length=50)
    notes: Optional[str] = Field(default=None, max_length=1000)


class CustomerResponse(CustomerBase):
    id: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }