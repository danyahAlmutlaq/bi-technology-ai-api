from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.auth import get_current_user, require_permission
from app.routers import administration
from app.routers import auth
from app.routers import users
from app.routers import bookings
from app.routers import customers
from app.routers import customs
from app.routers import receiving
from app.routers import picking
from app.routers import dispatch
from app.routers import delivery
from app.routers import returns
from app.routers import cash_settlements
from app.routers import billing
from app.routers import customer_portal
from app.routers import dashboard
from app.routers import delivery_companies
from app.routers import delivery_receipts
from app.routers import documents
from app.routers import employees
from app.routers import expenses
from app.routers import insights
from app.routers import reports
from app.routers import inventory
from app.routers import invoices
from app.routers import orders
from app.routers import payments
from app.routers import services
from app.routers import shipments

Base.metadata.create_all(bind=engine)

from sqlalchemy import text as _sa_text
with engine.connect() as _migration_conn:
    for _ddl in [
        "ALTER TABLE cash_settlements ADD COLUMN counted_amount FLOAT",
        "ALTER TABLE cash_settlements ADD COLUMN discrepancy FLOAT",
    ]:
        try:
            _migration_conn.execute(_sa_text(_ddl))
            _migration_conn.commit()
        except Exception:
            pass

app = FastAPI(
    title="BI Technology AI Business Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تسجيل دخول فقط (بدون صلاحية محددة) لأقسام تشغيلية داخلية
protected = [Depends(get_current_user)]

# صلاحية محددة حسب دور المستخدم - نفس تقسيم الفرونت بالضبط
perm_dashboard = [Depends(require_permission("لوحة التحكم"))]
perm_customers = [Depends(require_permission("العملاء"))]
perm_orders = [Depends(require_permission("الطلبات"))]
perm_invoices = [Depends(require_permission("الفواتير"))]
perm_payments = [Depends(require_permission("المدفوعات"))]
perm_shipments = [Depends(require_permission("الشحنات"))]
perm_inventory = [Depends(require_permission("المخزون"))]
perm_users = [Depends(require_permission("المستخدمون"))]
perm_reports = [Depends(require_permission("التقارير"))]

app.include_router(customers.router, dependencies=perm_customers)
app.include_router(customs.router, dependencies=protected)
app.include_router(receiving.router, dependencies=protected)
app.include_router(picking.router, dependencies=protected)
app.include_router(dispatch.router, dependencies=protected)
app.include_router(delivery.router, dependencies=protected)
app.include_router(returns.router, dependencies=protected)
app.include_router(cash_settlements.router, dependencies=protected)
app.include_router(billing.router, dependencies=protected)
# بوابة العملاء عندها نظام دخول خاص بالعميل نفسه، ما تحتاج توكن الموظف
app.include_router(customer_portal.router)
app.include_router(bookings.router, dependencies=protected)
app.include_router(shipments.router, dependencies=perm_shipments)
app.include_router(delivery_receipts.router, dependencies=protected)
app.include_router(inventory.router, dependencies=perm_inventory)
app.include_router(invoices.router, dependencies=perm_invoices)
app.include_router(orders.router, dependencies=perm_orders)
app.include_router(payments.router, dependencies=perm_payments)
app.include_router(delivery_companies.router, dependencies=perm_shipments)
app.include_router(services.router, dependencies=protected)
app.include_router(expenses.router, dependencies=protected)
app.include_router(employees.router, dependencies=protected)
app.include_router(documents.router, dependencies=protected)
app.include_router(administration.router, dependencies=protected)
app.include_router(insights.router, dependencies=perm_reports)
app.include_router(reports.router, dependencies=perm_reports)
# auth لازم يضل مفتوح (تسجيل الدخول نفسه ما يحتاج توكن)
app.include_router(auth.router)
app.include_router(users.router, dependencies=perm_users)
app.include_router(dashboard.router, dependencies=perm_dashboard)


@app.get("/")
def root():
    return {
        "message": (
            "BI Technology AI Business Management "
            "System API is running"
        ),
        "status": "Running",
    }
