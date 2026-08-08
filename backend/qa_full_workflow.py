#!/usr/bin/env python3
"""
اختبار شامل لدورة العمل الكاملة على مشروع إرتكاز (يعمل على الإنتاج مباشرة).
ينشئ بيانات اختبار خاصة به فقط، يتحقق من كل خطوة، ثم يحذف كل شيء في النهاية.
تشغيل: python3 qa_full_workflow.py
"""
import json
import urllib.request
import urllib.error
import sys

BASE = "https://bi-technology-ai-api.onrender.com"
ADMIN_EMAIL = "admin123@gmail.com"
ADMIN_PASSWORD = "Aa12341234"

results = []
token = None
created = {}


def call(method, path, body=None, auth=True, expect=None):
    url = BASE + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    if auth and token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            raw = resp.read()
    except urllib.error.HTTPError as e:
        status = e.code
        raw = e.read()
    try:
        parsed = json.loads(raw) if raw else None
    except Exception:
        parsed = raw.decode(errors="replace")
    return status, parsed


def check(label, condition, detail=""):
    mark = "PASS" if condition else "FAIL"
    results.append((mark, label, detail))
    print(f"[{mark}] {label}" + (f" -- {detail}" if detail and not condition else ""))
    return condition


print("=" * 60)
print("بدء اختبار الوورك فلو الكامل")
print("=" * 60)

# 1) Login
status, data = call("POST", "/auth/login", {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, auth=False)
ok = check("تسجيل الدخول كأدمن", status == 200 and isinstance(data, dict) and "token" in data, f"status={status} {data}")
if not ok:
    print("توقف: ما قدرنا نسجل دخول. تأكدي من صحة الإيميل وكلمة المرور.")
    sys.exit(1)
token = data["token"]

# 2) Create customer
status, cust = call("POST", "/customers/", {"name": "TEST_QA_عميل_اختبار", "customer_type": "individual", "phone": "0500000001"})
ok = check("إنشاء عميل اختبار", status in (200, 201) and isinstance(cust, dict) and "id" in cust, f"status={status} {cust}")
if not ok:
    sys.exit(1)
created["customer_id"] = cust["id"]

# 3) Create order
status, order = call("POST", "/orders/", {
    "customer_id": created["customer_id"],
    "title": "طلب اختبار QA",
    "amount": 500,
    "package_count": 2,
    "delivery_company_id": 1,
})
ok = check("إنشاء طلب", status in (200, 201) and isinstance(order, dict) and "id" in order, f"status={status} {order}")
if not ok:
    sys.exit(1)
created["order_id"] = order["id"]
order_number = order.get("order_number")

# 4) Verify picking auto-created
status, pickings = call("GET", "/picking/")
matching_picking = next((p for p in pickings if p.get("order_id") == created["order_id"]), None) if isinstance(pickings, list) else None
check("سجل تجهيز تلقائي عند إنشاء الطلب", matching_picking is not None, f"status={status}")
if matching_picking:
    created["picking_id"] = matching_picking["id"]

# 5) Toggle to shipment
status, order2 = call("PATCH", f"/orders/{created['order_id']}/toggle-shipment", {
    "origin": "الرياض", "destination": "جدة", "service_type": "local", "package_count": 2,
})
ok = check("تحويل الطلب لشحنة (حجز + شحنة تلقائي)", status == 200 and order2.get("shipment_ready") is True, f"status={status} {order2}")

# 6) Verify receiving auto-created with correct expected_quantity
status, receivings = call("GET", "/receiving/")
matching_receiving = None
if isinstance(receivings, list):
    candidates = sorted(receivings, key=lambda r: r.get("id", 0), reverse=True)
    matching_receiving = candidates[0] if candidates else None
check("سجل استلام تلقائي بعدد طرود صحيح (2)", matching_receiving is not None and matching_receiving.get("expected_quantity") == 2, f"status={status} {matching_receiving}")
if matching_receiving:
    created["receiving_id"] = matching_receiving["id"]

# 7) Receive the shipment
if "receiving_id" in created:
    status, recv = call("PATCH", f"/receiving/{created['receiving_id']}/receive", {"actual_quantity": 2})
    check("استلام الشحنة فعليًا (متوقع = فعلي بدون فرق)", status == 200 and recv.get("status") == "received", f"status={status} {recv}")

# 8) Pack the order (start -> pack)
if "picking_id" in created:
    status, _ = call("PATCH", f"/picking/{created['picking_id']}/start", None)
    check("بدء التجهيز", status == 200, f"status={status}")
    status, packed = call("PATCH", f"/picking/{created['picking_id']}/pack", {"packing_fee": 20})
    ok = check("تغليف الطلب وتوليد كود الصندوق", status == 200 and packed.get("status") == "packed" and packed.get("box_code"), f"status={status} {packed}")
    if ok:
        created["box_code"] = packed["box_code"]

# 9) Dispatch route
status, route = call("POST", "/dispatch/", {"driver_name": "سائق اختبار", "driver_phone": "0511111111", "vehicle_plate": "TEST-1"})
ok = check("إنشاء خط سير إرسال", status in (200, 201) and "id" in route, f"status={status} {route}")
if ok:
    created["route_id"] = route["id"]

if "route_id" in created and "picking_id" in created:
    status, route2 = call("POST", f"/dispatch/{created['route_id']}/items", {"picking_id": created["picking_id"]})
    ok = check("إضافة الطلب لخط السير", status == 200, f"status={status} {route2}")
    item_id = None
    if ok:
        items = route2.get("items", [])
        item = next((it for it in items if it.get("picking_id") == created["picking_id"]), None)
        item_id = item.get("id") if item else None
    if item_id and "box_code" in created:
        status, route3 = call("PATCH", f"/dispatch/{created['route_id']}/items/{item_id}/scan", {"box_code": created["box_code"]})
        check("مسح صندوق الطلب", status == 200, f"status={status} {route3}")
        status, route4 = call("PATCH", f"/dispatch/{created['route_id']}/close", None)
        check("إغلاق خط السير وإرساله", status == 200 and route4.get("status") == "dispatched", f"status={status} {route4}")

# 10) Verify picking status became dispatched + delivery record auto-created
status, pickings2 = call("GET", "/picking/")
p2 = next((p for p in pickings2 if p.get("id") == created.get("picking_id")), None) if isinstance(pickings2, list) else None
check("حالة التجهيز أصبحت (تم الإرسال)", p2 is not None and p2.get("status") == "dispatched", f"{p2}")

status, deliveries = call("GET", "/delivery/")
delivery = next((d for d in deliveries if d.get("picking_id") == created.get("picking_id")), None) if isinstance(deliveries, list) else None
ok = check("سجل تسليم أنشئ تلقائيًا بعد الإرسال", delivery is not None, f"status={status}")
if ok:
    created["delivery_id"] = delivery["id"]

# 11) Complete delivery
if "delivery_id" in created:
    status, deliv2 = call("PATCH", f"/delivery/{created['delivery_id']}/complete", {"recipient_name": "مستلم اختبار", "cash_collected": 0})
    check("إكمال التسليم", status == 200 and deliv2.get("status") == "delivered", f"status={status} {deliv2}")

# 12) Generate invoice from order and verify line item
status, order3 = call("PATCH", f"/orders/{created['order_id']}/toggle-invoice", None)
ok = check("تجهيز فاتورة للطلب", status == 200 and order3.get("invoice_id"), f"status={status} {order3}")
if ok:
    created["invoice_id"] = order3["invoice_id"]
    status, inv = call("GET", f"/invoices/{created['invoice_id']}")
    items = inv.get("items", []) if isinstance(inv, dict) else []
    has_order_item = any(it.get("source_type") == "order" and it.get("amount") == 500 for it in items)
    check("الفاتورة فيها بند الطلب بالقيمة الصحيحة (500)", has_order_item, f"items={items}")
    created["invoice_total"] = inv.get("total")

# 13) Record a payment and verify invoice becomes paid
if "invoice_id" in created and created.get("invoice_total"):
    status, pay = call("POST", "/payments/", {
        "customer_id": created["customer_id"],
        "invoice_id": created["invoice_id"],
        "amount": created["invoice_total"],
        "payment_method": "نقدي",
    })
    check("تسجيل دفعة كاملة", status in (200, 201), f"status={status} {pay}")
    status, portal_invoices = call("GET", f"/customer-portal/{created['customer_id']}/invoices")
    inv2 = next((i for i in portal_invoices if i.get("id") == created["invoice_id"]), None) if isinstance(portal_invoices, list) else None
    check("حالة الفاتورة أصبحت (مدفوعة) بعد الدفعة", inv2 is not None and inv2.get("status") == "paid", f"{inv2}")

# 14) Cleanup - delete the test customer (cascade should remove everything linked)
print("-" * 60)
print("تنظيف بيانات الاختبار...")
if "customer_id" in created:
    status, _ = call("DELETE", f"/customers/{created['customer_id']}")
    check("حذف عميل الاختبار وكل بياناته المرتبطة", status == 200, f"status={status}")

print("=" * 60)
passed = sum(1 for r in results if r[0] == "PASS")
failed = sum(1 for r in results if r[0] == "FAIL")
print(f"النتيجة النهائية: {passed} نجح / {failed} فشل من أصل {len(results)}")
if failed:
    print("\nالخطوات الفاشلة:")
    for mark, label, detail in results:
        if mark == "FAIL":
            print(f"  - {label}: {detail}")
print("=" * 60)
sys.exit(1 if failed else 0)
