from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse
)


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/", response_model=DocumentResponse)
def create_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db)
):

    document = Document(
        file_path=document_data.file_path,
        entity_type=document_data.entity_type,
        entity_id=document_data.entity_id,
        tags=document_data.tags
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


@router.get("/", response_model=list[DocumentResponse])
def get_documents(
    entity_type: str | None = None,
    entity_id: int | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Document).filter(
        Document.is_archived == False
    )

    if entity_type:
        query = query.filter(
            Document.entity_type == entity_type
        )

    if entity_id is not None:
        query = query.filter(
            Document.entity_id == entity_id
        )

    return query.all()


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document or document.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document or document.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if document_data.tags is not None:
        document.tags = document_data.tags

    db.commit()
    db.refresh(document)

    return document


@router.delete("/{document_id}")
def archive_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document or document.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    document.is_archived = True

    db.commit()

    return {
        "message": "Document archived successfully"
    }
