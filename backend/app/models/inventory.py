from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False)
    quantity = Column(Integer, default=0)
    unit_price = Column(Float, nullable=False)
    status = Column(String, default="available")
    category = Column(String, nullable=True, default="عام")
    warehouse = Column(String, nullable=True, default="المستودع الرئيسي")
    minimum = Column(Integer, nullable=False, default=5)
    maximum = Column(Integer, nullable=False, default=50)
    movement = Column(Integer, nullable=False, default=0)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    location = Column(String, nullable=True)
    batch_number = Column(String, nullable=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
