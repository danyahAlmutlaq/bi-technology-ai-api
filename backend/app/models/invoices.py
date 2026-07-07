from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    invoice_number = Column(String, nullable=False)

    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    total = Column(Float, default=0.0)

    status = Column(String, default="draft")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
