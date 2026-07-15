from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.administration import CompanySettings, AuditLog
from app.models.employee import Employee
from app.schemas.administration import (
    CompanySettingsCreate,
    CompanySettingsUpdate,
    CompanySettingsResponse,
    AuditLogResponse
)


router = APIRouter(
    prefix="/administration",
    tags=["Administration"]
)


@router.post(
    "/settings",
    response_model=CompanySettingsResponse
)
def create_company_settings(
    settings_data: CompanySettingsCreate,
    employee_id: int | None = None,
    db: Session = Depends(get_db)
):

    existing_settings = db.query(CompanySettings).first()

    if existing_settings:
        raise HTTPException(
            status_code=400,
            detail="Company settings already exist"
        )

    if employee_id is not None:
        employee = db.query(Employee).filter(
            Employee.id == employee_id
        ).first()

        if not employee or employee.is_archived:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

    settings = CompanySettings(
        company_name=settings_data.company_name,
        tax_number=settings_data.tax_number,
        commercial_registration=settings_data.commercial_registration,
        phone=settings_data.phone,
        email=settings_data.email,
        address=settings_data.address,
        website=settings_data.website,
        logo_path=settings_data.logo_path
    )

    db.add(settings)
    db.flush()

    audit_log = AuditLog(
        employee_id=employee_id,
        action="Created company settings",
        entity_type="company_settings",
        entity_id=settings.id,
        details="Company settings were created"
    )

    db.add(audit_log)
    db.commit()
    db.refresh(settings)

    return settings


@router.get(
    "/settings",
    response_model=CompanySettingsResponse
)
def get_company_settings(
    db: Session = Depends(get_db)
):

    settings = db.query(CompanySettings).first()

    if not settings:
        raise HTTPException(
            status_code=404,
            detail="Company settings not found"
        )

    return settings


@router.put(
    "/settings",
    response_model=CompanySettingsResponse
)
def update_company_settings(
    settings_data: CompanySettingsUpdate,
    employee_id: int | None = None,
    db: Session = Depends(get_db)
):

    settings = db.query(CompanySettings).first()

    if not settings:
        raise HTTPException(
            status_code=404,
            detail="Company settings not found"
        )

    if employee_id is not None:
        employee = db.query(Employee).filter(
            Employee.id == employee_id
        ).first()

        if not employee or employee.is_archived:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

    update_data = settings_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(settings, field, value)

    audit_log = AuditLog(
        employee_id=employee_id,
        action="Updated company settings",
        entity_type="company_settings",
        entity_id=settings.id,
        details="Company settings were updated"
    )

    db.add(audit_log)
    db.commit()
    db.refresh(settings)

    return settings


@router.get(
    "/audit-logs",
    response_model=list[AuditLogResponse]
)
def get_audit_logs(
    employee_id: int | None = None,
    action: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(AuditLog)

    if employee_id is not None:
        query = query.filter(
            AuditLog.employee_id == employee_id
        )

    if action:
        query = query.filter(
            AuditLog.action.ilike(f"%{action}%")
        )

    return query.order_by(
        AuditLog.created_at.desc()
    ).all()
