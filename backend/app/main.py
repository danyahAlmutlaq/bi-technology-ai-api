from fastapi import FastAPI

from app.database import Base, engine
from app.models.customer import Customer
from app.routers import customers


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BI-Technology AI Business API"
)


app.include_router(customers.router)


@app.get("/")
def home():
    return {"message": "Backend is running"}