import datetime
import pathlib

FILE_PATH = pathlib.Path("/workspaces/bi-technology-ai-api/frontend/next-frontend/app/dashboard/page.tsx")

START_MARKER = "function InventoryWorkspace() {"
END_MARKER = "function ReportsWorkspace() {"

NEW_BLOCK = '''function InventoryWorkspace() {
  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [customers, setCustomers] = useState<InventoryCustomerOption[]>([]);
  const [category, setCategory] = useState("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyDraft = { name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", location: "", batchNumber: "", customerId: 0, customerName: "", unitValue: 0, movement: 0 };
  const [draft, setDraft] = useState<Omit<InventoryRecord, "id" | "dbId">>(emptyDraft);

  const mapItem = (item: ApiInventoryItem, customersById: Map<number, InventoryCustomerOption>): InventoryRecord => {
    const customer = item.customer_id != null ? customersById.get(item.customer_id) : undefined;
    return {
      id: String(item.id),
      dbId: item.id,
      name: item.name,
      category: item.category ?? "عام",
      sku: item.sku,
      stock: item.quantity,
      minimum: item.minimum,
      maximum: item.maximum,
      warehouse: item.warehouse ?? "المستودع الرئيسي",
      location: item.location ?? "",
      batchNumber: item.batch_number ?? "",
      customerId: item.customer_id ?? 0,
      customerName: customer?.name ?? "غير محدد",
      unitValue: item.unit_price,
      movement: item.movement,
    };
  };

  const loadInventory = useCallback(async () => {
    setInventoryLoading(true);
    setInventoryError(null);
    try {
      const [customersData, inventoryData] = await Promise.all([getInventoryCustomersApi(), getInventoryApi()]);
      setCustomers(customersData);
      const customersById = new Map(customersData.map((customer) => [customer.id, customer]));
      setItems(inventoryData.map((item) => mapItem(item, customersById)));
    } catch (error) {
      setInventoryError(error instanceof Error ? error.message : "تعذر تحميل المخزون");
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const categories = ["الكل", ...Array.from(new Set(items.map((item) => item.category)))];
  const visible = items.filter((item) => category === "الكل" || item.category === category);
  const totalValue = items.reduce((sum, item) => sum + item.stock * item.unitValue, 0);
  const lowItems = items.filter((item) => item.stock <= item.minimum);
  const openNew = () => { setEditingId(null); setSaveError(null); setDraft(emptyDraft); setFormOpen(true); };
  const openEdit = (item: InventoryRecord) => { const { id, dbId, ...rest } = item; setEditingId(id); setSaveError(null); setDraft(rest); setFormOpen(true); };
  const saveItem = async () => {
    if (!draft.name.trim() || !draft.sku.trim() || !draft.customerId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      if (editingId) {
        const target = items.find((item) => item.id === editingId);
        if (!target) return;
        const updated = await updateInventoryItemApi(target.dbId, {
          name: draft.name,
          sku: draft.sku,
          quantity: draft.stock,
          unit_price: draft.unitValue,
          category: draft.category,
          warehouse: draft.warehouse,
          location: draft.location,
          batch_number: draft.batchNumber,
          customer_id: draft.customerId,
          minimum: draft.minimum,
          maximum: draft.maximum,
        });
        setItems((current) => current.map((item) => item.id === editingId ? mapItem(updated, customersById) : item));
      } else {
        const created = await createInventoryItemApi({
          name: draft.name,
          sku: draft.sku,
          quantity: draft.stock,
          unit_price: draft.unitValue,
          customer_id: draft.customerId,
          category: draft.category,
          warehouse: draft.warehouse,
          location: draft.location,
          batch_number: draft.batchNumber,
          minimum: draft.minimum,
          maximum: draft.maximum,
        });
        setItems((current) => [mapItem(created, customersById), ...current]);
      }
      setFormOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر حفظ الصنف");
    } finally {
      setIsSavingItem(false);
    }
  };
  const deleteItem = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    try {
      await deleteInventoryItemApi(target.dbId);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حذف الصنف");
    }
  };
  const restock = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    try {
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      const updated = await restockInventoryItemApi(target.dbId);
      setItems((current) => current.map((item) => item.id === id ? mapItem(updated, customersById) : item));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر توريد الصنف");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="INVENTORY CONTROL" title="المخزون" description="بضاعة العملاء المخزّنة لديك — إضافة الأصناف وتعديل الكميات والحدود وإدارة التوريد." icon={Warehouse} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة صنف</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MiniStat label="قيمة المخزون" value={formatCurrency(totalValue)} icon={CircleDollarSign} tone="bg-sky-50 text-sky-700" note="القيمة الحالية" /><MiniStat label="إجمالي الأصناف" value={String(items.length)} icon={Boxes} tone="bg-blue-50 text-blue-700" note="كل المستودعات" /><MiniStat label="تحتاج توريد" value={String(lowItems.length)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="أقل من الحد الأدنى" /><MiniStat label="مستودعات نشطة" value={String(new Set(items.map((item) => item.warehouse)).size)} icon={Warehouse} tone="bg-emerald-50 text-emerald-700" note="مواقع التخزين" /></section>
      {inventoryLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[9px] font-medium text-slate-400">جاري تحميل المخزون...</div>
      )}
      {!inventoryLoading && inventoryError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[9px] font-bold text-red-600">تعذر تحميل المخزون — رمز الخطأ: {inventoryError}</div>
      )}
      {!inventoryLoading && !inventoryError && (
      <>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`workspace-filter ${category === item ? "is-active" : ""}`}>{item}</button>)}</div></Surface>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => { const ratio = Math.min(100, Math.round((item.stock / Math.max(item.maximum, 1)) * 100)); const low = item.stock <= item.minimum; return (
          <article key={item.id} className="record-card record-card-inventory">
            <div className="flex items-start justify-between gap-3"><span className="record-icon"><Boxes size={17} /></span><span className={`rounded-full px-3 py-1 text-[7px] font-bold ${low ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{low ? "يحتاج توريد" : "متوفر"}</span></div>
            <p className="mt-4 text-[8px] font-bold text-lime-700">{item.sku}</p><h3 className="mt-1 text-[10px] font-bold text-slate-900">{item.name}</h3><p className="mt-2 text-[8px] font-medium text-slate-500">{item.category} · {item.warehouse}</p>
            <p className="mt-1 text-[8px] font-bold text-sky-700">عميل: {item.customerName}</p>
            {item.location && <p className="mt-1 text-[7px] font-medium text-slate-400">الموقع: {item.location}{item.batchNumber ? ` · دفعة ${item.batchNumber}` : ""}</p>}
            <div className="mt-4"><div className="mb-2 flex justify-between text-[7px] font-medium text-slate-400"><span>المتاح {item.stock}</span><span>الحد الأقصى {item.maximum}</span></div><div className="h-2 overflow-hidden rounded-full bg-lime-50"><div className={`h-full rounded-full ${low ? "bg-amber-400" : "bg-lime-500"}`} style={{ width: `${ratio}%` }} /></div></div>
            <div className="mt-4 grid grid-cols-2 gap-2"><span className="record-meta">الحد الأدنى {item.minimum}</span><span className="record-meta">{formatCurrency(item.unitValue)}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => restock(item.id)} className="record-action"><Plus size={13} /> توريد</button><button type="button" onClick={() => openEdit(item)} className="record-action"><SlidersHorizontal size={13} /> تعديل</button><button type="button" onClick={() => { if (window.confirm("حذف هذا الصنف؟")) deleteItem(item.id); }} className="record-action record-action-danger"><Trash2 size={13} /></button></div>
          </article>
        ); })}
      </section>
      </>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card"><div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-lime-700">المخزون</p><h3 className="mt-1 text-[15px] font-bold text-slate-900">{editingId ? "تعديل الصنف" : "إضافة صنف جديد"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[9px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">اسم الصنف</span><input className="workspace-input" placeholder="مثال: أثاث مكتبي مستورد" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">SKU</span><input className="workspace-input" placeholder="مثال: FUR-2026-001" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">العميل (صاحب البضاعة)</span><select className="workspace-input" value={draft.customerId || ""} onChange={(e) => { const id = Number(e.target.value); const found = customers.find((c) => c.id === id); setDraft({ ...draft, customerId: id, customerName: found?.name ?? "" }); }}><option value="">اختر العميل...</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">التصنيف</span><input className="workspace-input" placeholder="مثال: أثاث، أجهزة، مواد غذائية" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">المستودع</span><input className="workspace-input" placeholder="مثال: المستودع الرئيسي - جدة" value={draft.warehouse} onChange={(e) => setDraft({ ...draft, warehouse: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">موقع التخزين (اختياري)</span><input className="workspace-input" placeholder="مثال: ممر A - رف 12" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">رقم الدفعة (اختياري)</span><input className="workspace-input" placeholder="مثال: BATCH-0728" value={draft.batchNumber} onChange={(e) => setDraft({ ...draft, batchNumber: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">الكمية المتوفرة</span><input className="workspace-input" type="number" placeholder="0" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">الحد الأدنى (تنبيه التوريد)</span><input className="workspace-input" type="number" placeholder="5" value={draft.minimum} onChange={(e) => setDraft({ ...draft, minimum: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">الحد الأقصى للتخزين</span><input className="workspace-input" type="number" placeholder="50" value={draft.maximum} onChange={(e) => setDraft({ ...draft, maximum: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[8px] font-bold text-slate-500">القيمة التقديرية للوحدة (ر.س)</span><input className="workspace-input" type="number" placeholder="0" value={draft.unitValue} onChange={(e) => setDraft({ ...draft, unitValue: Number(e.target.value) })} /></label>
        </div>
        <button type="button" disabled={isSavingItem} onClick={saveItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الصنف"}</button>
      </div></div>}
    </>
  );
}
'''


def main():
    original = FILE_PATH.read_text(encoding="utf-8")
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

    new_lines = lines[:start_index] + NEW_BLOCK.split("\n")[:-1] + lines[end_index:]
    new_content = "\n".join(new_lines)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = FILE_PATH.with_suffix(FILE_PATH.suffix + f".backup_{timestamp}")
    backup_path.write_text(original, encoding="utf-8")

    FILE_PATH.write_text(new_content, encoding="utf-8")
    print(f"Applied: Inventory customer-linked rebuild. Backup: {backup_path.name}")


if __name__ == "__main__":
    main()
