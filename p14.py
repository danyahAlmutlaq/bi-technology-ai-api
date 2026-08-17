import sys
import os

patches = []

def add(path, old, new, expected=1):
    patches.append((path, old, new, expected))


INV_ROUTER = "backend/app/routers/inventory.py"
RECEIVING = "backend/app/routers/receiving.py"
ORDERS = "backend/app/routers/orders.py"
INV_TS = "frontend/next-frontend/services/inventory.ts"
DASH = "frontend/next-frontend/app/dashboard/page.tsx"

NEW_MODEL_PATH = "backend/app/models/inventory_movement.py"
NEW_MODEL_CONTENT = '''from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)
    movement_type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    reference = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
'''

# 1) inventory.py: import InventoryMovement
add(
    INV_ROUTER,
    'from app.models.inventory import Inventory\nfrom app.models.customer import Customer\n',
    'from app.models.inventory import Inventory\nfrom app.models.customer import Customer\nfrom app.models.inventory_movement import InventoryMovement\n',
)

# 2) inventory.py: add movements endpoint at end of file
add(
    INV_ROUTER,
    '    db.delete(inventory)\n    db.commit()\n    return {"message": "Inventory deleted successfully"}\n',
    '    db.delete(inventory)\n    db.commit()\n    return {"message": "Inventory deleted successfully"}\n'
    '\n\n@router.get("/{inventory_id}/movements")\n'
    'def get_inventory_movements(inventory_id: int, db: Session = Depends(get_db)):\n'
    '    movements = (\n'
    '        db.query(InventoryMovement)\n'
    '        .filter(InventoryMovement.inventory_id == inventory_id)\n'
    '        .order_by(InventoryMovement.created_at.asc())\n'
    '        .all()\n'
    '    )\n'
    '    return [\n'
    '        {\n'
    '            "id": m.id,\n'
    '            "inventory_id": m.inventory_id,\n'
    '            "movement_type": m.movement_type,\n'
    '            "quantity": m.quantity,\n'
    '            "balance_after": m.balance_after,\n'
    '            "reference": m.reference,\n'
    '            "created_at": m.created_at.isoformat() if m.created_at else None,\n'
    '        }\n'
    '        for m in movements\n'
    '    ]\n',
)

# 3) receiving.py: import InventoryMovement
add(
    RECEIVING,
    'from app.models.booking import Booking\n',
    'from app.models.booking import Booking\nfrom app.models.inventory_movement import InventoryMovement\n',
)

# 4) receiving.py: log inbound movement when inventory item is created
add(
    RECEIVING,
    '                inventory_item = Inventory(\n'
    '                    name=item_label,\n'
    '                    sku=generate_inventory_sku_for_receiving(),\n'
    '                    quantity=data.actual_quantity,\n'
    '                    unit_price=0,\n'
    '                    customer_id=shipment.customer_id,\n'
    '                    location=data.storage_location,\n'
    '                    shipment_id=shipment.id,\n'
    '                    batch_number=("حجز " + related_booking.booking_number) if related_booking else None,\n'
    '                )\n'
    '                db.add(inventory_item)\n'
    '            if shipment.order_id:\n',
    '                inventory_item = Inventory(\n'
    '                    name=item_label,\n'
    '                    sku=generate_inventory_sku_for_receiving(),\n'
    '                    quantity=data.actual_quantity,\n'
    '                    unit_price=0,\n'
    '                    customer_id=shipment.customer_id,\n'
    '                    location=data.storage_location,\n'
    '                    shipment_id=shipment.id,\n'
    '                    batch_number=("حجز " + related_booking.booking_number) if related_booking else None,\n'
    '                )\n'
    '                db.add(inventory_item)\n'
    '                db.flush()\n'
    '                db.add(InventoryMovement(\n'
    '                    inventory_id=inventory_item.id,\n'
    '                    movement_type="in",\n'
    '                    quantity=data.actual_quantity,\n'
    '                    balance_after=inventory_item.quantity,\n'
    '                    reference=("حجز " + related_booking.booking_number) if related_booking else (shipment.tracking_number or ("شحنة " + str(shipment.id))),\n'
    '                ))\n'
    '            if shipment.order_id:\n',
)

# 5) orders.py: import InventoryMovement
add(
    ORDERS,
    'from app.models.inventory import Inventory\n',
    'from app.models.inventory import Inventory\nfrom app.models.inventory_movement import InventoryMovement\n',
)

# 6) orders.py: log outbound movement when inventory is deducted
add(
    ORDERS,
    '        inventory_item.quantity -= requested_qty\n    order = Order(\n',
    '        inventory_item.quantity -= requested_qty\n'
    '        db.add(InventoryMovement(\n'
    '            inventory_id=inventory_item.id,\n'
    '            movement_type="out",\n'
    '            quantity=requested_qty,\n'
    '            balance_after=inventory_item.quantity,\n'
    '            reference=order_data.title or "طلب جديد",\n'
    '        ))\n'
    '    order = Order(\n',
)

# 7) services/inventory.ts: add type + fetch function
add(
    INV_TS,
    'export async function deleteInventoryItem(itemId: number): Promise<void> {\n'
    '  const response = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {\n'
    '    method: "DELETE",\n'
    '  });\n'
    '  if (!response.ok) {\n'
    '    const text = await response.text().catch(() => "");\n'
    '    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);\n'
    '  }\n'
    '}\n',
    'export async function deleteInventoryItem(itemId: number): Promise<void> {\n'
    '  const response = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {\n'
    '    method: "DELETE",\n'
    '  });\n'
    '  if (!response.ok) {\n'
    '    const text = await response.text().catch(() => "");\n'
    '    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);\n'
    '  }\n'
    '}\n'
    '\n'
    'export interface InventoryMovement {\n'
    '  id: number;\n'
    '  inventory_id: number;\n'
    '  movement_type: string;\n'
    '  quantity: number;\n'
    '  balance_after: number;\n'
    '  reference: string | null;\n'
    '  created_at: string;\n'
    '}\n'
    '\n'
    'export async function getInventoryMovements(itemId: number): Promise<InventoryMovement[]> {\n'
    '  const response = await fetch(`${API_BASE_URL}/inventory/${itemId}/movements`, { cache: "no-store" });\n'
    '  return handleResponse<InventoryMovement[]>(response);\n'
    '}\n',
)

# 8) dashboard: import block
add(
    DASH,
    'import {\n'
    '  getInventory as getInventoryApi,\n'
    '  getCustomers as getInventoryCustomersApi,\n'
    '  createInventoryItem as createInventoryItemApi,\n'
    '  updateInventoryItem as updateInventoryItemApi,\n'
    '  restockInventoryItem as restockInventoryItemApi,\n'
    '  deleteInventoryItem as deleteInventoryItemApi,\n'
    '  type InventoryItem as ApiInventoryItem,\n'
    '  type CustomerOption as InventoryCustomerOption,\n'
    '} from "@/services/inventory";\n',
    'import {\n'
    '  getInventory as getInventoryApi,\n'
    '  getCustomers as getInventoryCustomersApi,\n'
    '  createInventoryItem as createInventoryItemApi,\n'
    '  updateInventoryItem as updateInventoryItemApi,\n'
    '  restockInventoryItem as restockInventoryItemApi,\n'
    '  deleteInventoryItem as deleteInventoryItemApi,\n'
    '  getInventoryMovements as getInventoryMovementsApi,\n'
    '  type InventoryItem as ApiInventoryItem,\n'
    '  type CustomerOption as InventoryCustomerOption,\n'
    '  type InventoryMovement as ApiInventoryMovement,\n'
    '} from "@/services/inventory";\n',
)

# 9) state additions inside InventoryWorkspace
add(
    DASH,
    '  const [isSavingItem, setIsSavingItem] = useState(false);\n'
    '  const [saveError, setSaveError] = useState<string | null>(null);\n'
    '  const emptyDraft = { name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", location: "", batchNumber: "", customerId: 0, customerName: "", unitValue: 0, movement: 0 };\n',
    '  const [isSavingItem, setIsSavingItem] = useState(false);\n'
    '  const [saveError, setSaveError] = useState<string | null>(null);\n'
    '  const [movementsItemId, setMovementsItemId] = useState<number | null>(null);\n'
    '  const [movements, setMovements] = useState<ApiInventoryMovement[]>([]);\n'
    '  const [movementsLoading, setMovementsLoading] = useState(false);\n'
    '  const emptyDraft = { name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", location: "", batchNumber: "", customerId: 0, customerName: "", unitValue: 0, movement: 0 };\n',
)

# 10) viewMovements function, inserted right after restock()
add(
    DASH,
    '    } catch (error) {\n'
    '      window.alert(error instanceof Error ? error.message : "تعذر توريد الصنف");\n'
    '    }\n'
    '  };\n'
    '  return (\n'
    '    <>\n',
    '    } catch (error) {\n'
    '      window.alert(error instanceof Error ? error.message : "تعذر توريد الصنف");\n'
    '    }\n'
    '  };\n'
    '  const viewMovements = async (dbId: number) => {\n'
    '    setMovementsItemId(dbId);\n'
    '    setMovementsLoading(true);\n'
    '    try {\n'
    '      const data = await getInventoryMovementsApi(dbId);\n'
    '      setMovements(data);\n'
    '    } catch (error) {\n'
    '      window.alert(error instanceof Error ? error.message : "تعذر تحميل سجل الحركة");\n'
    '    } finally {\n'
    '      setMovementsLoading(false);\n'
    '    }\n'
    '  };\n'
    '  return (\n'
    '    <>\n',
)

# 11) row action button
add(
    DASH,
    '                      <div className="flex items-center gap-1">\n'
    '                        <button type="button" onClick={() => restock(item.id)} className="rounded-lg p-1.5 text-teal-600 transition hover:bg-teal-50" title="توريد"><Plus size={13} /></button>\n'
    '                        <button type="button" onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100" title="تعديل"><SlidersHorizontal size={13} /></button>\n'
    '                        <button type="button" onClick={() => { if (window.confirm("حذف هذا الصنف؟")) deleteItem(item.id); }} className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50" title="حذف"><Trash2 size={13} /></button>\n'
    '                      </div>\n',
    '                      <div className="flex items-center gap-1">\n'
    '                        <button type="button" onClick={() => restock(item.id)} className="rounded-lg p-1.5 text-teal-600 transition hover:bg-teal-50" title="توريد"><Plus size={13} /></button>\n'
    '                        <button type="button" onClick={() => viewMovements(item.dbId)} className="rounded-lg px-1.5 py-1 text-[10px] font-bold text-slate-500 transition hover:bg-slate-100" title="سجل الحركة">سجل</button>\n'
    '                        <button type="button" onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100" title="تعديل"><SlidersHorizontal size={13} /></button>\n'
    '                        <button type="button" onClick={() => { if (window.confirm("حذف هذا الصنف؟")) deleteItem(item.id); }} className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50" title="حذف"><Trash2 size={13} /></button>\n'
    '                      </div>\n',
)

# 12) movements modal, inserted before the closing of InventoryWorkspace
add(
    DASH,
    '        <button type="button" disabled={isSavingItem} onClick={saveItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الصنف"}</button>\n'
    '      </div></div>}\n'
    '    </>\n'
    '  );\n'
    '}\n'
    'type ReportsData = {\n',
    '        <button type="button" disabled={isSavingItem} onClick={saveItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الصنف"}</button>\n'
    '      </div></div>}\n'
    '      {movementsItemId !== null && (\n'
    '        <div className="workspace-modal">\n'
    '          <div className="workspace-modal-card">\n'
    '            <div className="flex items-center justify-between">\n'
    '              <div>\n'
    '                <p className="text-[11.5px] font-medium text-lime-700">المخزون</p>\n'
    '                <h3 className="mt-1 text-[18.5px] font-bold text-slate-900">سجل حركة الصنف</h3>\n'
    '              </div>\n'
    '              <button type="button" onClick={() => setMovementsItemId(null)} className="modal-close"><X size={16} /></button>\n'
    '            </div>\n'
    '            <div className="mt-5">\n'
    '              {movementsLoading && <p className="text-[12.5px] font-medium text-slate-400">جاري التحميل...</p>}\n'
    '              {!movementsLoading && movements.length === 0 && <p className="text-[12.5px] font-medium text-slate-400">لا توجد حركات مسجلة لهذا الصنف بعد.</p>}\n'
    '              {!movementsLoading && movements.length > 0 && (\n'
    '                <table className="w-full border-collapse text-right text-[11.5px]">\n'
    '                  <thead>\n'
    '                    <tr className="border-b border-slate-100">\n'
    '                      <th className="p-2 font-bold text-slate-500">التاريخ</th>\n'
    '                      <th className="p-2 font-bold text-slate-500">النوع</th>\n'
    '                      <th className="p-2 font-bold text-slate-500">الكمية</th>\n'
    '                      <th className="p-2 font-bold text-slate-500">الرصيد بعدها</th>\n'
    '                      <th className="p-2 font-bold text-slate-500">المرجع</th>\n'
    '                    </tr>\n'
    '                  </thead>\n'
    '                  <tbody>\n'
    '                    {movements.map((m) => (\n'
    '                      <tr key={m.id} className="border-b border-slate-50">\n'
    '                        <td className="p-2 text-slate-600">{new Date(m.created_at).toLocaleString("ar-SA")}</td>\n'
    '                        <td className={"p-2 font-bold " + (m.movement_type === "in" ? "text-emerald-600" : "text-rose-600")}>{m.movement_type === "in" ? "دخول" : "خروج"}</td>\n'
    '                        <td className="p-2 text-slate-700">{m.quantity}</td>\n'
    '                        <td className="p-2 text-slate-700">{m.balance_after}</td>\n'
    '                        <td className="p-2 text-slate-500">{m.reference || "-"}</td>\n'
    '                      </tr>\n'
    '                    ))}\n'
    '                  </tbody>\n'
    '                </table>\n'
    '              )}\n'
    '            </div>\n'
    '          </div>\n'
    '        </div>\n'
    '      )}\n'
    '    </>\n'
    '  );\n'
    '}\n'
    'type ReportsData = {\n',
)


def main():
    if not os.path.exists(NEW_MODEL_PATH):
        with open(NEW_MODEL_PATH, "w", encoding="utf-8") as f:
            f.write(NEW_MODEL_CONTENT)
        print(f"[CREATED] {NEW_MODEL_PATH}")
    else:
        print(f"[SKIPPED] {NEW_MODEL_PATH} already exists")

    contents = {}
    for path, old, new, expected in patches:
        if path not in contents:
            with open(path, "r", encoding="utf-8") as f:
                contents[path] = f.read()
        count = contents[path].count(old)
        status = "OK" if count == expected else "MISMATCH"
        print(f"[{status}] {path}  (found={count}, expected={expected})")
        if count != expected:
            print("  -- توقفت بدون أي تعديل. ابعتيلي هذا الناتج كامل.")
            sys.exit(1)

    for path, old, new, expected in patches:
        contents[path] = contents[path].replace(old, new)

    for path, text in contents.items():
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)

    print("\nDONE p14 - تم تطبيق كل التعديلات (12 باتش) بنجاح.")


if __name__ == "__main__":
    main()
