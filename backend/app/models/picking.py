from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Picking(Base):
    __tablename__ = "picking"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")
    delivery_number = Column(String, unique=True, nullable=True)
    missing_notes = Column(String, nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    packed_at = Column(DateTime(timezone=True), nullable=True)
    box_code = Column(String, unique=True, nullable=True)