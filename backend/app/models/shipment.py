from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    delivery_company_id = Column(Integer, ForeignKey("delivery_companies.id"), nullable=False)
    tracking_number = Column(String, nullable=True)
    shipping_cost = Column(Float, default=0.0)
    service_type = Column(String, nullable=True, default="domestic")
    container_number = Column(String, nullable=True)
    container_type = Column(String, nullable=True)
    bill_of_lading_number = Column(String, nullable=True)
    vessel_name = Column(String, nullable=True)
    arrival_date = Column(String, nullable=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    status = Column(String, default="pending")
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
