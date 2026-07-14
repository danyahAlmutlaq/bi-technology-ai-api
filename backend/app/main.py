from fastapi import FastAPI

from app.database import Base, engine

from app.routers import customers
from app.routers import invoices
from app.routers import payments
from app.routers import delivery_companies
from app.routers import shipments
from app.routers import delivery_receipts
from app.routers import services
from app.routers import inventory
from app.routers import expenses

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="BI Technology AI Business Management System",
    version="1.0.0"
)

# Register Routers
app.include_router(customers.router)
app.include_router(invoices.router)
app.include_router(payments.router)
app.include_router(delivery_companies.router)
app.include_router(shipments.router)
app.include_router(delivery_receipts.router)
app.include_router(services.router)
app.include_router(inventory.router)
app.include_router(expenses.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to BI Technology AI Business Management System API"
    }
