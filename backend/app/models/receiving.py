from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base
class Receiving(Base):
    __tablename__ = "receiving_records"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    expected_quantity = Column(Integer, nullable=False)
    actual_quantity = Column(Integer, nullable=True)
    storage_location = Column(String, nullable=True)
    damage_notes = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")
    receipt_sent = Column(Boolean, default=False)
    received_at = Column(DateTime(timezone=True), nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    handling_fee = Column(Float, nullable=False, default=0)
    storage_fee = Column(Float, nullable=False, default=0)
