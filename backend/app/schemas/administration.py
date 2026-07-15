from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class CompanySettingsCreate(BaseModel):
    company_name: str
    tax_number: Optional[str] = None
    commercial_registration: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    website: Optional[str] = None
    logo_path: Optional[str] = None


class CompanySettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    tax_number: Optional[str] = None
    commercial_registration: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    website: Optional[str] = None
    logo_path: Optional[str] = None


class CompanySettingsResponse(BaseModel):
    id: int
    company_name: str
    tax_number: Optional[str]
    commercial_registration: Optional[str]
    phone: Optional[str]
    email: Optional[EmailStr]
    address: Optional[str]
    website: Optional[str]
    logo_path: Optional[str]
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class AuditLogResponse(BaseModel):
    id: int
    employee_id: Optional[int]
    action: str
    entity_type: Optional[str]
    entity_id: Optional[int]
    details: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
