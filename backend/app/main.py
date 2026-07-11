from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.delivery_company import DeliveryCompany
from app.models.shipment import Shipment
from app.models.delivery_receipt import DeliveryReceipt
from app.models.service import Service, ServiceRequest
from app.models.inventory import Inventory

from app.routers import customers
from app.routers import invoices
from app.routers import payments
from app.routers import delivery_companies
from app.routers import shipments
from app.routers import delivery_receipts
from app.routers import services
from app.routers import inventory


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BI-Technology AI Business API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(customers.router)
app.include_router(invoices.router)
app.include_router(payments.router)
app.include_router(delivery_companies.router)
app.include_router(shipments.router)
app.include_router(delivery_receipts.router)
app.include_router(services.router)
app.include_router(inventory.router)


@app.get("/")
def home():
    return {
        "message": "Backend is running"
    }
