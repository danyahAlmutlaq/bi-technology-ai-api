#!/usr/bin/env python3
"""
اختبار موسّع للحلقات الإضافية: الجمارك، المرتجعات، الكاش، المخزون، بوابة العملاء، تعديل/حذف الدفعات.
كل بلوك مستقل وينظف بياناته بنفسه بالنهاية.
تشغيل: python3 qa_extended.py
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


def call(method, path, body=None, auth=True):
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


def cleanup_customer(cid):
    if cid:
        call("DELETE", f"/customers/{cid}")


def login():
    global token
    status, data = call("POST", "/auth/login", {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, auth=False)
    ok = check("تسجيل الدخول كأدمن", status == 200 and "token" in (data or {}), f"status={status} {data}")
    if not ok:
        sys.exit(1)
    token = data["token"]


def block_customs():
    print("\n--- بلوك: الشحن الدولي والجمارك ---")
    cid = None
    try:
        status, cust = call("POST", "/customers/", {"name": "TEST_QA_customs", "customer_type": "individual", "phone": "0500000010"})
        if not check("إنشاء عميل (جمارك)", status in (200, 201), f"{status} {cust}"):
            return
        cid = cust["id"]

        status, order = call("POST", "/orders/", {
            "customer_id": cid, "title": "طلب دولي اختبار", "amount": 1000,
            "package_count": 3, "delivery_company_id": 1, "service_type": "international",
        })
        if not check("إنشاء طلب دولي", status in (200, 201), f"{status} {order}"):
            return
        oid = order["id"]

        status, order2 = call("PATCH", f"/orders/{oid}/toggle-shipment", {
            "origin": "الرياض", "destination": "دبي", "service_type": "international", "package_count": 3,
        })
        check("تحويل الطلب الدولي لشحنة", status == 200 and order2.get("shipment_ready") is True, f"{status} {order2}")

        status, shipments = call("GET", "/shipments/")
        shipment = next((s for s in shipments if s.get("customer_id") == cid), None) if isinstance(shipments, list) else None
        ok = check("إنشاء سجل شحنة مرتبط بالعميل", shipment is not None, f"status={status}")
        if not ok:
            return
        sid = shipment["id"]

        status, receivings = call("GET", "/receiving/")
        matching = next((r for r in receivings if r.get("shipment_id") == sid), None) if isinstance(receivings, list) else None
        check("استلام تلقائي بعدد طرود صحيح للشحنة الدولية (3)", matching is not None and matching.get("expected_quantity") == 3, f"{matching}")

        status, customs = call("POST", "/customs/", {
            "shipment_id": sid, "duty_amount": 50, "vat_amount": 20, "port_charges": 10,
        })
        check("إنشاء سجل تخليص جمركي", status in (200, 201) and customs.get("shipment_id") == sid, f"{status} {customs}")
    finally:
        cleanup_customer(cid)


def block_returns_cod():
    print("\n--- بلوك: فشل التسليم والمرتجعات + الكاش ---")
    cid = None
    try:
        status, cust = call("POST", "/customers/", {"name": "TEST_QA_returns", "customer_type": "individual", "phone": "0500000011"})
        if not check("إنشاء عميل (مرتجعات)", status in (200, 201), f"{status} {cust}"):
            return
        cid = cust["id"]

        status, order = call("POST", "/orders/", {"customer_id": cid, "title": "طلب مرتجع اختبار", "amount": 200, "package_count": 1, "delivery_company_id": 1})
        oid = order["id"]
        status, pickings = call("GET", "/picking/")
        picking = next((p for p in pickings if p.get("order_id") == oid), None)
        pid = picking["id"] if picking else None
        check("إنشاء طلب + تجهيز تلقائي (مرتجعات)", pid is not None, f"{status}")
        if not pid:
            return

        call("PATCH", f"/orders/{oid}/toggle-shipment", {"origin": "الرياض", "destination": "جدة", "service_type": "local", "package_count": 1})
        call("PATCH", f"/picking/{pid}/start", None)
        status, packed = call("PATCH", f"/picking/{pid}/pack", {"packing_fee": 10})
        box_code = packed.get("box_code")
        check("تغليف طلب المرتجع", status == 200 and box_code, f"{status} {packed}")

        status, route = call("POST", "/dispatch/", {"driver_name": "سائق اختبار مرتجع"})
        route_id = route.get("id")
        status, route2 = call("POST", f"/dispatch/{route_id}/items", {"picking_id": pid})
        item = next((it for it in route2.get("items", []) if it.get("picking_id") == pid), None) if isinstance(route2, dict) else None
        if not check("إضافة الطلب لخط سير (مرتجعات)", item is not None, f"{status} {route2}"):
            return
        item_id = item["id"]

        call("PATCH", f"/dispatch/{route_id}/items/{item_id}/scan", {"box_code": box_code})
        status, route3 = call("PATCH", f"/dispatch/{route_id}/close", None)
        check("إغلاق خط السير (مرتجعات)", status == 200, f"{status} {route3}")

        status, deliveries = call("GET", "/delivery/")
        delivery = next((d for d in deliveries if d.get("picking_id") == pid), None) if isinstance(deliveries, list) else None
        ok = check("سجل تسليم تلقائي (مرتجعات)", delivery is not None, f"status={status}")
        if not ok:
            return
        did = delivery["id"]

        status, fail = call("PATCH", f"/delivery/{did}/fail", {"failure_reason": "العميل غير متواجد"})
        check("تسجيل فشل التسليم", status == 200 and fail.get("status") == "failed", f"{status} {fail}")

        status, returns = call("GET", "/returns/")
        ret = next((r for r in returns if r.get("delivery_id") == did), None) if isinstance(returns, list) else None
        check("إنشاء سجل مرتجع تلقائي بعد فشل التسليم", ret is not None, f"status={status}")
        if ret:
            status, resolved = call("PATCH", f"/returns/{ret['id']}/resolve", {"condition": "سليم", "outcome": "إعادة للمخزون"})
            check("حل حالة المرتجع", status == 200, f"{status} {resolved}")

        status, settlement = call("POST", "/cash/settlements", {"driver_name": "سائق اختبار COD"})
        ok = check("إنشاء تسوية كاش", status in (200, 201) and "id" in (settlement or {}), f"{status} {settlement}")
        if ok:
            status, confirmed = call("PATCH", f"/cash/settlements/{settlement['id']}/confirm", None)
            check("تأكيد تسوية الكاش", status == 200, f"{status} {confirmed}")
    finally:
        cleanup_customer(cid)


def block_inventory():
    print("\n--- بلوك: خصم المخزون التلقائي ---")
    cid = None
    try:
        status, cust = call("POST", "/customers/", {"name": "TEST_QA_inventory", "customer_type": "individual", "phone": "0500000012"})
        if not check("إنشاء عميل (مخزون)", status in (200, 201), f"{status} {cust}"):
            return
        cid = cust["id"]

        status, item = call("POST", "/inventory/", {"name": "صنف اختبار QA", "quantity": 10, "unit_price": 5, "customer_id": cid})
        if not check("إنشاء صنف مخزون (كمية 10)", status in (200, 201), f"{status} {item}"):
            return
        item_id = item["id"]

        status, order = call("POST", "/orders/", {
            "customer_id": cid, "title": "طلب يخصم من المخزون", "amount": 100,
            "inventory_item_id": item_id, "quantity": 3,
        })
        check("إنشاء طلب مرتبط بصنف مخزون", status in (200, 201), f"{status} {order}")

        status, inv_list = call("GET", "/inventory/")
        updated = next((i for i in inv_list if i.get("id") == item_id), None) if isinstance(inv_list, list) else None
        check("خصم الكمية تلقائيًا (10 - 3 = 7)", updated is not None and updated.get("quantity") == 7, f"{updated}")
    finally:
        cleanup_customer(cid)


def block_portal():
    print("\n--- بلوك: بوابة العملاء ---")
    cid = None
    try:
        status, cust = call("POST", "/customers/", {"name": "TEST_QA_portal", "customer_type": "individual", "phone": "0500000013", "email": "test_qa_portal@example.com"})
        if not check("إنشاء عميل (بوابة)", status in (200, 201), f"{status} {cust}"):
            return
        cid = cust["id"]

        status, account = call("POST", "/customer-portal/accounts", {"customer_id": cid, "email": "test_qa_portal@example.com", "password": "Test1234!"})
        check("إنشاء حساب بوابة عملاء", status in (200, 201), f"{status} {account}")

        status, login_resp = call("POST", "/customer-portal/login", {"email": "test_qa_portal@example.com", "password": "Test1234!"}, auth=False)
        check("تسجيل دخول العميل بحسابه", status == 200 and login_resp.get("customer_id") == cid, f"{status} {login_resp}")

        status, orders = call("GET", f"/customer-portal/{cid}/orders")
        check("عرض طلبات العميل بالبوابة", status == 200, f"{status}")
        status, invoices = call("GET", f"/customer-portal/{cid}/invoices")
        check("عرض فواتير العميل بالبوابة", status == 200, f"{status}")
    finally:
        cleanup_customer(cid)


def block_payment_edit():
    print("\n--- بلوك: تعديل وحذف الدفعات ---")
    cid = None
    try:
        status, cust = call("POST", "/customers/", {"name": "TEST_QA_payment", "customer_type": "individual", "phone": "0500000014"})
        if not check("إنشاء عميل (دفعات)", status in (200, 201), f"{status} {cust}"):
            return
        cid = cust["id"]

        status, order = call("POST", "/orders/", {"customer_id": cid, "title": "طلب دفعات اختبار", "amount": 100})
        oid = order["id"]
        status, order2 = call("PATCH", f"/orders/{oid}/toggle-invoice", None)
        invoice_id = order2.get("invoice_id")
        if not check("تجهيز فاتورة (دفعات)", invoice_id is not None, f"{status} {order2}"):
            return

        status, pay = call("POST", "/payments/", {"customer_id": cid, "invoice_id": invoice_id, "amount": 50, "payment_method": "نقدي"})
        if not check("تسجيل دفعة جزئية (50)", status in (200, 201), f"{status} {pay}"):
            return
        payment_id = pay["id"]

        status, updated = call("PUT", f"/payments/{payment_id}", {"amount": 60, "payment_method": "نقدي"})
        check("تعديل مبلغ الدفعة إلى 60", status == 200 and updated.get("amount") == 60, f"{status} {updated}")

        status, portal_invoices = call("GET", f"/customer-portal/{cid}/invoices")
        inv = next((i for i in portal_invoices if i.get("id") == invoice_id), None) if isinstance(portal_invoices, list) else None
        check("الفاتورة تعكس المبلغ المعدّل (60)", inv is not None and inv.get("paid_amount") == 60, f"{inv}")

        status, _ = call("DELETE", f"/payments/{payment_id}")
        check("حذف الدفعة", status == 200, f"{status}")

        status, portal_invoices2 = call("GET", f"/customer-portal/{cid}/invoices")
        inv2 = next((i for i in portal_invoices2 if i.get("id") == invoice_id), None) if isinstance(portal_invoices2, list) else None
        check("الفاتورة رجعت غير مدفوعة بعد حذف الدفعة", inv2 is not None and inv2.get("paid_amount") == 0, f"{inv2}")
    finally:
        cleanup_customer(cid)


print("=" * 60)
print("بدء الاختبار الموسّع")
print("=" * 60)

login()
block_customs()
block_returns_cod()
block_inventory()
block_portal()
block_payment_edit()

print("\n" + "=" * 60)
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
