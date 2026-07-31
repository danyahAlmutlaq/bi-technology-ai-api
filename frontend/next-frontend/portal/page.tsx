"use client";

import { useState } from "react";

const API_BASE_URL = "/backend";

interface CustomerInfo {
  customer_id: number;
  customer_name: string;
  email: string;
}

interface OrderItem {
  id: number;
  order_number: string;
  title: string;
  status: string;
  amount: number;
  due_date: string | null;
}

interface ShipmentItem {
  id: number;
  tracking_number: string | null;
  status: string;
  service_type: string | null;
  shipping_cost: number;
}

interface InvoiceItem {
  id: number;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total: number;
  status: string;
  created_at: string;
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
}

export default function CustomerPortalPage() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "shipments" | "invoices">("orders");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customer-portal/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      const data: CustomerInfo = await response.json();
      setCustomer(data);
      await loadAllData(data.customer_id);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadAllData = async (customerId: number) => {
    setDataLoading(true);
    try {
      const [ordersRes, shipmentsRes, invoicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customer-portal/${customerId}/orders`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/customer-portal/${customerId}/shipments`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/customer-portal/${customerId}/invoices`, { cache: "no-store" }),
      ]);
      setOrders(ordersRes.ok ? await ordersRes.json() : []);
      setShipments(shipmentsRes.ok ? await shipmentsRes.json() : []);
      setInvoices(invoicesRes.ok ? await invoicesRes.json() : []);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    setCustomer(null);
    setEmail("");
    setPassword("");
    setOrders([]);
    setShipments([]);
    setInvoices([]);
  };

  if (!customer) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">بوابة العملاء</h1>
          <p className="mt-1 text-[11px] font-medium text-slate-500">سجلي الدخول لمتابعة شحناتك وطلباتك وفواتيرك</p>
          {loginError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] font-bold text-red-600">{loginError}</div>
          )}
          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-slate-500">البريد الإلكتروني</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold text-slate-500">كلمة المرور</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-slate-400"
                placeholder="••••••••"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-[12px] font-bold text-white disabled:opacity-50"
          >
            {isLoggingIn ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    pending_approval: "بانتظار الموافقة",
    new: "جديد",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    pending: "قيد الانتظار",
    dispatched: "تم الإرسال",
    delivered: "تم التسليم",
    draft: "مسودة",
    paid: "مدفوعة",
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400">بوابة العملاء</p>
          <h1 className="text-[15px] font-bold text-slate-900">{customer.customer_name}</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-200 px-4 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
        >
          تسجيل الخروج
        </button>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`rounded-xl px-4 py-2 text-[11px] font-bold ${activeTab === "orders" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
          >
            الطلبات ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipments")}
            className={`rounded-xl px-4 py-2 text-[11px] font-bold ${activeTab === "shipments" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
          >
            الشحنات ({shipments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`rounded-xl px-4 py-2 text-[11px] font-bold ${activeTab === "invoices" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200"}`}
          >
            الفواتير ({invoices.length})
          </button>
        </div>

        {dataLoading && (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[11px] font-medium text-slate-400">جاري تحميل البيانات...</div>
        )}

        {!dataLoading && activeTab === "orders" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {orders.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">لا توجد طلبات حالياً</div>
            )}
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] font-bold text-slate-400">{order.order_number}</p>
                <h3 className="mt-1 text-[13px] font-bold text-slate-900">{order.title}</h3>
                <p className="mt-2 text-[11px] font-bold text-emerald-700">{formatCurrency(order.amount)}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">{statusLabels[order.status] ?? order.status}</p>
                {order.due_date && <p className="mt-1 text-[10px] font-medium text-slate-400">التسليم المتوقع: {order.due_date}</p>}
              </article>
            ))}
          </div>
        )}

        {!dataLoading && activeTab === "shipments" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {shipments.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">لا توجد شحنات حالياً</div>
            )}
            {shipments.map((shipment) => (
              <article key={shipment.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] font-bold text-slate-400">{shipment.tracking_number ?? `شحنة #${shipment.id}`}</p>
                <h3 className="mt-1 text-[13px] font-bold text-slate-900">{shipment.service_type ?? "شحن"}</h3>
                <p className="mt-2 text-[11px] font-bold text-emerald-700">{formatCurrency(shipment.shipping_cost)}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">{statusLabels[shipment.status] ?? shipment.status}</p>
              </article>
            ))}
          </div>
        )}

        {!dataLoading && activeTab === "invoices" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {invoices.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">لا توجد فواتير حالياً</div>
            )}
            {invoices.map((invoice) => (
              <article key={invoice.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] font-bold text-slate-400">{invoice.invoice_number}</p>
                <h3 className="mt-1 text-[13px] font-bold text-slate-900">{formatCurrency(invoice.total)}</h3>
                <p className="mt-1 text-[10px] font-medium text-slate-500">المبلغ: {formatCurrency(invoice.amount)} + ضريبة {formatCurrency(invoice.tax_amount)}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">{statusLabels[invoice.status] ?? invoice.status}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}