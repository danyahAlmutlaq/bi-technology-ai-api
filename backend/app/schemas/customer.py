import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

CustomerTypeLiteral = Literal["individual", "company"]

PHONE_PATTERN = re.compile(r"^(?:\+?966|0)?5\d{8}$")
NATIONAL_ID_PATTERN = re.compile(r"^[12]\d{9}$")
CR_PATTERN = re.compile(r"^\d{10}$")
TAX_NUMBER_PATTERN = re.compile(r"^3\d{13}3$")


def _clean(value: Optional[str]) -> Optional[str]:
    if value is None or value == "":
        return value
    return value.replace(" ", "").replace("-", "")


def _validate_phone(value: Optional[str]) -> Optional[str]:
    value = _clean(value)
    if value is None:
        return value
    if not PHONE_PATTERN.match(value):
        raise ValueError("رقم الجوال غير صحيح. أدخلي رقم جوال سعودي صحيح (مثال: 0512345678)")
    return value


def _validate_national_id(value: Optional[str]) -> Optional[str]:
    value = _clean(value)
    if value is None:
        return value
    if not NATIONAL_ID_PATTERN.match(value):
        raise ValueError("رقم الهوية غير صحيح. يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2")
    return value


def _validate_commercial_registration(value: Optional[str]) -> Optional[str]:
    value = _clean(value)
    if value is None:
        return value
    if not CR_PATTERN.match(value):
        raise ValueError("رقم السجل التجاري غير صحيح. يجب أن يكون 10 أرقام")
    return value


def _validate_tax_number(value: Optional[str]) -> Optional[str]:
    value = _clean(value)
    if value is None:
        return value
    if not TAX_NUMBER_PATTERN.match(value):
        raise ValueError("الرقم الضريبي غير صحيح. يجب أن يكون 15 رقم ويبدأ وينتهي بالرقم 3")
    return value


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
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        return _validate_phone(value)

    @field_validator("national_id")
    @classmethod
    def validate_national_id(cls, value):
        return _validate_national_id(value)

    @field_validator("commercial_registration")
    @classmethod
    def validate_commercial_registration(cls, value):
        return _validate_commercial_registration(value)

    @field_validator("tax_number")
    @classmethod
    def validate_tax_number(cls, value):
        return _validate_tax_number(value)


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

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        return _validate_phone(value)

    @field_validator("national_id")
    @classmethod
    def validate_national_id(cls, value):
        return _validate_national_id(value)

    @field_validator("commercial_registration")
    @classmethod
    def validate_commercial_registration(cls, value):
        return _validate_commercial_registration(value)

    @field_validator("tax_number")
    @classmethod
    def validate_tax_number(cls, value):
        return _validate_tax_number(value)


class CustomerResponse(CustomerBase):
    id: int
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    model_config = {
        "from_attributes": True,
    }
