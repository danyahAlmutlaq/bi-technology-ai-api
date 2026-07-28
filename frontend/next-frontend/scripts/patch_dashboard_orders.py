import datetime
import pathlib

FILE_PATH = pathlib.Path("/workspaces/bi-technology-ai-api/frontend/next-frontend/app/dashboard/page.tsx")

IMPORT_ANCHOR = '} from "@/services/shipments";'

ORDERS_IMPORT_BLOCK = '''import {
  getCustomers as getOrderCustomersApi,
  getOrders as getOrdersApi,
  createOrder as createOrderApi,
  advanceOrder as advanceOrderApi,
  toggleInvoiceReady as toggleInvoiceReadyApi,
  toggleShipmentReady as toggleShipmentReadyApi,
  deleteOrder as deleteOrderApi,
  type Order as ApiOrder,
  type CustomerOption as ApiOrderCustomerOption,
} from "@/services/orders";'''

START_MARKER = "function OrdersWorkspace() {"
END_MARKER = "function UsersWorkspace({"

NEW_BLOCK = '''const ORDER_STATUS_LABELS: Record<string, OrderRecord["status"]> = {
  new: "جديد",
  pending_approval: "بانتظار الاعتماد",
  in_progress: "قيد التنفيذ",
  ready_to_ship: "جاهز للشحن",
  completed: "مكتمل",
};

const ORDER_PRIORITY_LABELS: Record<string, OrderRecord["priority"]> = {
  high: "عالية",
  medium: "متوسطة",
  normal: "عادية",
};

const ORDER_PRIORITY_TO_API: Record<OrderRecord["priority"], "high" | "medium" | "normal"> = {
  "عالية": "high",
  "متوسطة": "medium",
  "عادية": "normal",
};

function mapApiOrderToLocal(order: ApiOrder, customersById: Map<number, ApiOrderCustomerOption>): OrderRecord {
  const customer = customersById.get(order.customer_id);
  return {
    id: order.order_number,
    dbId: order.id,
    customer: customer?.name ?? `عميل #${order.customer_id}`,
    customerType: customer?.customer_type === "company" ? "company" : "individual",
    title: order.title,
    amount: order.amount,
    status: ORDER_STATUS_LABELS[order.status] ?? "جديد",
    priority: ORDER_PRIORITY_LABELS[order.priority] ?? "عادية",
    createdAt: new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.created_at)),
    dueDate: order.due_date ?? "",
    owner: order.owner ?? "",
    progress: order.progress,
    invoiceReady: order.invoice_ready,
    shipmentReady: order.shipment_ready,
    notes: order.notes ?? "",
  };
}

interface OrderFormDraft {
  customerId: number | "";
  title: string;
  amount: number;
  priority: OrderRecord["priority"];
  dueDate: string;
  owner: string;
  notes: string;
}

function OrdersWorkspace() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<ApiOrderCustomerOption[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [addOrderError, setAddOrderError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"الكل" | OrderRecord["status"]>("الكل");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const selected = orders.find((order) => order.id === selectedId) ?? null;

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const [customersData, ordersData] = await Promise.all([getOrderCustomersApi(), getOrdersApi()]);
      setCustomers(customersData);
      const customersById = new Map(customersData.map((customer) => [customer.id, customer]));
      setOrders(ordersData.map((order) => mapApiOrderToLocal(order, customersById)));
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : "تعذر تحميل الطلبات");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const deleteOrder = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target) return;
    try {
      await deleteOrderApi(target.dbId);
      setOrders((current) => current.filter((order) => order.id !== orderId));
      setSelectedId(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حذف الطلب");
    }
  };
  const statuses: Array<{ key: "الكل" | OrderRecord["status"]; label: string; icon: LucideIcon; tone: string }> = [
    { key: "الكل", label: "كل الطلبات", icon: ShoppingCart, tone: "bg-slate-100 text-slate-700" },
    { key: "جديد", label: "جديدة", icon: Plus, tone: "bg-[#e6f1f8] text-[#2d75a3]" },
    { key: "بانتظار الاعتماد", label: "بانتظار الاعتماد", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
    { key: "قيد التنفيذ", label: "قيد التنفيذ", icon: Activity, tone: "bg-sky-50 text-sky-700" },
    { key: "جاهز للشحن", label: "جاهزة للشحن", icon: PackageCheck, tone: "bg-[#eef9f6] text-[#147f75]" },
    { key: "مكتمل", label: "مكتملة", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  ];
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      const matchesSearch = !query || `${order.id} ${order.customer} ${order.title} ${order.owner}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);
  const advanceOrder = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target || target.status === "مكتمل") return;
    try {
      const updated = await advanceOrderApi(target.dbId);
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة الطلب");
    }
  };
  const toggleInvoice = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target) return;
    try {
      const updated = await toggleInvoiceReadyApi(target.dbId);
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة الفاتورة");
    }
  };
  const toggleShipment = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target) return;
    try {
      const updated = await toggleShipmentReadyApi(target.dbId);
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة الشحنة");
    }
  };
  const createOrder = async (draft: OrderFormDraft) => {
    if (draft.customerId === "") return;
    setIsSavingOrder(true);
    setAddOrderError(null);
    try {
      const created = await createOrderApi({
        customer_id: draft.customerId,
        title: draft.title,
        amount: draft.amount,
        priority: ORDER_PRIORITY_TO_API[draft.priority],
        due_date: draft.dueDate || null,
        owner: draft.owner || null,
        notes: draft.notes || null,
      });
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      const mapped = mapApiOrderToLocal(created, customersById);
      setOrders((current) => [mapped, ...current]);
      setSelectedId(mapped.id);
      setShowCreate(false);
    } catch (error) {
      setAddOrderError(error instanceof Error ? error.message : "تعذر إنشاء الطلب");
    } finally {
      setIsSavingOrder(false);
    }
  };
  return (
    <>
      <WorkspaceHeader
        eyebrow="ORDERS"
        title="الطلبات"
        description=""
        icon={ShoppingCart}
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[9px] font-bold text-white shadow-lg">
            <Plus size={14} />
            طلب جديد
          </button>
        }
      />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MiniStat label="إجمالي الطلبات" value={String(orders.length)} icon={ShoppingCart} tone="bg-sky-50 text-sky-700" note="كل الطلبات المسجلة" />
        <MiniStat label="بانتظار الاعتماد" value={String(orders.filter((order) => order.status === "بانتظار الاعتماد").length)} icon={Clock3} tone="bg-amber-50 text-amber-700" note="تحتاج قرارًا" />
        <MiniStat label="قيد التنفيذ" value={String(orders.filter((order) => order.status === "قيد التنفيذ").length)} icon={Activity} tone="bg-[#e6f1f8] text-[#2d75a3]" note="تحت المعالجة" />
        <MiniStat label="جاهزة للشحن" value={String(orders.filter((order) => order.status === "جاهز للشحن").length)} icon={PackageCheck} tone="bg-[#eef9f6] text-[#147f75]" note="جاهزة للتسليم" />
        <MiniStat label="قيمة الطلبات" value={formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))} icon={CircleDollarSign} tone="bg-emerald-50 text-emerald-700" note="إجمالي قيمة الطلبات" />
      </section>
      {ordersLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[9px] font-medium text-slate-400">جاري تحميل الطلبات...</div>
      )}
      {!ordersLoading && ordersError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[9px] font-bold text-red-600">تعذر تحميل الطلبات — رمز الخطأ: {ordersError}</div>
      )}
      {!ordersLoading && !ordersError && (
      <Surface className="overflow-hidden">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {statuses.map((item) => {
                const Icon = item.icon;
                const active = statusFilter === item.key;
                const count = item.key === "الكل" ? orders.length : orders.filter((order) => order.status === item.key).length;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.key)}
                    title={`عرض ${item.label}`}
                    className={`group flex min-w-[112px] shrink-0 items-center gap-2 rounded-2xl border px-3 py-2.5 text-right transition ${active ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-white"}`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? "bg-white/12 text-white" : item.tone}`}>
                      <Icon size={14} />
                    </span>
                    <span>
                      <span className="block text-[8px] font-bold">{item.label}</span>
                      <span className={`mt-0.5 block text-[10px] font-bold ${active ? "text-white" : "text-slate-900"}`}>{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="relative w-full xl:w-72">
              <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث في الطلبات..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[9px] font-medium outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" />
            </div>
          </div>
        </div>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1040px] border-collapse text-right">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[8px] font-bold text-slate-400">
                <th className="px-5 py-3">الطلب</th>
                <th className="px-4 py-3">العميل</th>
                <th className="px-4 py-3">القيمة</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">التقدم</th>
                <th className="px-4 py-3">المسؤول</th>
                <th className="px-5 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100/80 transition hover:bg-sky-50/35">
                  <td className="px-5 py-4">
                    <p className="text-[9px] font-bold text-sky-700">{order.id}</p>
                    <p className="mt-1 max-w-[220px] truncate text-[10px] font-bold text-slate-900">{order.title}</p>
                    <p className="mt-1 text-[7px] font-medium text-slate-400">الاستحقاق {order.dueDate}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f1f8] text-[#2d75a3]">{order.customerType === "company" ? <Building2 size={14} /> : <User size={14} />}</span>
                      <span className="max-w-[180px] truncate text-[9px] font-bold text-slate-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[10px] font-bold text-slate-900">{formatCurrency(order.amount)}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-[7px] font-bold ring-1 ${statusTone(order.status)}`}>{order.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="w-32">
                      <div className="mb-1 flex items-center justify-between text-[7px] font-medium text-slate-400"><span>{order.progress}%</span><span>{order.priority}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#236c83]" style={{ width: `${order.progress}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[9px] font-medium text-slate-600">{order.owner}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <ActionIcon label="عرض التفاصيل" icon={Eye} onClick={() => setSelectedId(order.id)} />
                      <ActionIcon label={order.invoiceReady ? "إلغاء تجهيز الفاتورة" : "تجهيز الفاتورة"} icon={ReceiptText} active={order.invoiceReady} onClick={() => toggleInvoice(order.id)} />
                      <ActionIcon label={order.shipmentReady ? "إلغاء تجهيز الشحنة" : "تجهيز الشحنة"} icon={Truck} active={order.shipmentReady} onClick={() => toggleShipment(order.id)} />
                      <ActionIcon label="نقل للمرحلة التالية" icon={ArrowLeft} disabled={order.status === "مكتمل"} onClick={() => advanceOrder(order.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 p-4 lg:hidden">
          {visibleOrders.map((order) => (
            <article key={order.id} className="rounded-[22px] border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-[8px] font-bold text-sky-700">{order.id}</p><h3 className="mt-1 text-[11px] font-bold text-slate-900">{order.title}</h3><p className="mt-1 text-[8px] font-medium text-slate-400">{order.customer}</p></div>
                <span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(order.status)}`}>{order.status}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white p-3"><p className="text-[7px] text-slate-400">القيمة</p><p className="mt-1 text-[10px] font-bold text-slate-900">{formatCurrency(order.amount)}</p></div><div className="rounded-xl bg-white p-3"><p className="text-[7px] text-slate-400">المسؤول</p><p className="mt-1 text-[9px] font-bold text-slate-900">{order.owner}</p></div></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#236c83]" style={{ width: `${order.progress}%` }} /></div>
              <div className="mt-3 flex items-center gap-2"><ActionIcon label="التفاصيل" icon={Eye} onClick={() => setSelectedId(order.id)} /><ActionIcon label="الفاتورة" icon={ReceiptText} active={order.invoiceReady} onClick={() => toggleInvoice(order.id)} /><ActionIcon label="الشحنة" icon={Truck} active={order.shipmentReady} onClick={() => toggleShipment(order.id)} /><ActionIcon label="التالي" icon={ArrowLeft} disabled={order.status === "مكتمل"} onClick={() => advanceOrder(order.id)} /></div>
            </article>
          ))}
        </div>
        {visibleOrders.length === 0 && <div className="p-10 text-center text-[9px] font-medium text-slate-400">لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.</div>}
      </Surface>
      )}
      {selected && (
        <DetailPanel title={selected.id} subtitle={selected.customer} icon={ShoppingCart} onClose={() => setSelectedId(null)}>
          <div className="rounded-[22px] bg-[#f8fcfb] p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-bold text-sky-700">{selected.priority} الأولوية</p><h3 className="mt-2 text-[15px] font-bold text-slate-900">{selected.title}</h3><p className="mt-2 text-[22px] font-bold text-slate-950">{formatCurrency(selected.amount)}</p></div><span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(selected.status)}`}>{selected.status}</span></div>
          </div>
          <InfoGrid items={[{ label: "المسؤول", value: selected.owner }, { label: "تاريخ الإنشاء", value: selected.createdAt }, { label: "تاريخ الاستحقاق", value: selected.dueDate }, { label: "نسبة الإنجاز", value: `${selected.progress}%` }]} />
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-[8px] font-medium text-slate-400">ملاحظات الطلب</p><p className="mt-2 text-[9px] font-medium leading-5 text-slate-700">{selected.notes || "لا توجد ملاحظات."}</p></div>
          <div className="mt-4 grid grid-cols-2 gap-3"><button type="button" onClick={() => toggleInvoice(selected.id)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-[9px] font-bold ${selected.invoiceReady ? "bg-emerald-50 text-emerald-700" : "bg-slate-900 text-white"}`}><ReceiptText size={14} />{selected.invoiceReady ? "الفاتورة جاهزة" : "تجهيز الفاتورة"}</button><button type="button" onClick={() => toggleShipment(selected.id)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-[9px] font-bold ${selected.shipmentReady ? "bg-sky-50 text-sky-700" : "bg-slate-900 text-white"}`}><Truck size={14} />{selected.shipmentReady ? "الشحنة جاهزة" : "تجهيز الشحنة"}</button></div>
          {selected.status !== "مكتمل" && <button type="button" onClick={() => advanceOrder(selected.id)} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#236c83] text-[9px] font-bold text-white"><ArrowLeft size={14} />نقل الطلب للمرحلة التالية</button>}
          <button type="button" onClick={() => { if (window.confirm("حذف هذا الطلب؟")) deleteOrder(selected.id); }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[9px] font-bold text-red-600"><Trash2 size={14} /> حذف الطلب</button>
        </DetailPanel>
      )}
      {showCreate && (
        <OrderCreateModal
          customers={customers}
          isSaving={isSavingOrder}
          errorMessage={addOrderError}
          onClose={() => setShowCreate(false)}
          onSave={createOrder}
        />
      )}
    </>
  );
}
function ActionIcon({ label, icon: Icon, onClick, active = false, disabled = false }: { label: string; icon: LucideIcon; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} disabled={disabled} className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"} disabled:cursor-not-allowed disabled:opacity-35`}>
      <Icon size={14} />
    </button>
  );
}
function OrderCreateModal({
  customers,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: {
  customers: ApiOrderCustomerOption[];
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (draft: OrderFormDraft) => void;
}) {
  const [draft, setDraft] = useState<OrderFormDraft>({ customerId: "", title: "", amount: 0, priority: "متوسطة", dueDate: "", owner: "", notes: "" });
  const canSave = draft.customerId !== "" && draft.title.trim().length > 2 && draft.amount > 0 && draft.dueDate.length > 0 && draft.owner.trim().length > 1 && !isSaving;
  const update = <K extends keyof OrderFormDraft>(key: K, value: OrderFormDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur"><div><h2 className="text-[16px] font-bold text-slate-900">إنشاء طلب جديد</h2></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><X size={16} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {errorMessage && (
            <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[9px] font-bold text-red-600">{errorMessage}</div>
          )}
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-[9px] font-bold text-slate-600">العميل</span>
            <select value={draft.customerId} onChange={(event) => update("customerId", event.target.value ? Number(event.target.value) : "")} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none">
              <option value="">اختر العميل...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2"><Field label="عنوان الطلب" value={draft.title} onChange={(value) => update("title", value)} placeholder="مثال: توريد وربط أجهزة الشبكة" required /></div>
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">قيمة الطلب</span><input type="number" min="0" value={draft.amount || ""} onChange={(event) => update("amount", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none" placeholder="0" /></label>
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">الأولوية</span><select value={draft.priority} onChange={(event) => update("priority", event.target.value as OrderRecord["priority"])} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none"><option value="عالية">عالية</option><option value="متوسطة">متوسطة</option><option value="عادية">عادية</option></select></label>
          <Field label="المسؤول" value={draft.owner} onChange={(value) => update("owner", value)} placeholder="اسم المسؤول عن الطلب" required />
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">تاريخ الاستحقاق</span><input type="date" value={draft.dueDate} onChange={(event) => update("dueDate", event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-[9px] font-bold text-slate-600">ملاحظات</span><textarea value={draft.notes} onChange={(event) => update("notes", event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[9px] outline-none" placeholder="تفاصيل إضافية عن الطلب..." /></label>
        </div>
        <div className="calm-add-footer flex justify-end gap-2 border-t p-5"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-[9px] font-bold text-slate-600">إلغاء</button><button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="h-10 rounded-xl bg-[#237c82] px-5 text-[9px] font-bold text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:opacity-40">{isSaving ? "جاري الحفظ..." : "حفظ الطلب"}</button></div>
      </div>
    </div>
  );
}
'''


def main():
    original = FILE_PATH.read_text(encoding="utf-8")

    if IMPORT_ANCHOR not in original:
        print(f"ABORTED - import anchor found 0 time(s)")
        return
    if original.count(IMPORT_ANCHOR) != 1:
        print(f"ABORTED - import anchor found {original.count(IMPORT_ANCHOR)} time(s), expected 1")
        return

    if "@/services/orders" in original:
        print("ABORTED - orders import already present, skipping to avoid duplicate")
        return

    lines = original.split("\n")

    start_index = None
    end_index = None
    for i, line in enumerate(lines):
        if line.strip() == START_MARKER:
            start_index = i
            break
    if start_index is None:
        print("ABORTED - start marker not found")
        return
    for i in range(start_index + 1, len(lines)):
        if lines[i].strip() == END_MARKER:
            end_index = i
            break
    if end_index is None:
        print("ABORTED - end marker not found after start marker")
        return

    new_lines = lines[:start_index] + NEW_BLOCK.split("\n") + lines[end_index:]
    new_content = "\n".join(new_lines)

    import_anchor_index = new_content.index(IMPORT_ANCHOR) + len(IMPORT_ANCHOR)
    new_content = (
        new_content[:import_anchor_index]
        + "\n"
        + ORDERS_IMPORT_BLOCK
        + new_content[import_anchor_index:]
    )

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = FILE_PATH.with_suffix(FILE_PATH.suffix + f".backup_{timestamp}")
    backup_path.write_text(original, encoding="utf-8")

    FILE_PATH.write_text(new_content, encoding="utf-8")
    print(f"Applied: Orders module wired to backend (line-based). Backup: {backup_path.name}")


if __name__ == "__main__":
    main()
