import re

from pydantic import BaseModel, EmailStr, field_validator

PHONE_PATTERN = re.compile(r"^(?:\+?966|0)?5\d{8}$")


def _validate_phone(value: str | None) -> str | None:
    if value is None or value == "":
        return value
    cleaned = value.replace(" ", "").replace("-", "")
    if not PHONE_PATTERN.match(cleaned):
        raise ValueError("رقم الجوال غير صحيح. أدخلي رقم جوال سعودي صحيح (مثال: 0512345678)")
    return cleaned


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    role: str
    department: str | None = None
    status: str = "نشط"
    permissions: list[str] = []


class UserCreate(UserBase):
    password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return _validate_phone(value)


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    role: str | None = None
    department: str | None = None
    status: str | None = None
    permissions: list[str] | None = None
    password: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return _validate_phone(value)


class UserResponse(UserBase):
    id: str
    last_active: str | None = None
    joined_at: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str
    user: UserResponse
