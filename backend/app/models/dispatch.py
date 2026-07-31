from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class DispatchRoute(Base):
    __tablename__ = "dispatch_routes"

    id = Column(Integer, primary_key=True, index=True)
    route_number = Column(String, unique=True, nullable=True)
    driver_name = Column(String, nullable=True)
    vehicle_plate = Column(String, nullable=True)
    status = Column(String, nullable=False, default="building")
    notes = Column(String, nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    dispatched_at = Column(DateTime(timezone=True), nullable=True)
    items = relationship("DispatchItem", backref="route")


class DispatchItem(Base):
    __tablename__ = "dispatch_items"

    id = Column(Integer, primary_key=True, index=True)
    dispatch_id = Column(Integer, ForeignKey("dispatch_routes.id"), nullable=False)
    picking_id = Column(Integer, ForeignKey("picking.id"), nullable=False)
    scanned = Column(Boolean, default=False)