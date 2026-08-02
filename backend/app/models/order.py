from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False, default=0)
    status = Column(String, nullable=False, default="new")
    priority = Column(String, nullable=False, default="normal")
    due_date = Column(String, nullable=True)
    owner = Column(String, nullable=True)
    progress = Column(Integer, nullable=False, default=8)
    invoice_ready = Column(Boolean, default=False)
    shipment_ready = Column(Boolean, default=False)
    notes = Column(String, nullable=True)
    origin = Column(String, nullable=True)
    destination = Column(String, nullable=True)
    service_type = Column(String, nullable=True)
    package_count = Column(Integer, nullable=True, default=1)
    delivery_company_id = Column(Integer, ForeignKey("delivery_companies.id"), nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), default=func.now(), onupdate=func.now())
