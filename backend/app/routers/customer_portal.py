import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.customer import Customer
from app.models.customer_account import CustomerAccount
from app.models.order import Order
from app.models.shipment import Shipment
from app.models.invoice import Invoice
from app.schemas.customer_account import CustomerAccountCreate, CustomerLoginRequest, CustomerLoginResponse

router = APIRouter(prefix="/customer-portal", tags=["Customer Portal"])

SALT = "logistics-portal-salt"


def hash_password(password: str) -> str:
    return hashlib.sha256((password + SALT).encode("utf-8")).hexdigest()


@router.post("/accounts", response_model=CustomerLoginResponse)
def create_account(data: CustomerAccountCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    existing = db.query(CustomerAccount).filter(
        (CustomerAccount.customer_id == data.customer_id) | (CustomerAccount.email == data.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists for this customer or email")
    account = CustomerAccount(
        customer_id=data.customer_id,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return CustomerLoginResponse(customer_id=customer.id, customer_name=customer.name, email=account.email)


@router.post("/login", response_model=CustomerLoginResponse)
def login(data: CustomerLoginRequest, db: Session = Depends(get_db)):
    account = db.query(CustomerAccount).filter(CustomerAccount.email == data.email).first()
    if not account or account.password_hash != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    customer = db.query(Customer).filter(Customer.id == account.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return CustomerLoginResponse(customer_id=customer.id, customer_name=customer.name, email=account.email)


@router.get("/{customer_id}/orders")
def get_customer_orders(customer_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.customer_id == customer_id, Order.is_archived == False).all()
    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "title": o.title,
            "status": o.status,
            "amount": o.amount,
            "due_date": o.due_date,
        }
        for o in orders
    ]


@router.get("/{customer_id}/shipments")
def get_customer_shipments(customer_id: int, db: Session = Depends(get_db)):
    shipments = db.query(Shipment).filter(Shipment.customer_id == customer_id).all()
    return [
        {
            "id": s.id,
            "tracking_number": s.tracking_number,
            "status": s.status,
            "service_type": s.service_type,
            "shipping_cost": s.shipping_cost,
        }
        for s in shipments
    ]


@router.get("/{customer_id}/invoices")
def get_customer_invoices(customer_id: int, db: Session = Depends(get_db)):
    invoices = db.query(Invoice).filter(Invoice.customer_id == customer_id).all()
    return [
        {
            "id": i.id,
            "invoice_number": i.invoice_number,
            "amount": i.amount,
            "tax_amount": i.tax_amount,
            "total": i.total,
            "status": i.status,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        }
        for i in invoices
    ]