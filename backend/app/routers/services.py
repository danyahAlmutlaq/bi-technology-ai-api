from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.service import Service, ServiceRequest
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
    ServiceRequestCreate,
    ServiceRequestUpdate,
    ServiceRequestResponse
)


router = APIRouter(prefix="/services", tags=["Services"])


@router.post("/", response_model=ServiceResponse)
def create_service(service_data: ServiceCreate, db: Session = Depends(get_db)):

    service = Service(
        name=service_data.name,
        price=service_data.price,
        duration=service_data.duration,
        notes=service_data.notes
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    return service


@router.get("/", response_model=list[ServiceResponse])
def get_services(db: Session = Depends(get_db)):

    services = db.query(Service).all()

    return services


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db)
):

    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    if service_data.name is not None:
        service.name = service_data.name

    if service_data.price is not None:
        service.price = service_data.price

    if service_data.duration is not None:
        service.duration = service_data.duration

    if service_data.notes is not None:
        service.notes = service_data.notes

    db.commit()
    db.refresh(service)

    return service


@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):

    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    db.delete(service)
    db.commit()

    return {"message": "Service deleted successfully"}


@router.post("/requests", response_model=ServiceRequestResponse)
def create_service_request(
    request_data: ServiceRequestCreate,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == request_data.customer_id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    service = db.query(Service).filter(
        Service.id == request_data.service_id
    ).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service_request = ServiceRequest(
        customer_id=request_data.customer_id,
        service_id=request_data.service_id,
        description=request_data.description
    )

    db.add(service_request)
    db.commit()
    db.refresh(service_request)

    return service_request


@router.get("/requests", response_model=list[ServiceRequestResponse])
def get_service_requests(db: Session = Depends(get_db)):

    service_requests = db.query(ServiceRequest).all()

    return service_requests


@router.put("/requests/{request_id}", response_model=ServiceRequestResponse)
def update_service_request(
    request_id: int,
    request_data: ServiceRequestUpdate,
    db: Session = Depends(get_db)
):

    service_request = db.query(ServiceRequest).filter(
        ServiceRequest.id == request_id
    ).first()

    if not service_request:
        raise HTTPException(status_code=404, detail="Service request not found")

    if request_data.description is not None:
        service_request.description = request_data.description

    if request_data.status is not None:
        service_request.status = request_data.status

    db.commit()
    db.refresh(service_request)

    return service_request
