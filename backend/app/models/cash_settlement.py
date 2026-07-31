from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class CashSettlement(Base):
    __tablename__ = "cash_settlements"

    id = Column(Integer, primary_key=True, index=True)
    driver_name = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False, default=0)
    status = Column(String, nullable=False, default="pending")
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    settled_at = Column(DateTime(timezone=True), nullable=True)
    items = relationship("CashSettlementItem", backref="settlement")


class CashSettlementItem(Base):
    __tablename__ = "cash_settlement_items"

    id = Column(Integer, primary_key=True, index=True)
    settlement_id = Column(Integer, ForeignKey("cash_settlements.id"), nullable=False)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False)
    amount = Column(Float, nullable=False)