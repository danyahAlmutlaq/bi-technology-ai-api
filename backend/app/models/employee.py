from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=True)

    phone = Column(String, nullable=True)

    position = Column(String, nullable=False)

    department = Column(String, nullable=True)

    salary = Column(Float, nullable=False)

    hire_date = Column(DateTime(timezone=True), server_default=func.now())

    status = Column(String, default="Active")

    is_archived = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
