from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    display_id = Column(String, unique=True, nullable=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=True)
    role = Column(String, nullable=False, default="مشاهد")
    department = Column(String, nullable=True)
    status = Column(String, nullable=False, default="نشط")
    permissions = Column(String, nullable=False, default="")
    password_salt = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    token = Column(String, nullable=True, index=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    last_active = Column(String, nullable=True)
    is_archived = Column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=func.now(),
        server_default=func.now(),
        onupdate=func.now(),
    )