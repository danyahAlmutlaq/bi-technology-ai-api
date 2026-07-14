from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class EmployeeCreate(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    position: str
    department: Optional[str] = None
    salary: float


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[float] = None
    status: Optional[str] = None


class EmployeeResponse(BaseModel):
    id: int
    full_name: str
    email: Optional[EmailStr]
    phone: Optional[str]
    position: str
    department: Optional[str]
    salary: float
    hire_date: datetime
    status: str
    is_archived: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
