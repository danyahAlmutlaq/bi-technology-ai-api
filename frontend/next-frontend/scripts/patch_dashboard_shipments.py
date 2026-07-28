"""
Connects the Shipments module inside app/dashboard/page.tsx to the
real backend (customers, delivery companies, shipments), replacing
the demo/localStorage-based ShipmentsWorkspace entirely.

Run once from the frontend/next-frontend directory:
    python3 scripts/patch_dashboard_shipments.py
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

TARGET = Path(__file__).resolve().parent.parent / "app" / "dashboard" / "page.tsx"

NEW_SHIPMENTS_WORKSPACE = '''function ShipmentsWorkspace() {
  const [shipments, setShipments] = useState<ApiShipment[]>([]);
  const [shipmentCustomers, setShipmentCustomers] = useState<ShipmentCustomerOption[]>([]);
  const [companies, setCompanies] = useState<DeliveryCompanyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({
    customer_id: "",
    delivery_company_id: "",
    tracking_number: "",
    shipping_cost: "",
    notes: "",
  });

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [shipmentsList, customersList, companiesList] = await Promise.all([
        getShipmentsApi(),
        getShipmentCustomersApi(),
        getDeliveryCompaniesApi(),
      ]);
      setShipments(shipmentsList);
      setShipmentCustomers(customersList);
      setCompanies(companiesList);
    } catch (err) {
      console.error("Shipments API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحميل الشحنات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const customerName = (id: number) =>
    shipmentCustomers.find((item) => item.id === id)?.name ?? `عميل #${id}`;
  const companyName = (id: number) =>
    companies.find((item) => item.id === id)?.name ?? `شركة #${id}`;

  const statusLabel = (statusValue: string) => {
    if (statusValue === "in_transit") return "في الطريق";
    if (statusValue === "delivered") return "تم التسليم";
    if (statusValue === "cancelled") return "ملغاة";
    return "قيد التجهيز";
  };
  const statusProgress = (statusValue: string) => {
    if (statusValue === "in_transit") return 60;
    if (statusValue === "delivered") return 100;
    if (statusValue === "cancelled") return 0;
    return 15;
  };
  const statusToneLocal = (statusValue: string) => {
    if (statusValue === "delivered") return "bg-emerald-50 text-emerald-700";
    if (statusValue === "in_transit") return "bg-orange-50 text-orange-700";
    if (statusValue === "cancelled") return "bg-red-50 text-red-700";
    return "bg-slate-100 text-slate-600";
  };
  const nextStatusValue = (statusValue: string) => {
    if (statusValue === "pending") return "in_transit";
    if (statusValue === "in_transit") return "delivered";
    return null;
  };

  const active = shipments.filter(
    (item) => item.status !== "delivered" && item.status !== "cancelled"
  ).length;
  const delivered = shipments.filter((item) => item.status === "delivered").length;

  const openNew = () => {
    setDraft({ customer_id: "", delivery_company_id: "", tracking_number: "", shipping_cost: "", notes: "" });
    setSaveError(null);
    setFormOpen(true);
  };

  const saveShipment = async () => {
    if (!draft.customer_id || !draft.delivery_company_id) return;
    try {
      setIsSaving(true);
      setSaveError(null);
      await createShipmentApi({
        customer_id: Number(draft.customer_id),
        delivery_company_id: Number(draft.delivery_company_id),
        tracking_number: draft.tracking_number.trim() || undefined,
        shipping_cost: draft.shipping_cost ? Number(draft.shipping_cost) : 0,
        notes: draft.notes.trim() || undefined,
      });
      setFormOpen(false);
      await loadAll();
    } catch (err) {
      console.error("Create shipment API error:", err);
      setSaveError(err instanceof Error ? err.message : "تعذر إضافة الشحنة");
    } finally {
      setIsSaving(false);
    }
  };

  const advanceShipment = async (shipment: ApiShipment) => {
    const next = nextStatusValue(shipment.status);
    if (!next) return;
    try {
      setUpdatingId(shipment.id);
      await updateShipmentApi(shipment.id, { status: next });
      await loadAll();
    } catch (err) {
      console.error("Update shipment API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحديث الشحنة");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteShipmentRecord = async (shipmentId: number) => {
    if (!window.confirm("حذف هذه الشحنة؟")) return;
    try {
      setUpdatingId(shipmentId);
      await deleteShipmentApi(shipmentId);
      await loadAll();
    } catch (err) {
      console.error("Delete shipment API error:", err);
      setError(err instanceof Error ? err.message : "تعذر حذف الشحنة");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="SHIPMENT OPERATIONS"
        title="الشحنات"
        description="إنشاء الشحنات وتعديل بيانات التتبع وتحديث مراحل التوصيل."
        icon={PackageCheck}
        action={
          <button type="button" onClick={openNew} className="workspace-primary-button">
            <Plus size={14} /> إضافة شحنة
          </button>
        }
      />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي الشحنات" value={String(shipments.length)} icon={PackageOpen} tone="bg-blue-50 text-blue-700" note="كل السجلات" />
        <MiniStat label="شحنات نشطة" value={String(active)} icon={Truck} tone="bg-orange-50 text-orange-700" note="قيد التنفيذ" />
        <MiniStat label="تم التسليم" value={String(delivered)} icon={PackageCheck} tone="bg-emerald-50 text-emerald-700" note="مكتملة" />
        <MiniStat label="شركات مستخدمة" value={String(new Set(shipments.map((item) => item.delivery_company_id)).size)} icon={Route} tone="bg-sky-50 text-sky-700" note="ناقلون نشطون" />
      </section>
      {loading && (
        <Surface className="p-10 text-center text-[11px] font-bold text-slate-500">
          جاري تحميل الشحنات...
        </Surface>
      )}
      {!loading && error && (
        <Surface className="flex flex-col items-center gap-3 border-red-200 bg-red-50 p-10 text-center">
          <p className="text-[11px] font-bold text-red-600">{error}</p>
          <button type="button" onClick={() => void loadAll()} className="rounded-xl bg-red-600 px-4 py-2 text-[10px] font-black text-white">
            إعادة المحاولة
          </button>
        </Surface>
      )}
      {!loading && !error && shipments.length === 0 && (
        <Surface className="p-10 text-center text-[11px] font-bold text-slate-400">
          لا توجد شحنات بعد. اضغطي "إضافة شحنة" لإنشاء أول شحنة.
        </Surface>
      )}
      {!loading && !error && shipments.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shipments.map((shipment) => (
            <article key={shipment.id} className="record-card record-card-shipment">
              <div className="flex items-start justify-between gap-3">
                <span className="record-icon"><Truck size={17} /></span>
                <span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusToneLocal(shipment.status)}`}>
                  {statusLabel(shipment.status)}
                </span>
              </div>
              <p className="mt-4 text-[8px] font-bold text-orange-700">SHP-{shipment.id}</p>
              <h3 className="mt-1 text-[10px] font-bold text-slate-900">{customerName(shipment.customer_id)}</h3>
              <p className="mt-2 text-[8px] font-medium text-slate-500">
                {companyName(shipment.delivery_company_id)} · {shipment.tracking_number || "بدون رقم تتبع"}
              </p>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-[7px] font-medium text-slate-400">
                  <span>{formatCurrency(shipment.shipping_cost)}</span>
                  <span>{statusProgress(shipment.status)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-orange-50">
                  <div className="h-full rounded-full bg-orange-400" style={{ width: `${statusProgress(shipment.status)}%` }} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void advanceShipment(shipment)}
                  disabled={updatingId === shipment.id || !nextStatusValue(shipment.status)}
                  className="record-action disabled:opacity-40"
                >
                  <ArrowLeft size={13} /> تحديث
                </button>
                <button
                  type="button"
                  onClick={() => void deleteShipmentRecord(shipment.id)}
                  disabled={updatingId === shipment.id}
                  className="record-action record-action-danger disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
      {formOpen && (
        <div className="workspace-modal">
          <div className="workspace-modal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-medium text-orange-700">الشحنات</p>
                <h3 className="mt-1 text-[15px] font-bold text-slate-900">إضافة شحنة جديدة</h3>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="modal-close">
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <select
                className="workspace-input"
                value={draft.customer_id}
                onChange={(e) => setDraft({ ...draft, customer_id: e.target.value })}
              >
                <option value="">اختاري العميل</option>
                {shipmentCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <select
                className="workspace-input"
                value={draft.delivery_company_id}
                onChange={(e) => setDraft({ ...draft, delivery_company_id: e.target.value })}
              >
                <option value="">اختاري شركة التوصيل</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              <input
                className="workspace-input"
                placeholder="رقم التتبع"
                value={draft.tracking_number}
                onChange={(e) => setDraft({ ...draft, tracking_number: e.target.value })}
              />
              <input
                className="workspace-input"
                type="number"
                min="0"
                placeholder="تكلفة الشحن"
                value={draft.shipping_cost}
                onChange={(e) => setDraft({ ...draft, shipping_cost: e.target.value })}
              />
              <div className="sm:col-span-2">
                <input
                  className="workspace-input w-full"
                  placeholder="ملاحظات"
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                />
              </div>
            </div>
            {saveError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-bold text-red-600">
                {saveError}
              </div>
            )}
            <button
              type="button"
              onClick={() => void saveShipment()}
              disabled={isSaving || !draft.customer_id || !draft.delivery_company_id}
              className="workspace-primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? "جاري الحفظ..." : "إضافة الشحنة"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
'''

IMPORT_ANCHOR = (
    'import {\n'
    '  createBooking as createBookingApi,\n'
    '  getBookings as getBookingsApi,\n'
    '  getCustomers as getBookingCustomersApi,\n'
    '  type Booking as ApiBooking,\n'
    '  type CreateBookingPayload as CreateBookingApiPayload,\n'
    '  type CustomerOption,\n'
    '} from "@/services/bookings";\n'
)

IMPORT_ADDITION = (
    'import {\n'
    '  getCustomers as getShipmentCustomersApi,\n'
    '  getDeliveryCompanies as getDeliveryCompaniesApi,\n'
    '  getShipments as getShipmentsApi,\n'
    '  createShipment as createShipmentApi,\n'
    '  updateShipment as updateShipmentApi,\n'
    '  deleteShipment as deleteShipmentApi,\n'
    '  type Shipment as ApiShipment,\n'
    '  type CustomerOption as ShipmentCustomerOption,\n'
    '  type DeliveryCompanyOption,\n'
    '} from "@/services/shipments";\n'
)


def replace_function_block(content: str, start_marker: str, end_marker: str, new_block: str) -> str:
    lines = content.split("\n")
    start_idx = None
    end_idx = None

    for i, line in enumerate(lines):
        if line.strip() == start_marker.strip():
            start_idx = i
            break

    if start_idx is None:
        raise ValueError(f"start marker not found: {start_marker}")

    for i in range(start_idx + 1, len(lines)):
        if lines[i].strip() == end_marker.strip():
            end_idx = i
            break

    if end_idx is None:
        raise ValueError(f"end marker not found after start: {end_marker}")

    new_lines = new_block.rstrip("\n").split("\n")
    lines[start_idx:end_idx] = new_lines
    return "\n".join(lines)


def main():
    if not TARGET.exists():
        print(f"ERROR: target file not found: {TARGET}")
        sys.exit(1)

    content = TARGET.read_text(encoding="utf-8")

    if content.count(IMPORT_ANCHOR) != 1:
        print(f"ABORTED — import anchor found {content.count(IMPORT_ANCHOR)} time(s), expected 1.")
        sys.exit(1)

    has_start = any(
        line.strip() == "function ShipmentsWorkspace() {"
        for line in content.split("\n")
    )
    has_end = any(
        line.strip() == "function InventoryWorkspace() {"
        for line in content.split("\n")
    )
    if not has_start or not has_end:
        print("ABORTED — could not find ShipmentsWorkspace/InventoryWorkspace boundaries.")
        sys.exit(1)

    content = content.replace(IMPORT_ANCHOR, IMPORT_ANCHOR + IMPORT_ADDITION, 1)
    print("Applied: import services/shipments")

    content = replace_function_block(
        content,
        "function ShipmentsWorkspace() {",
        "function InventoryWorkspace() {",
        NEW_SHIPMENTS_WORKSPACE,
    )
    print("Applied: ShipmentsWorkspace -> real API (line-based)")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = TARGET.with_suffix(f".tsx.backup_{timestamp}")
    shutil.copy(TARGET, backup_path)
    print(f"Backup saved to: {backup_path}")

    TARGET.write_text(content, encoding="utf-8")
    print(f"Successfully patched: {TARGET}")


if __name__ == "__main__":
    main()
