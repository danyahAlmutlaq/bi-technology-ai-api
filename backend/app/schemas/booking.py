from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


BookingStatus = Literal[
    "draft",
    "confirmed",
    "cancelled",
    "converted_to_shipment",
]


class BookingBase(BaseModel):
    customer_id: int

    service_type: str = Field(
        min_length=2,
        max_length=100,
    )

    shipping_mode: Optional[str] = Field(
        default=None,
        max_length=20,
    )

    origin: str = Field(
        min_length=2,
        max_length=250,
    )

    destination: str = Field(
        min_length=2,
        max_length=250,
    )

    pickup_date: Optional[date] = None
    expected_delivery_date: Optional[date] = None

    package_count: int = Field(
        default=1,
        ge=1,
    )

    total_weight: Optional[float] = Field(
        default=None,
        gt=0,
    )

    notes: Optional[str] = Field(
        default=None,
        max_length=1000,
    )

    @model_validator(mode="after")
    def validate_dates(self):
        if (
            self.pickup_date
            and self.expected_delivery_date
            and self.expected_delivery_date < self.pickup_date
        ):
            raise ValueError(
                "Expected delivery date cannot be before pickup date"
            )

        return self


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    customer_id: Optional[int] = None

    service_type: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    shipping_mode: Optional[str] = Field(
        default=None,
        max_length=20,
    )

    origin: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=250,
    )

    destination: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=250,
    )

    pickup_date: Optional[date] = None
    expected_delivery_date: Optional[date] = None

    package_count: Optional[int] = Field(
        default=None,
        ge=1,
    )

    total_weight: Optional[float] = Field(
        default=None,
        gt=0,
    )

    notes: Optional[str] = Field(
        default=None,
        max_length=1000,
    )


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
    delivery_company_id: Optional[int] = None
    shipping_cost: Optional[float] = None
    tracking_number: Optional[str] = Field(
        default=None,
        max_length=100,
    )


class BookingResponse(BookingBase):
    id: int
    booking_number: str
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }