from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


CustomerTypeLiteral = Literal["individual", "company"]


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(default=None, max_length=500)
    tax_number: Optional[str] = Field(default=None, max_length=50)
    notes: Optional[str] = Field(default=None, max_length=1000)
    customer_type: Optional[CustomerTypeLiteral] = "individual"
    city: Optional[str] = Field(default=None, max_length=100)
    national_id: Optional[str] = Field(default=None, max_length=50)
    commercial_registration: Optional[str] = Field(default=None, max_length=50)
    company_website: Optional[str] = Field(default=None, max_length=255)
    contact_person: Optional[str] = Field(default=None, max_length=150)


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(default=None, max_length=500)
    tax_number: Optional[str] = Field(default=None, max_length=50)
    notes: Optional[str] = Field(default=None, max_length=1000)
    customer_type: Optional[CustomerTypeLiteral] = None
    city: Optional[str] = Field(default=None, max_length=100)
    national_id: Optional[str] = Field(default=None, max_length=50)
    commercial_registration: Optional[str] = Field(default=None, max_length=50)
    company_website: Optional[str] = Field(default=None, max_length=255)
    contact_person: Optional[str] = Field(default=None, max_length=150)


class CustomerResponse(CustomerBase):
    id: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }