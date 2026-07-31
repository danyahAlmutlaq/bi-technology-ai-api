from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_customers: int
    total_invoices: int
    total_payments: float
    active_shipments: int
    total_expenses: float
    total_invoiced: float
    open_amount: float
    collection_rate: int
    due_invoices: int
    low_stock_count: int