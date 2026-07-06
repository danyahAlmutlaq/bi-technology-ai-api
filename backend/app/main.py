from fastapi import FastAPI

from app.database import Base, engine
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.routers import customers
from app.routers import invoices


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BI-Technology AI Business API"
)


app.include_router(customers.router)
app.include_router(invoices.router)


@app.get("/")
def home():
    return {"message": "Backend is running"}
