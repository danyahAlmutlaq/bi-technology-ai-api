import sys

patches = []

def add(path, old, new, expected=1):
    patches.append((path, old, new, expected))


REC = "frontend/next-frontend/services/receiving.ts"
SHIP = "frontend/next-frontend/services/shipments.ts"
DASH = "frontend/next-frontend/app/dashboard/page.tsx"

# 1) receiving.ts: ReceivingRecord interface
add(
    REC,
    '  damage_notes: string | null;\n  status: ReceivingStatus;\n',
    '  damage_notes: string | null;\n  received_by: string | null;\n  status: ReceivingStatus;\n',
)

# 2) receiving.ts: RecordArrivalPayload
add(
    REC,
    '  storage_location?: string | null;\n  damage_notes?: string | null;\n}\n',
    '  storage_location?: string | null;\n  damage_notes?: string | null;\n  received_by?: string | null;\n}\n',
)

# 3) shipments.ts: Shipment type (nullable variant, unique)
add(
    SHIP,
    '  container_number?: string | null;\n  bill_of_lading_number?: string | null;\n',
    '  container_number?: string | null;\n  container_type?: string | null;\n  bill_of_lading_number?: string | null;\n',
)

# 4) shipments.ts: CreateShipmentPayload + UpdateShipmentPayload (appears twice)
add(
    SHIP,
    '  container_number?: string;\n  bill_of_lading_number?: string;\n',
    '  container_number?: string;\n  container_type?: string;\n  bill_of_lading_number?: string;\n',
    expected=2,
)

# 5) dashboard: ReceivingUIRecord interface
add(
    DASH,
    '  storageLocation: string;\n  damageNotes: string;\n',
    '  storageLocation: string;\n  damageNotes: string;\n  receivedBy: string;\n',
)

# 6) dashboard: emptyReceiveDraft
add(
    DASH,
    '  const emptyReceiveDraft = { actualQuantity: 0, storageLocation: "", damageNotes: "" };\n',
    '  const emptyReceiveDraft = { actualQuantity: 0, storageLocation: "", damageNotes: "", receivedBy: "" };\n',
)

# 7) dashboard: mapItem
add(
    DASH,
    '      storageLocation: item.storage_location ?? "",\n      damageNotes: item.damage_notes ?? "",\n',
    '      storageLocation: item.storage_location ?? "",\n      damageNotes: item.damage_notes ?? "",\n      receivedBy: item.received_by ?? "",\n',
)

# 8) dashboard: openReceiveForm
add(
    DASH,
    '  const openReceiveForm = (item: ReceivingUIRecord) => { setReceiveTargetId(item.id); setSaveError(null); setReceiveDraft({ actualQuantity: item.expectedQuantity, storageLocation: "", damageNotes: "" }); };\n',
    '  const openReceiveForm = (item: ReceivingUIRecord) => { setReceiveTargetId(item.id); setSaveError(null); setReceiveDraft({ actualQuantity: item.expectedQuantity, storageLocation: "", damageNotes: "", receivedBy: "" }); };\n',
)

# 9) dashboard: submitReceive payload
add(
    DASH,
    '        storage_location: receiveDraft.storageLocation || null,\n        damage_notes: receiveDraft.damageNotes || null,\n',
    '        storage_location: receiveDraft.storageLocation || null,\n        damage_notes: receiveDraft.damageNotes || null,\n        received_by: receiveDraft.receivedBy || null,\n',
)

# 10) dashboard: display JSX
add(
    DASH,
    '            {item.storageLocation && <p className="mt-2 text-[11.5px] font-medium text-slate-500">موقع التخزين: {item.storageLocation}</p>}\n            {item.damageNotes && <p className="mt-1 text-[10.5px] font-medium text-red-500">ملاحظات التلف: {item.damageNotes}</p>}\n',
    '            {item.storageLocation && <p className="mt-2 text-[11.5px] font-medium text-slate-500">موقع التخزين: {item.storageLocation}</p>}\n            {item.damageNotes && <p className="mt-1 text-[10.5px] font-medium text-red-500">ملاحظات التلف: {item.damageNotes}</p>}\n            {item.receivedBy && <p className="mt-1 text-[10.5px] font-medium text-slate-500">استلمه: {item.receivedBy}</p>}\n',
)

# 11) dashboard: input JSX
add(
    DASH,
    '          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">موقع التخزين</span><input className="workspace-input" placeholder="مثال: ممر A - رف 12" value={receiveDraft.storageLocation} onChange={(e) => setReceiveDraft({ ...receiveDraft, storageLocation: e.target.value })} /></label>\n          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات التلف (اختياري)</span><input className="workspace-input" placeholder="وصف أي ضرر أو نقص" value={receiveDraft.damageNotes} onChange={(e) => setReceiveDraft({ ...receiveDraft, damageNotes: e.target.value })} /></label>\n',
    '          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">موقع التخزين</span><input className="workspace-input" placeholder="مثال: ممر A - رف 12" value={receiveDraft.storageLocation} onChange={(e) => setReceiveDraft({ ...receiveDraft, storageLocation: e.target.value })} /></label>\n          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات التلف (اختياري)</span><input className="workspace-input" placeholder="وصف أي ضرر أو نقص" value={receiveDraft.damageNotes} onChange={(e) => setReceiveDraft({ ...receiveDraft, damageNotes: e.target.value })} /></label>\n          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">اسم الموظف المستلم</span><input className="workspace-input" placeholder="اسم من استلم البضاعة" value={receiveDraft.receivedBy} onChange={(e) => setReceiveDraft({ ...receiveDraft, receivedBy: e.target.value })} /></label>\n',
)

# 12) dashboard: ShipmentsWorkspace initial draft state (4-space indent, anchored to avoid matching inside 6-space line)
add(
    DASH,
    '\n    container_number: "",\n',
    '\n    container_number: "",\n    container_type: "",\n',
)

# 13) dashboard: resetDraft function (6-space indent)
add(
    DASH,
    '      container_number: "",\n',
    '      container_number: "",\n      container_type: "",\n',
)

# 14) dashboard: saveShipment payload (8-space indent)
add(
    DASH,
    '        container_number: draft.container_number.trim() || undefined,\n',
    '        container_number: draft.container_number.trim() || undefined,\n        container_type: draft.container_type.trim() || undefined,\n',
)

# 15) dashboard: international fields JSX - new container_type input
add(
    DASH,
    '                  <input\n'
    '                    className="workspace-input"\n'
    '                    placeholder="رقم الحاوية"\n'
    '                    value={draft.container_number}\n'
    '                    onChange={(e) => setDraft({ ...draft, container_number: e.target.value })}\n'
    '                  />\n'
    '                  <input\n'
    '                    className="workspace-input"\n'
    '                    placeholder="رقم البوليصة"\n',
    '                  <input\n'
    '                    className="workspace-input"\n'
    '                    placeholder="رقم الحاوية"\n'
    '                    value={draft.container_number}\n'
    '                    onChange={(e) => setDraft({ ...draft, container_number: e.target.value })}\n'
    '                  />\n'
    '                  <input\n'
    '                    className="workspace-input"\n'
    '                    placeholder="نوع الحاوية (مثال: 20 قدم)"\n'
    '                    value={draft.container_type}\n'
    '                    onChange={(e) => setDraft({ ...draft, container_type: e.target.value })}\n'
    '                  />\n'
    '                  <input\n'
    '                    className="workspace-input"\n'
    '                    placeholder="رقم البوليصة"\n',
)


def main():
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

    print("\nDONE p11 - تم تطبيق كل التعديلات بنجاح.")


if __name__ == "__main__":
    main()
