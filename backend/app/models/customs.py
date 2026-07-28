from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base


class CustomsClearance(Base):
    __tablename__ = "customs_clearances"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")
    duty_amount = Column(Float, nullable=False, default=0)
    vat_amount = Column(Float, nullable=False, default=0)
    port_charges = Column(Float, nullable=False, default=0)
    free_time_expiry = Column(String, nullable=True)
    released_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(String, nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
