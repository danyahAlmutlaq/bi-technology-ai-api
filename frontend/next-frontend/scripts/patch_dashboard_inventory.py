import datetime
import pathlib

FILE_PATH = pathlib.Path("/workspaces/bi-technology-ai-api/frontend/next-frontend/app/dashboard/page.tsx")

IMPORT_ANCHOR = '} from "@/services/orders";'

INVENTORY_IMPORT_BLOCK = '''import {
  getInventory as getInventoryApi,
  createInventoryItem as createInventoryItemApi,
  updateInventoryItem as updateInventoryItemApi,
  restockInventoryItem as restockInventoryItemApi,
  deleteInventoryItem as deleteInventoryItemApi,
  type InventoryItem as ApiInventoryItem,
} from "@/services/inventory";'''

START_MARKER = "function InventoryWorkspace() {"
END_MARKER = "function ReportsWorkspace() {"

NEW_BLOCK = '''function InventoryWorkspace() {
  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [category, setCategory] = useState("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<InventoryRecord, "id" | "dbId">>({ name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", unitValue: 0, movement: 0 });

  const mapItem = (item: ApiInventoryItem): InventoryRecord => ({
    id: String(item.id),
    dbId: item.id,
    name: item.name,
    category: item.category ?? "عام",
    sku: item.sku,
    stock: item.quantity,
    minimum: item.minimum,
    maximum: item.maximum,
    warehouse: item.warehouse ?? "المستودع الرئيسي",
    unitValue: item.unit_price,
    movement: item.movement,
  });

  const loadInventory = useCallback(async () => {
    setInventoryLoading(true);
    setInventoryError(null);
    try {
      const data = await getInventoryApi();
      setItems(data.map(mapItem));
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
  const openNew = () => { setEditingId(null); setDraft({ name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", unitValue: 0, movement: 0 }); setFormOpen(true); };
  const openEdit = (item: InventoryRecord) => { const { id, dbId, ...rest } = item; setEditingId(id); setDraft(rest); setFormOpen(true); };
  const saveItem = async () => {
    if (!draft.name.trim() || !draft.sku.trim()) return;
    try {
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
          minimum: draft.minimum,
          maximum: draft.maximum,
        });
        setItems((current) => current.map((item) => item.id === editingId ? mapItem(updated) : item));
      } else {
        const created = await createInventoryItemApi({
          name: draft.name,
          sku: draft.sku,
          quantity: draft.stock,
          unit_price: draft.unitValue,
          category: draft.category,
          warehouse: draft.warehouse,
          minimum: draft.minimum,
          maximum: draft.maximum,
        });
        setItems((current) => [mapItem(created), ...current]);
      }
      setFormOpen(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حفظ الصنف");
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
      const updated = await restockInventoryItemApi(target.dbId);
      setItems((current) => current.map((item) => item.id === id ? mapItem(updated) : item));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر توريد الصنف");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="INVENTORY CONTROL" title="المخزون" description="إضافة الأصناف وتعديل الكميات والحدود وإدارة التوريد." icon={Warehouse} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة صنف</button>} />
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
            <div className="mt-4"><div className="mb-2 flex justify-between text-[7px] font-medium text-slate-400"><span>المتاح {item.stock}</span><span>الحد الأقصى {item.maximum}</span></div><div className="h-2 overflow-hidden rounded-full bg-lime-50"><div className={`h-full rounded-full ${low ? "bg-amber-400" : "bg-lime-500"}`} style={{ width: `${ratio}%` }} /></div></div>
            <div className="mt-4 grid grid-cols-2 gap-2"><span className="record-meta">الحد الأدنى {item.minimum}</span><span className="record-meta">{formatCurrency(item.unitValue)}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => restock(item.id)} className="record-action"><Plus size={13} /> توريد</button><button type="button" onClick={() => openEdit(item)} className="record-action"><SlidersHorizontal size={13} /> تعديل</button><button type="button" onClick={() => { if (window.confirm("حذف هذا الصنف؟")) deleteItem(item.id); }} className="record-action record-action-danger"><Trash2 size={13} /></button></div>
          </article>
        ); })}
      </section>
      </>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card"><div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-lime-700">المخزون</p><h3 className="mt-1 text-[15px] font-bold text-slate-900">{editingId ? "تعديل الصنف" : "إضافة صنف جديد"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><input className="workspace-input" placeholder="اسم الصنف" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/><input className="workspace-input" placeholder="SKU" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /><input className="workspace-input" placeholder="التصنيف" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /><input className="workspace-input" placeholder="المستودع" value={draft.warehouse} onChange={(e) => setDraft({ ...draft, warehouse: e.target.value })} /><input className="workspace-input" type="number" placeholder="الكمية" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} /><input className="workspace-input" type="number" placeholder="الحد الأدنى" value={draft.minimum} onChange={(e) => setDraft({ ...draft, minimum: Number(e.target.value) })} /><input className="workspace-input" type="number" placeholder="الحد الأقصى" value={draft.maximum} onChange={(e) => setDraft({ ...draft, maximum: Number(e.target.value) })} /><input className="workspace-input" type="number" placeholder="قيمة الوحدة" value={draft.unitValue} onChange={(e) => setDraft({ ...draft, unitValue: Number(e.target.value) })} /></div><button type="button" onClick={saveItem} className="workspace-primary-button mt-5 w-full">{editingId ? "حفظ التعديلات" : "إضافة الصنف"}</button></div></div>}
    </>
  );
}
'''


def main():
    original = FILE_PATH.read_text(encoding="utf-8")

    if IMPORT_ANCHOR not in original:
        print("ABORTED - import anchor found 0 time(s)")
        return
    if original.count(IMPORT_ANCHOR) != 1:
        print(f"ABORTED - import anchor found {original.count(IMPORT_ANCHOR)} time(s), expected 1")
        return
    if "@/services/inventory" in original:
        print("ABORTED - inventory import already present, skipping to avoid duplicate")
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

    new_lines = lines[:start_index] + NEW_BLOCK.split("\n")[:-1] + lines[end_index:]
    new_content = "\n".join(new_lines)

    import_anchor_index = new_content.index(IMPORT_ANCHOR) + len(IMPORT_ANCHOR)
    new_content = (
        new_content[:import_anchor_index]
        + "\n"
        + INVENTORY_IMPORT_BLOCK
        + new_content[import_anchor_index:]
    )

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = FILE_PATH.with_suffix(FILE_PATH.suffix + f".backup_{timestamp}")
    backup_path.write_text(original, encoding="utf-8")

    FILE_PATH.write_text(new_content, encoding="utf-8")
    print(f"Applied: Inventory module wired to backend (line-based). Backup: {backup_path.name}")


if __name__ == "__main__":
    main()
