from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentCreate(BaseModel):
    file_path: str
    entity_type: str
    entity_id: int
    tags: Optional[str] = None


class DocumentUpdate(BaseModel):
    tags: Optional[str] = None


class DocumentResponse(BaseModel):
    id: int
    file_path: str
    entity_type: str
    entity_id: int
    tags: Optional[str]
    is_archived: bool
    uploaded_at: datetime

    model_config = {
        "from_attributes": True
    }
