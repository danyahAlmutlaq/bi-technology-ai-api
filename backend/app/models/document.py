from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    file_path = Column(String, nullable=False)

    entity_type = Column(String, nullable=False)

    entity_id = Column(Integer, nullable=False)

    tags = Column(String, nullable=True)

    is_archived = Column(Boolean, default=False)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
