from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse


router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/", response_model=CustomerResponse)
def create_customer(customer_data: CustomerCreate, db: Session = Depends(get_db)):

    if not customer_data.phone and not customer_data.email:
        raise HTTPException(
            status_code=400,
            detail="Phone or email is required"
        )

    customer = Customer(
        name=customer_data.name,
        phone=customer_data.phone,
        email=customer_data.email,
        address=customer_data.address,
        tax_number=customer_data.tax_number,
        notes=customer_data.notes
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    search: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(Customer).filter(Customer.is_archived == False)

    if search:
        query = query.filter(Customer.name.ilike(f"%{search}%"))

    customers = query.all()

    return customers
    customers = db.query(Customer).filter(Customer.is_archived == False).all()

    return customers


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == customer_id).first()

    if not customer or customer.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(Customer.id == customer_id).first()

    if not customer or customer.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    if customer_data.name is not None:
        customer.name = customer_data.name

    if customer_data.phone is not None:
        customer.phone = customer_data.phone

    if customer_data.email is not None:
        customer.email = customer_data.email

    if customer_data.address is not None:
        customer.address = customer_data.address

    if customer_data.tax_number is not None:
        customer.tax_number = customer_data.tax_number

    if customer_data.notes is not None:
        customer.notes = customer_data.notes

    db.commit()
    db.refresh(customer)

    return customer


@router.delete("/{customer_id}")
def archive_customer(customer_id: int, db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(Customer.id == customer_id).first()

    if not customer or customer.is_archived:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    customer.is_archived = True

    db.commit()

    return {"message": "Customer archived successfully"}