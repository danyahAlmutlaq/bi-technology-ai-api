from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
class Delivery(Base):
    __tablename__ = "deliveries"
    id = Column(Integer, primary_key=True, index=True)
    picking_id = Column(Integer, ForeignKey("picking.id"), nullable=False)
    status = Column(String, nullable=False, default="out_for_delivery")
    recipient_name = Column(String, nullable=True)
    proof_image_url = Column(String, nullable=True)
    cash_collected = Column(Float, nullable=False, default=0)
    failure_reason = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    delivery_fee = Column(Float, nullable=False, default=0)
