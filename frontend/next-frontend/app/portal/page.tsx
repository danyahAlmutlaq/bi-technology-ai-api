"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  ReceiptText,
  LogOut,
  Lock,
  Mail as MailIcon,
  CheckCircle2,
  Clock3,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CircleDollarSign,
  FileCheck2,
  Landmark,
  Warehouse,
} from "lucide-react";

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

const statusMeta: Record<string, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  pending_approval: { label: "بانتظار الموافقة", tone: "bg-amber-50 text-amber-700 ring-amber-100", icon: Clock3 },
  new: { label: "جديد", tone: "bg-sky-50 text-sky-700 ring-sky-100", icon: Sparkles },
  in_progress: { label: "قيد التنفيذ", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Clock3 },
  completed: { label: "مكتمل", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2 },
  pending: { label: "قيد الانتظار", tone: "bg-amber-50 text-amber-700 ring-amber-100", icon: Clock3 },
  in_transit: { label: "في الطريق", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Truck },
  customs: { label: "لدى الجمارك", tone: "bg-violet-50 text-violet-700 ring-violet-100", icon: Landmark },
  warehouse: { label: "في المستودع", tone: "bg-indigo-50 text-indigo-700 ring-indigo-100", icon: Warehouse },
  dispatched: { label: "تم الإرسال", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Truck },
  delivered: { label: "تم التسليم", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2 },
  failed: { label: "فشل التسليم", tone: "bg-red-50 text-red-700 ring-red-100", icon: AlertTriangle },
  draft: { label: "مسودة", tone: "bg-slate-100 text-slate-600 ring-slate-200", icon: FileCheck2 },
  paid: { label: "مدفوعة", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2 },
  sent: { label: "مرسلة", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: MailIcon },
};

function getStatusMeta(status: string) {
  return statusMeta[status] ?? { label: status, tone: "bg-slate-100 text-slate-600 ring-slate-200", icon: Clock3 };
}

const shipmentSteps = [
  { key: "pending", label: "استلام الطلب", icon: Package },
  { key: "customs", label: "الجمارك", icon: Landmark },
  { key: "warehouse", label: "المستودع", icon: Warehouse },
  { key: "in_transit", label: "التوصيل", icon: Truck },
  { key: "delivered", label: "تم التسليم", icon: CheckCircle2 },
];

function shipmentStepIndex(status: string): number {
  const idx = shipmentSteps.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ring-1 ${meta.tone}`}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof CheckCircle2;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-[18px] font-black text-slate-900">{value}</p>
    </div>
  );
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
      <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] shadow-2xl md:grid-cols-2">
          <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#0f766e] via-[#0e7490] to-[#1e3a8a] p-10 text-white md:flex">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold">
                <ShieldCheck size={13} /> بياناتك محفوظة وآمنة
              </div>
              <h1 className="mt-8 text-[26px] font-black leading-tight">تابعي شحناتك<br />من مكان واحد</h1>
              <p className="mt-3 text-[12px] font-medium text-white/75">شحناتك، طلباتك، وفواتيرك — كل شي أول بأول وبشفافية كاملة.</p>
            </div>
            <div className="relative z-10 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Package size={16} /></span>
                <p className="text-[11px] font-bold">تتبع حالة الطلبات لحظة بلحظة</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Truck size={16} /></span>
                <p className="text-[11px] font-bold">تتبع الشحن من الجمارك للتسليم</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><ReceiptText size={16} /></span>
                <p className="text-[11px] font-bold">فواتيرك ومستحقاتك بشكل واضح</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="bg-white p-8 sm:p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white"><Truck size={20} /></span>
            <h2 className="mt-5 text-[19px] font-black text-slate-900">بوابة العملاء</h2>
            <p className="mt-1 text-[11px] font-medium text-slate-500">سجلي الدخول لمتابعة شحناتك وطلباتك وفواتيرك</p>
            {loginError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] font-bold text-red-600">
                <AlertTriangle size={14} /> {loginError}
              </div>
            )}
            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-500">البريد الإلكتروني</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-slate-400">
                  <MailIcon size={15} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[12px] outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-500">كلمة المرور</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-slate-400">
                  <Lock size={15} className="text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-[12px] outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#0f766e] to-[#1e3a8a] px-4 py-3 text-[12px] font-black text-white shadow-lg disabled:opacity-50"
            >
              {isLoggingIn ? "جاري الدخول..." : <>الدخول إلى حسابي <ArrowLeft size={14} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => o.status !== "completed").length;
  const activeShipments = shipments.filter((s) => s.status !== "delivered").length;
  const pendingInvoicesAmount = invoices.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.total, 0);
  const totalSpent = invoices.reduce((sum, i) => sum + i.total, 0);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#1e3a8a] text-white shadow-md"><Truck size={19} /></span>
            <div>
              <p className="text-[9px] font-bold text-slate-400">بوابة العملاء</p>
              <h1 className="text-[15px] font-black text-slate-900">{customer.customer_name}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
          >
            <LogOut size={14} /> تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-7">
        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="طلبات نشطة" value={String(activeOrders)} icon={Package} tone="bg-sky-50 text-sky-700" />
          <StatCard label="شحنات قيد التنفيذ" value={String(activeShipments)} icon={Truck} tone="bg-blue-50 text-blue-700" />
          <StatCard label="مستحقات غير مدفوعة" value={formatCurrency(pendingInvoicesAmount)} icon={CircleDollarSign} tone="bg-amber-50 text-amber-700" />
          <StatCard label="إجمالي التعاملات" value={formatCurrency(totalSpent)} icon={ReceiptText} tone="bg-emerald-50 text-emerald-700" />
        </section>

        <div className="mb-5 flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition ${activeTab === "orders" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            <Package size={14} /> الطلبات <span className={`rounded-lg px-2 py-0.5 text-[9px] ${activeTab === "orders" ? "bg-white/15" : "bg-slate-100"}`}>{orders.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipments")}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition ${activeTab === "shipments" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            <Truck size={14} /> الشحنات <span className={`rounded-lg px-2 py-0.5 text-[9px] ${activeTab === "shipments" ? "bg-white/15" : "bg-slate-100"}`}>{shipments.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition ${activeTab === "invoices" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            <ReceiptText size={14} /> الفواتير <span className={`rounded-lg px-2 py-0.5 text-[9px] ${activeTab === "invoices" ? "bg-white/15" : "bg-slate-100"}`}>{invoices.length}</span>
          </button>
        </div>

        {dataLoading && (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[11px] font-medium text-slate-400">جاري تحميل البيانات...</div>
        )}

        {!dataLoading && activeTab === "orders" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">
                <Package className="mx-auto mb-2 text-slate-300" size={28} />
                لا توجد طلبات حالياً
              </div>
            )}
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Package size={17} /></span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400">{order.order_number}</p>
                <h3 className="mt-1 text-[14px] font-black text-slate-900">{order.title}</h3>
                <p className="mt-2 text-[13px] font-black text-emerald-700">{formatCurrency(order.amount)}</p>
                {order.due_date && (
                  <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                    <Clock3 size={12} /> التسليم المتوقع: {order.due_date}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {!dataLoading && activeTab === "shipments" && (
          <div className="grid gap-4">
            {shipments.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-[11px] font-medium text-slate-400">
                <Truck className="mx-auto mb-2 text-slate-300" size={28} />
                لا توجد شحنات حالياً
              </div>
            )}
            {shipments.map((shipment) => {
              const currentIndex = shipmentStepIndex(shipment.status);
              return (
                <article key={shipment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Truck size={17} /></span>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">{shipment.tracking_number ?? `شحنة #${shipment.id}`}</p>
                        <h3 className="text-[13px] font-black text-slate-900">{shipment.service_type ?? "شحن"}</h3>
                      </div>
                    </div>
                    <div className="text-left">
                      <StatusBadge status={shipment.status} />
                      <p className="mt-2 text-[12px] font-black text-emerald-700">{formatCurrency(shipment.shipping_cost)}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    {shipmentSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const done = index <= currentIndex;
                      return (
                        <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                          <div className="flex w-full items-center">
                            {index !== 0 && <div className={`h-0.5 flex-1 ${index <= currentIndex ? "bg-emerald-400" : "bg-slate-150"}`} />}
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                              <StepIcon size={14} />
                            </span>
                            {index !== shipmentSteps.length - 1 && <div className={`h-0.5 flex-1 ${index < currentIndex ? "bg-emerald-400" : "bg-slate-150"}`} />}
                          </div>
                          <p className={`mt-2 text-[8px] font-bold ${done ? "text-emerald-700" : "text-slate-400"}`}>{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!dataLoading && activeTab === "invoices" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {invoices.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">
                <ReceiptText className="mx-auto mb-2 text-slate-300" size={28} />
                لا توجد فواتير حالياً
              </div>
            )}
            {invoices.map((invoice) => (
              <article key={invoice.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><ReceiptText size={17} /></span>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400">{invoice.invoice_number}</p>
                <h3 className="mt-1 text-[16px] font-black text-slate-900">{formatCurrency(invoice.total)}</h3>
                <div className="mt-3 grid gap-1 rounded-xl bg-slate-50 p-3 text-[10px] font-medium text-slate-500">
                  <div className="flex justify-between"><span>المبلغ</span><span className="font-bold text-slate-700">{formatCurrency(invoice.amount)}</span></div>
                  <div className="flex justify-between"><span>الضريبة</span><span className="font-bold text-slate-700">{formatCurrency(invoice.tax_amount)}</span></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}