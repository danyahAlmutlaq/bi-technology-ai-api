from pydantic import BaseModel


class CustomerAccountCreate(BaseModel):
    customer_id: int
    email: str
    password: str


class CustomerLoginRequest(BaseModel):
    email: str
    password: str


class CustomerLoginResponse(BaseModel):
    customer_id: int
    customer_name: str
    email: str