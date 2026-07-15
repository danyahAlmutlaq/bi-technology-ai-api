from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_customers: int
    total_invoices: int
    total_payments: float
    active_shipments: int
    total_expenses: float
