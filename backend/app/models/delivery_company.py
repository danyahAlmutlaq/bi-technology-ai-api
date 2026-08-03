from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float
from sqlalchemy.sql import func

from app.database import Base


class DeliveryCompany(Base):
    __tablename__ = "delivery_companies"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    tracking_url = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    domestic_cost_price = Column(Float, nullable=True, default=0.0)
    domestic_sell_price = Column(Float, nullable=True, default=0.0)
    international_cost_price = Column(Float, nullable=True, default=0.0)
    international_sell_price = Column(Float, nullable=True, default=0.0)
    responsibility_note = Column(String, nullable=True)

    is_internal_fleet = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
