"""
Safe, targeted patch for app/dashboard/page.tsx.

Connects the Customers module to the real backend API instead of the
local demoCustomers array. Makes a timestamped backup before writing,
and aborts with a clear message if any expected anchor text is not
found (so it never partially corrupts the file).

Run once from the frontend/next-frontend directory:
    python3 scripts/patch_dashboard_customers.py
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

TARGET = Path(__file__).resolve().parent.parent / "app" / "dashboard" / "page.tsx"

SIMPLE_PATCHES = []

SIMPLE_PATCHES.append((
    "import services/customers",
    'import Input from "@/components/ui/Input";\n',
    'import Input from "@/components/ui/Input";\n'
    'import {\n'
    '  createCustomer as createCustomerApi,\n'
    '  getCustomers as getCustomersApi,\n'
    '  type Customer as ApiCustomer,\n'
    '} from "@/services/customers";\n',
))

SIMPLE_PATCHES.append((
    "mapApiCustomerToLocal function",
    'function formatCurrency(value: number): string {\n'
    '  return new Intl.NumberFormat("ar-SA", {\n'
    '    style: "currency",\n'
    '    currency: "SAR",\n'
    '    maximumFractionDigits: 0,\n'
    '  }).format(value);\n'
    '}\n',
    'function formatCurrency(value: number): string {\n'
    '  return new Intl.NumberFormat("ar-SA", {\n'
    '    style: "currency",\n'
    '    currency: "SAR",\n'
    '    maximumFractionDigits: 0,\n'
    '  }).format(value);\n'
    '}\n'
    'function mapApiCustomerToLocal(apiCustomer: ApiCustomer): Customer {\n'
    '  const type: CustomerType =\n'
    '    apiCustomer.customer_type === "company" ? "company" : "individual";\n'
    '  return {\n'
    '    id: `CUS-${apiCustomer.id}`,\n'
    '    type,\n'
    '    name: apiCustomer.name,\n'
    '    email: apiCustomer.email ?? "",\n'
    '    phone: apiCustomer.phone ?? "",\n'
    '    city: apiCustomer.city ?? "",\n'
    '    address: apiCustomer.address ?? "",\n'
    '    status: "نشط",\n'
    '    joinedAt: new Intl.DateTimeFormat("ar-SA", {\n'
    '      day: "numeric",\n'
    '      month: "long",\n'
    '      year: "numeric",\n'
    '    }).format(new Date(apiCustomer.created_at)),\n'
    '    totalOrders: 0,\n'
    '    totalSpent: 0,\n'
    '    outstanding: 0,\n'
    '    nationalId: apiCustomer.national_id ?? undefined,\n'
    '    vatNumber: apiCustomer.tax_number ?? undefined,\n'
    '    commercialRegistration: apiCustomer.commercial_registration ?? undefined,\n'
    '    companyWebsite: apiCustomer.company_website ?? undefined,\n'
    '    contactPerson: apiCustomer.contact_person ?? undefined,\n'
    '    invoices: [],\n'
    '    shipments: [],\n'
    '    payments: [],\n'
    '    notes: apiCustomer.notes ? [apiCustomer.notes] : [],\n'
    '  };\n'
    '}\n',
))

SIMPLE_PATCHES.append((
    "customers initial state -> empty array",
    "  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);\n",
    "  const [customers, setCustomers] = useState<Customer[]>([]);\n",
))

SIMPLE_PATCHES.append((
    "loadCustomers effect + new states",
    "  const [showAddCustomer, setShowAddCustomer] = useState(false);\n",
    "  const [showAddCustomer, setShowAddCustomer] = useState(false);\n"
    "  const [customersLoading, setCustomersLoading] = useState(false);\n"
    "  const [customersError, setCustomersError] = useState<string | null>(null);\n"
    "  const [isSavingCustomer, setIsSavingCustomer] = useState(false);\n"
    "  const [addCustomerError, setAddCustomerError] = useState<string | null>(null);\n"
    "  const loadCustomers = useCallback(async () => {\n"
    "    try {\n"
    "      setCustomersLoading(true);\n"
    "      setCustomersError(null);\n"
    "      const apiCustomers = await getCustomersApi();\n"
    "      setCustomers(apiCustomers.map(mapApiCustomerToLocal));\n"
    "    } catch (error) {\n"
    '      console.error("Customers API error:", error);\n'
    "      setCustomersError(\n"
    "        error instanceof Error\n"
    "          ? error.message\n"
    '          : "تعذر تحميل قائمة العملاء — تحقق من الاتصال بالخادم"\n'
    "      );\n"
    "    } finally {\n"
    "      setCustomersLoading(false);\n"
    "    }\n"
    "  }, []);\n"
    "  useEffect(() => {\n"
    "    void loadCustomers();\n"
    "  }, [loadCustomers]);\n",
))

SIMPLE_PATCHES.append((
    "CustomersView loading/error states",
    '            {activeModule === "customers" && !selectedCustomer && (\n'
    "              <CustomersView\n"
    "                customers={customers}\n"
    "                onOpenCustomer={(customerId) => {\n"
    "                  setSelectedCustomerId(customerId);\n"
    '                  setCustomerTab("overview");\n'
    "                }}\n"
    "                onAddCustomer={() => setShowAddCustomer(true)}\n"
    "                onDeleteCustomer={deleteCustomer}\n"
    "              />\n"
    "            )}\n",
    '            {activeModule === "customers" && customersLoading && (\n'
    '              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-[11px] font-bold text-slate-500">\n'
    "                جاري تحميل قائمة العملاء...\n"
    "              </div>\n"
    "            )}\n"
    '            {activeModule === "customers" && !customersLoading && customersError && (\n'
    '              <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-10 text-center">\n'
    '                <p className="text-[11px] font-bold text-red-600">{customersError}</p>\n'
    "                <button\n"
    '                  type="button"\n'
    "                  onClick={() => void loadCustomers()}\n"
    '                  className="rounded-xl bg-red-600 px-4 py-2 text-[10px] font-black text-white"\n'
    "                >\n"
    "                  إعادة المحاولة\n"
    "                </button>\n"
    "              </div>\n"
    "            )}\n"
    '            {activeModule === "customers" &&\n'
    "              !customersLoading &&\n"
    "              !customersError &&\n"
    "              !selectedCustomer && (\n"
    "              <CustomersView\n"
    "                customers={customers}\n"
    "                onOpenCustomer={(customerId) => {\n"
    "                  setSelectedCustomerId(customerId);\n"
    '                  setCustomerTab("overview");\n'
    "                }}\n"
    "                onAddCustomer={() => setShowAddCustomer(true)}\n"
    "                onDeleteCustomer={deleteCustomer}\n"
    "              />\n"
    "            )}\n",
))

SIMPLE_PATCHES.append((
    "AddCustomerModal usage props",
    "      {showAddCustomer && (\n"
    "        <AddCustomerModal\n"
    "          onClose={() => setShowAddCustomer(false)}\n"
    "          onSave={addCustomer}\n"
    "        />\n"
    "      )}\n",
    "      {showAddCustomer && (\n"
    "        <AddCustomerModal\n"
    "          onClose={() => setShowAddCustomer(false)}\n"
    "          onSave={addCustomer}\n"
    "          isSaving={isSavingCustomer}\n"
    "          errorMessage={addCustomerError}\n"
    "        />\n"
    "      )}\n",
))

SIMPLE_PATCHES.append((
    "AddCustomerModal signature",
    "function AddCustomerModal({\n"
    "  onClose,\n"
    "  onSave,\n"
    "}: {\n"
    "  onClose: () => void;\n"
    "  onSave: (draft: AddCustomerDraft) => void;\n"
    "}) {\n",
    "function AddCustomerModal({\n"
    "  onClose,\n"
    "  onSave,\n"
    "  isSaving = false,\n"
    "  errorMessage = null,\n"
    "}: {\n"
    "  onClose: () => void;\n"
    "  onSave: (draft: AddCustomerDraft) => void;\n"
    "  isSaving?: boolean;\n"
    "  errorMessage?: string | null;\n"
    "}) {\n",
))

SIMPLE_PATCHES.append((
    "AddCustomerModal save button + error banner",
    '          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">\n'
    "            <button\n"
    '              type="button"\n'
    "              onClick={onClose}\n"
    '              className="h-11 rounded-xl border border-slate-200 px-5 text-[10px] font-black text-slate-600"\n'
    "            >\n"
    "              إلغاء\n"
    "            </button>\n"
    "            <button\n"
    '              type="button"\n'
    "              disabled={!canSave}\n"
    "              onClick={() => onSave(draft)}\n"
    '              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#237c82] px-6 text-[10px] font-black text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:cursor-not-allowed disabled:opacity-40"\n'
    "            >\n"
    "              <Check size={14} />\n"
    "              حفظ وفتح ملف العميل\n"
    "            </button>\n"
    "          </div>\n",
    "          {errorMessage && (\n"
    '            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-bold text-red-600">\n'
    "              {errorMessage}\n"
    "            </div>\n"
    "          )}\n"
    '          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">\n'
    "            <button\n"
    '              type="button"\n'
    "              onClick={onClose}\n"
    "              disabled={isSaving}\n"
    '              className="h-11 rounded-xl border border-slate-200 px-5 text-[10px] font-black text-slate-600 disabled:opacity-50"\n'
    "            >\n"
    "              إلغاء\n"
    "            </button>\n"
    "            <button\n"
    '              type="button"\n'
    "              disabled={!canSave || isSaving}\n"
    "              onClick={() => onSave(draft)}\n"
    '              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#237c82] px-6 text-[10px] font-black text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:cursor-not-allowed disabled:opacity-40"\n'
    "            >\n"
    "              <Check size={14} />\n"
    '              {isSaving ? "جاري الحفظ..." : "حفظ وفتح ملف العميل"}\n'
    "            </button>\n"
    "          </div>\n",
))

NEW_ADD_CUSTOMER_FUNCTION = """  const addCustomer = async (draft: AddCustomerDraft) => {
    try {
      setIsSavingCustomer(true);
      setAddCustomerError(null);
      const created = await createCustomerApi({
        name: draft.name,
        type: draft.type,
        phone: draft.phone,
        email: draft.email || undefined,
        city: draft.city || undefined,
        address: draft.address || undefined,
        taxNumber: draft.type === "company" ? draft.vatNumber || undefined : undefined,
        nationalId:
          draft.type === "individual" ? draft.nationalId || undefined : undefined,
        commercialRegistration:
          draft.type === "company"
            ? draft.commercialRegistration || undefined
            : undefined,
        companyWebsite:
          draft.type === "company" ? draft.companyWebsite || undefined : undefined,
        contactPerson:
          draft.type === "company" ? draft.contactPerson || undefined : undefined,
        isActive: true,
      });
      const customer = mapApiCustomerToLocal(created);
      setCustomers((current) => [customer, ...current]);
      setShowAddCustomer(false);
      setSelectedCustomerId(customer.id);
      setCustomerTab("overview");
    } catch (error) {
      console.error("Create customer API error:", error);
      setAddCustomerError(
        error instanceof Error ? error.message : "تعذر إضافة العميل"
      );
    } finally {
      setIsSavingCustomer(false);
    }
  };
"""


def replace_add_customer_function(content: str) -> str:
    lines = content.split("\n")
    start_idx = None
    end_idx = None

    for i, line in enumerate(lines):
        if line.strip().startswith("const addCustomer = (draft: AddCustomerDraft)"):
            start_idx = i
            break

    if start_idx is None:
        raise ValueError("addCustomer start line not found")

    for i in range(start_idx + 1, len(lines)):
        if lines[i].strip().startswith("const deleteCustomer = (customerId: string)"):
            end_idx = i
            break

    if end_idx is None:
        raise ValueError("deleteCustomer boundary line not found after addCustomer")

    new_lines = NEW_ADD_CUSTOMER_FUNCTION.rstrip("\n").split("\n")
    lines[start_idx:end_idx] = new_lines
    return "\n".join(lines)


def main():
    if not TARGET.exists():
        print(f"ERROR: target file not found: {TARGET}")
        sys.exit(1)

    content = TARGET.read_text(encoding="utf-8")

    missing = []
    for name, old, _new in SIMPLE_PATCHES:
        if content.count(old) != 1:
            missing.append((name, content.count(old)))

    has_add_customer_marker = any(
        line.strip().startswith("const addCustomer = (draft: AddCustomerDraft)")
        for line in content.split("\n")
    )
    has_delete_customer_marker = any(
        line.strip().startswith("const deleteCustomer = (customerId: string)")
        for line in content.split("\n")
    )
    if not has_add_customer_marker:
        missing.append(("addCustomer start marker", 0))
    if not has_delete_customer_marker:
        missing.append(("deleteCustomer boundary marker", 0))

    if missing:
        print("ABORTED — some anchors were not found exactly once:")
        for name, count in missing:
            print(f"  - {name}: found {count} time(s)")
        print("No changes were made to the file.")
        sys.exit(1)

    for name, old, new in SIMPLE_PATCHES:
        content = content.replace(old, new, 1)
        print(f"Applied: {name}")

    content = replace_add_customer_function(content)
    print("Applied: addCustomer -> async real API call (line-based)")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = TARGET.with_suffix(f".tsx.backup_{timestamp}")
    shutil.copy(TARGET, backup_path)
    print(f"Backup saved to: {backup_path}")

    TARGET.write_text(content, encoding="utf-8")
    print(f"Successfully patched: {TARGET}")


if __name__ == "__main__":
    main()