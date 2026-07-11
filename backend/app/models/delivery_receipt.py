from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class DeliveryReceipt(Base):
    __tablename__ = "delivery_receipts"

    id = Column(Integer, primary_key=True, index=True)

    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)

    recipient_name = Column(String, nullable=False)
    proof_image_url = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    is_archived = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
