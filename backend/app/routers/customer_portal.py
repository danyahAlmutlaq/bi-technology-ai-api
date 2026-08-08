import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.customer import Customer
from app.models.customer_account import CustomerAccount
from app.models.order import Order
from app.models.shipment import Shipment
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.customer_account import CustomerAccountCreate, CustomerLoginRequest, CustomerLoginResponse

router = APIRouter(prefix="/customer-portal", tags=["Customer Portal"])

SALT = "logistics-portal-salt"


def require_admin(current_user: User):
    if current_user.role != "مدير النظام":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="صلاحية مدير النظام مطلوبة"
        )


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


@router.delete("/accounts/{customer_id}")
def delete_account(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    account = db.query(CustomerAccount).filter(CustomerAccount.customer_id == customer_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="No portal account found for this customer")
    db.delete(account)
    db.commit()
    return {"detail": "Portal account deleted"}


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
    result = []
    for i in invoices:
        paid_amount = sum(p.amount for p in db.query(Payment).filter(Payment.invoice_id == i.id).all())
        due_amount = max(0.0, (i.total or 0.0) - paid_amount)
        if due_amount <= 0 and paid_amount > 0:
            computed_status = "paid"
        elif paid_amount > 0:
            computed_status = "partial"
        else:
            computed_status = "unpaid"
        result.append({
            "id": i.id,
            "invoice_number": i.invoice_number,
            "amount": i.amount,
            "tax_amount": i.tax_amount,
            "total": i.total,
            "paid_amount": round(paid_amount, 2),
            "due_amount": round(due_amount, 2),
            "status": computed_status,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        })
    return result