from typing import List, Optional

from pydantic import BaseModel


class OverdueInvoiceItem(BaseModel):
    customer_name: str
    invoice_number: str
    open_amount: float
    days_since_issued: int


class LowStockItem(BaseModel):
    name: str
    sku: str
    quantity: int
    minimum: int
    suggested_reorder: int


class TopCustomerItem(BaseModel):
    customer_name: str
    total_revenue: float
    invoice_count: int


class InactiveCustomerItem(BaseModel):
    customer_name: str
    days_since_last_activity: Optional[int] = None


class DeliveryPerformance(BaseModel):
    total_this_month: int
    delivered_this_month: int
    delivery_rate_percent: float
    avg_delivery_days: Optional[float] = None
    delivery_rate_last_month: float


class FinancialSnapshot(BaseModel):
    collected_this_month: float
    collected_last_month: float
    expenses_this_month: float
    expenses_last_month: float
    net_this_month: float


class InsightsResponse(BaseModel):
    overdue_invoices: List[OverdueInvoiceItem]
    total_open_amount: float
    low_stock: List[LowStockItem]
    top_customers: List[TopCustomerItem]
    inactive_customers: List[InactiveCustomerItem]
    delivery: DeliveryPerformance
    financial: FinancialSnapshot
    generated_at: str
