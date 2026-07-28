"""
Adds a real "Bookings" module to app/dashboard/page.tsx, wired to the
already-working services/bookings.ts API (no demo data).

Run once from the frontend/next-frontend directory:
    python3 scripts/patch_dashboard_bookings.py
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

TARGET = Path(__file__).resolve().parent.parent / "app" / "dashboard" / "page.tsx"

BOOKINGS_WORKSPACE_CODE = '''function AddBookingModal({
  customers,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: {
  customers: CustomerOption[];
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (payload: CreateBookingApiPayload) => void;
}) {
  const [customerId, setCustomerId] = useState<string>("");
  const [serviceType, setServiceType] = useState<"domestic" | "international">("domestic");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [packageCount, setPackageCount] = useState("1");
  const [totalWeight, setTotalWeight] = useState("");
  const [notes, setNotes] = useState("");

  const canSave =
    customerId !== "" &&
    origin.trim() !== "" &&
    destination.trim() !== "" &&
    packageCount !== "" &&
    totalWeight.trim() !== "";

  const handleSave = () => {
    onSave({
      customer_id: Number(customerId),
      service_type: serviceType,
      origin: origin.trim(),
      destination: destination.trim(),
      pickup_date: pickupDate || undefined,
      expected_delivery_date: expectedDeliveryDate || undefined,
      package_count: Number(packageCount),
      total_weight: Number(totalWeight),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-base font-black text-slate-900">إضافة حجز جديد</h2>
            <p className="mt-1 text-[9px] font-semibold text-slate-400">
              اختاري العميل وأكملي بيانات الحجز.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
                العميل
                <span className="text-[#8E704E]">*</span>
              </span>
              <select
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              >
                <option value="">اختاري عميلًا</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
                نوع الحجز
                <span className="text-[#8E704E]">*</span>
              </span>
              <select
                value={serviceType}
                onChange={(event) =>
                  setServiceType(event.target.value as "domestic" | "international")
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              >
                <option value="domestic">محلي</option>
                <option value="international">دولي</option>
              </select>
            </label>
            <Field label="من (الاستلام)" value={origin} onChange={setOrigin} placeholder="الرياض" required />
            <Field label="إلى (التسليم)" value={destination} onChange={setDestination} placeholder="جدة" required />
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
                تاريخ الاستلام
              </span>
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
                تاريخ التسليم المتوقع
              </span>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(event) => setExpectedDeliveryDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
                عدد الطرود
                <span className="text-[#8E704E]">*</span>
              </span>
              <input
                type="number"
                min={1}
                value={packageCount}
                onChange={(event) => setPackageCount(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
                الوزن الإجمالي (كجم)
                <span className="text-[#8E704E]">*</span>
              </span>
              <input
                type="number"
                min={0}
                step="0.1"
                value={totalWeight}
                onChange={(event) => setTotalWeight(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <div className="sm:col-span-2">
              <Field label="الملاحظات" value={notes} onChange={setNotes} placeholder="أي ملاحظات إضافية" />
            </div>
          </div>
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-bold text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 rounded-xl border border-slate-200 px-5 text-[10px] font-black text-slate-600 disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!canSave || isSaving}
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#237c82] px-6 text-[10px] font-black text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={14} />
              {isSaving ? "جاري الحفظ..." : "حفظ الحجز"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function BookingsWorkspace() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [bookingCustomers, setBookingCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsList, customersList] = await Promise.all([
        getBookingsApi(),
        getBookingCustomersApi(),
      ]);
      setBookings(bookingsList);
      setBookingCustomers(customersList);
    } catch (err) {
      console.error("Bookings API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const customerName = (customerId: number) =>
    bookingCustomers.find((item) => item.id === customerId)?.name ?? `عميل #${customerId}`;

  const createBookingRecord = async (payload: CreateBookingApiPayload) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await createBookingApi(payload);
      setShowCreate(false);
      await loadBookings();
    } catch (err) {
      console.error("Create booking API error:", err);
      setSaveError(err instanceof Error ? err.message : "تعذر إضافة الحجز");
    } finally {
      setIsSaving(false);
    }
  };

  const statusLabel = (status: string) => {
    if (status === "confirmed") return "مؤكد";
    if (status === "cancelled") return "ملغي";
    return "مسودة";
  };

  const statusTone = (status: string) => {
    if (status === "confirmed") return "bg-emerald-50 text-emerald-700";
    if (status === "cancelled") return "bg-red-50 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="BOOKING"
        title="الحجوزات"
        description=""
        icon={ClipboardList}
        action={
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[9px] font-bold text-white shadow-lg"
          >
            <Plus size={14} />
            حجز جديد
          </button>
        }
      />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat
          label="إجمالي الحجوزات"
          value={String(bookings.length)}
          icon={ClipboardList}
          tone="bg-sky-50 text-sky-700"
          note="كل الحجوزات المسجلة"
        />
        <MiniStat
          label="مؤكدة"
          value={String(bookings.filter((item) => item.status === "confirmed").length)}
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700"
          note="جاهزة للتحويل لشحنة"
        />
        <MiniStat
          label="مسودة"
          value={String(bookings.filter((item) => item.status === "draft").length)}
          icon={Clock3}
          tone="bg-amber-50 text-amber-700"
          note="بانتظار التأكيد"
        />
        <MiniStat
          label="ملغاة"
          value={String(bookings.filter((item) => item.status === "cancelled").length)}
          icon={CircleAlert}
          tone="bg-red-50 text-red-700"
          note="لم تكتمل"
        />
      </section>
      {loading && (
        <Surface className="p-10 text-center text-[11px] font-bold text-slate-500">
          جاري تحميل الحجوزات...
        </Surface>
      )}
      {!loading && error && (
        <Surface className="flex flex-col items-center gap-3 border-red-200 bg-red-50 p-10 text-center">
          <p className="text-[11px] font-bold text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => void loadBookings()}
            className="rounded-xl bg-red-600 px-4 py-2 text-[10px] font-black text-white"
          >
            إعادة المحاولة
          </button>
        </Surface>
      )}
      {!loading && !error && bookings.length === 0 && (
        <Surface className="p-10 text-center text-[11px] font-bold text-slate-400">
          لا توجد حجوزات بعد. اضغطي "حجز جديد" لإضافة أول حجز.
        </Surface>
      )}
      {!loading && !error && bookings.length > 0 && (
        <Surface className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[10px]">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-[9px] font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-3">رقم الحجز</th>
                  <th className="px-4 py-3">العميل</th>
                  <th className="px-4 py-3">النوع</th>
                  <th className="px-4 py-3">من</th>
                  <th className="px-4 py-3">إلى</th>
                  <th className="px-4 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-bold text-slate-800">{booking.booking_number}</td>
                    <td className="px-4 py-3 text-slate-600">{customerName(booking.customer_id)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {booking.service_type === "international" ? "دولي" : "محلي"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{booking.origin}</td>
                    <td className="px-4 py-3 text-slate-600">{booking.destination}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-[8px] font-black ${statusTone(booking.status)}`}>
                        {statusLabel(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      )}
      {showCreate && (
        <AddBookingModal
          customers={bookingCustomers}
          isSaving={isSaving}
          errorMessage={saveError}
          onClose={() => setShowCreate(false)}
          onSave={createBookingRecord}
        />
      )}
    </>
  );
}
'''

PATCHES = []

PATCHES.append((
    "import services/bookings",
    'import {\n'
    '  createCustomer as createCustomerApi,\n'
    '  getCustomers as getCustomersApi,\n'
    '  type Customer as ApiCustomer,\n'
    '} from "@/services/customers";\n',
    'import {\n'
    '  createCustomer as createCustomerApi,\n'
    '  getCustomers as getCustomersApi,\n'
    '  type Customer as ApiCustomer,\n'
    '} from "@/services/customers";\n'
    'import {\n'
    '  createBooking as createBookingApi,\n'
    '  getBookings as getBookingsApi,\n'
    '  getCustomers as getBookingCustomersApi,\n'
    '  type Booking as ApiBooking,\n'
    '  type CreateBookingPayload as CreateBookingApiPayload,\n'
    '  type CustomerOption,\n'
    '} from "@/services/bookings";\n',
))

PATCHES.append((
    "ModuleKey add bookings",
    'type ModuleKey =\n'
    '  | "dashboard"\n'
    '  | "customers"\n'
    '  | "carriers"\n',
    'type ModuleKey =\n'
    '  | "dashboard"\n'
    '  | "customers"\n'
    '  | "bookings"\n'
    '  | "carriers"\n',
))

PATCHES.append((
    "navigation add bookings item",
    '  {\n'
    '    key: "customers",\n'
    '    label: "العملاء",\n'
    '    description: "أفراد وشركات",\n'
    '    icon: Users,\n'
    '    accent: "from-indigo-400 to-violet-400",\n'
    '    soft: "bg-indigo-100 text-indigo-700",\n'
    '  },\n'
    '  {\n'
    '    key: "carriers",\n',
    '  {\n'
    '    key: "customers",\n'
    '    label: "العملاء",\n'
    '    description: "أفراد وشركات",\n'
    '    icon: Users,\n'
    '    accent: "from-indigo-400 to-violet-400",\n'
    '    soft: "bg-indigo-100 text-indigo-700",\n'
    '  },\n'
    '  {\n'
    '    key: "bookings",\n'
    '    label: "الحجوزات",\n'
    '    description: "بداية العملية",\n'
    '    icon: ClipboardList,\n'
    '    accent: "from-amber-300 to-orange-400",\n'
    '    soft: "bg-amber-100 text-amber-700",\n'
    '  },\n'
    '  {\n'
    '    key: "carriers",\n',
))

PATCHES.append((
    "insert BookingsWorkspace + AddBookingModal before OrdersWorkspace",
    "function OrdersWorkspace() {\n",
    BOOKINGS_WORKSPACE_CODE + "function OrdersWorkspace() {\n",
))

PATCHES.append((
    "render BookingsWorkspace",
    '            {activeModule === "orders" && <OrdersWorkspace />}\n',
    '            {activeModule === "bookings" && <BookingsWorkspace />}\n'
    '            {activeModule === "orders" && <OrdersWorkspace />}\n',
))


def main():
    if not TARGET.exists():
        print(f"ERROR: target file not found: {TARGET}")
        sys.exit(1)

    content = TARGET.read_text(encoding="utf-8")

    missing = []
    for name, old, _new in PATCHES:
        if content.count(old) != 1:
            missing.append((name, content.count(old)))

    if missing:
        print("ABORTED — some anchors were not found exactly once:")
        for name, count in missing:
            print(f"  - {name}: found {count} time(s)")
        print("No changes were made to the file.")
        sys.exit(1)

    for name, old, new in PATCHES:
        content = content.replace(old, new, 1)
        print(f"Applied: {name}")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = TARGET.with_suffix(f".tsx.backup_{timestamp}")
    shutil.copy(TARGET, backup_path)
    print(f"Backup saved to: {backup_path}")

    TARGET.write_text(content, encoding="utf-8")
    print(f"Successfully patched: {TARGET}")


if __name__ == "__main__":
    main()