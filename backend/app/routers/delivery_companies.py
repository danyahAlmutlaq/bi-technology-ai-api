from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.delivery_company import DeliveryCompany
from app.schemas.delivery_company import (
    DeliveryCompanyCreate,
    DeliveryCompanyUpdate,
    DeliveryCompanyResponse
)


router = APIRouter(prefix="/delivery-companies", tags=["Delivery Companies"])


@router.post("/", response_model=DeliveryCompanyResponse)
def create_delivery_company(
    company_data: DeliveryCompanyCreate,
    db: Session = Depends(get_db)
):

    company = DeliveryCompany(
        name=company_data.name,
        phone=company_data.phone,
        email=company_data.email,
        tracking_url=company_data.tracking_url,
        notes=company_data.notes
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


@router.get("/", response_model=list[DeliveryCompanyResponse])
def get_delivery_companies(
    search: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(DeliveryCompany).filter(
        DeliveryCompany.is_archived == False
    )

    if search:
        query = query.filter(
            DeliveryCompany.name.ilike(f"%{search}%")
        )

    companies = query.all()

    return companies


@router.get("/{company_id}", response_model=DeliveryCompanyResponse)
def get_delivery_company(
    company_id: int,
    db: Session = Depends(get_db)
):

    company = db.query(DeliveryCompany).filter(
        DeliveryCompany.id == company_id
    ).first()

    if not company or company.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Delivery company not found"
        )

    return company


@router.put("/{company_id}", response_model=DeliveryCompanyResponse)
def update_delivery_company(
    company_id: int,
    company_data: DeliveryCompanyUpdate,
    db: Session = Depends(get_db)
):

    company = db.query(DeliveryCompany).filter(
        DeliveryCompany.id == company_id
    ).first()

    if not company or company.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Delivery company not found"
        )

    if company_data.name is not None:
        company.name = company_data.name

    if company_data.phone is not None:
        company.phone = company_data.phone

    if company_data.email is not None:
        company.email = company_data.email

    if company_data.tracking_url is not None:
        company.tracking_url = company_data.tracking_url

    if company_data.notes is not None:
        company.notes = company_data.notes

    db.commit()
    db.refresh(company)

    return company


@router.delete("/{company_id}")
def archive_delivery_company(
    company_id: int,
    db: Session = Depends(get_db)
):

    company = db.query(DeliveryCompany).filter(
        DeliveryCompany.id == company_id
    ).first()

    if not company or company.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Delivery company not found"
        )

    company.is_archived = True

    db.commit()

    return {"message": "Delivery company archived successfully"}
