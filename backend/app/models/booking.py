from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.sql import func

from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    booking_number = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False,
        index=True,
    )

    service_type = Column(String, nullable=False)

    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)

    pickup_date = Column(Date, nullable=True)
    expected_delivery_date = Column(Date, nullable=True)

    package_count = Column(Integer, nullable=False, default=1)
    total_weight = Column(Float, nullable=True)

    status = Column(
        String,
        nullable=False,
        default="draft",
        server_default="draft",
        index=True,
    )

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )