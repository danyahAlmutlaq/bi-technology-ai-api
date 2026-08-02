from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)
from app.utils.customer_cascade import cascade_delete_customer


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "/",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
):
    if not customer_data.phone and not customer_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone or email is required",
        )

    customer = Customer(
        name=customer_data.name,
        phone=customer_data.phone,
        email=customer_data.email,
        address=customer_data.address,
        tax_number=customer_data.tax_number,
        notes=customer_data.notes,
        customer_type=customer_data.customer_type,
        city=customer_data.city,
        national_id=customer_data.national_id,
        commercial_registration=customer_data.commercial_registration,
        company_website=customer_data.company_website,
        contact_person=customer_data.contact_person,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@router.get(
    "/",
    response_model=list[CustomerResponse],
)
def get_customers(
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Customer).filter(
        Customer.is_archived.is_(False)
    )

    if search:
        search_value = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Customer.name.ilike(search_value),
                Customer.phone.ilike(search_value),
                Customer.email.ilike(search_value),
                Customer.tax_number.ilike(search_value),
            )
        )

    return query.order_by(Customer.id.desc()).all()


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id,
            Customer.is_archived.is_(False),
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
):
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id,
            Customer.is_archived.is_(False),
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    update_data = customer_data.model_dump(exclude_unset=True)

    updated_phone = update_data.get("phone", customer.phone)
    updated_email = update_data.get("email", customer.email)

    if not updated_phone and not updated_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone or email is required",
        )

    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)

    return customer


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_200_OK,
)
def archive_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id,
            Customer.is_archived.is_(False),
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    cascade_delete_customer(db, customer_id)
    db.delete(customer)

    db.commit()

    return {
        "message": "Customer deleted successfully",
        "customer_id": customer_id,
    }