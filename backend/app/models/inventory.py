from sqlalchemy import Column, Integer, String, Float, DateTime
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

    created_at = Column(DateTime(timezone=True), server_default=func.now())
