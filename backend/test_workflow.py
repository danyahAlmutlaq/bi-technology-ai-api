import getpass
import sys
import requests

BASE = "http://localhost:8000"
PASS = "\033[92m✅\033[0m"
FAIL = "\033[91m❌\033[0m"
results = []


def check(label, condition, extra=""):
    ok = bool(condition)
    results.append((label, ok))
    mark = PASS if ok else FAIL
    print(f"{mark}  {label}" + (f"  — {extra}" if extra else ""))
    return ok


def main():
    print("== اختبار الوركفلو الكامل ==\n")
    email = input("إيميل حساب مدير النظام: ").strip()
    password = getpass.getpass("كلمة المرور (لن تظهر): ")

    r = requests.post(f"{BASE}/auth/login", json={"email": email, "password": password})
    if not check("تسجيل الدخول كمدير نظام", r.status_code == 200, f"HTTP {r.status_code}"):
        print("توقف الاختبار — تأكدي من صحة بيانات الدخول.")
        sys.exit(1)
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    customers = requests.get(f"{BASE}/customers", headers=headers).json()
    companies = requests.get(f"{BASE}/delivery-companies", headers=headers).json()
    if not check("وجود عميل وشركة توصيل بالنظام", customers and companies):
        sys.exit(1)
    customer_id = customers[0]["id"]
    company_id = companies[0]["id"]
    print(f"   (تجربة على العميل #{customer_id})\n")

    order_payload = {
        "customer_id": customer_id,
        "title": "اختبار وركفلو تلقائي",
        "amount": 1000,
        "priority": "normal",
        "service_type": "international",
        "origin": "الرياض",
        "destination": "دبي",
        "package_count": 2,
        "delivery_company_id": company_id,
    }
    r = requests.post(f"{BASE}/orders", headers=headers, json=order_payload)
    if not check("إنشاء طلب جديد", r.status_code == 200, f"HTTP {r.status_code}: {r.text[:150]}"):
        sys.exit(1)
    order = r.json()
    order_id = order["id"]
    check("رقم الطلب تولد تلقائيًا", bool(order.get("order_number")), order.get("order_number"))

    r = requests.patch(f"{BASE}/orders/{order_id}/toggle-invoice", headers=headers)
    order = r.json()
    check("إنشاء الفاتورة تلقائيًا", order.get("invoice_ready") is True and order.get("invoice_id"))
    check("حساب إجمالي الفاتورة (المبلغ + 15% ضريبة)", abs(order.get("total_invoiced", 0) - 1150) < 0.01, order.get("total_invoiced"))
    check("الحالة المالية = غير مدفوع قبل أي دفعة", order.get("financial_status") == "unpaid")
    invoice_id = order["invoice_id"]

    payment_payload = {"customer_id": customer_id, "invoice_id": invoice_id, "amount": 500, "payment_method": "حوالة"}
    requests.post(f"{BASE}/payments", headers=headers, json=payment_payload)
    r = requests.get(f"{BASE}/orders/{order_id}", headers=headers)
    order = r.json()
    check("الحالة المالية = مدفوع جزئيًا بعد دفعة 500", order.get("financial_status") == "partial", order.get("balance"))

    r = requests.patch(f"{BASE}/orders/{order_id}/toggle-shipment", headers=headers)
    if not check("إنشاء الحجز والشحنة تلقائيًا من الطلب", r.status_code == 200, f"HTTP {r.status_code}: {r.text[:150]}"):
        sys.exit(1)

    shipments = requests.get(f"{BASE}/shipments", headers=headers).json()
    shipment = next((s for s in shipments if s.get("order_id") == order_id), None)
    if not check("العثور على الشحنة المرتبطة بالطلب", shipment is not None):
        sys.exit(1)
    shipment_id = shipment["id"]
    check("الشحنة مرتبطة بنفس الحالة المالية للطلب", shipment.get("financial_status") == "partial")

    customs_list = requests.get(f"{BASE}/customs", headers=headers).json()
    customs = next((c for c in customs_list if c.get("shipment_id") == shipment_id), None)
    check("سجل الجمارك أُنشئ تلقائيًا عند تحويل الطلب لشحنة", customs is not None)

    requests.put(f"{BASE}/shipments/{shipment_id}", headers=headers, json={"status": "in_transit"})
    requests.put(f"{BASE}/shipments/{shipment_id}", headers=headers, json={"status": "customs_cleared"})

    customs_list = requests.get(f"{BASE}/customs", headers=headers).json()
    customs = next((c for c in customs_list if c.get("shipment_id") == shipment_id), None)
    check("الجمارك تتحول لـ(released) تلقائيًا عند تحديث الشحنة لتم التخليص", customs and customs.get("status") == "released")

    receiving_list = requests.get(f"{BASE}/receiving", headers=headers).json()
    receiving = next((rec for rec in receiving_list if rec.get("shipment_id") == shipment_id), None)
    check("سجل الاستلام أُنشئ تلقائيًا بعد التخليص الجمركي", receiving is not None, f"الكمية المتوقعة: {receiving.get('expected_quantity') if receiving else '-'}")

    payment_payload2 = {"customer_id": customer_id, "invoice_id": invoice_id, "amount": 650, "payment_method": "بطاقة"}
    requests.post(f"{BASE}/payments", headers=headers, json=payment_payload2)
    r = requests.get(f"{BASE}/orders/{order_id}", headers=headers)
    order = r.json()
    check("الحالة المالية = مدفوع بالكامل بعد سداد الباقي", order.get("financial_status") == "paid" and order.get("balance", 1) == 0)

    print("\n== النتيجة ==")
    total = len(results)
    passed = sum(1 for _, ok in results if ok)
    print(f"{passed}/{total} خطوة نجحت")
    if passed == total:
        print(f"{PASS} الوركفلو يشتغل بشكل صحيح وتلقائي من طرف لطرف")
    else:
        print(f"{FAIL} فيه خطوة أو أكثر فشلت — راجعي التفاصيل أعلاه")
    print(f"\nملاحظة: طلب الاختبار رقم {order.get('order_number')} تم إنشاؤه فعليًا بقاعدة البيانات — احذفيه لاحقًا من قسم الطلبات إذا ما تبينه بالتقرير.")


if __name__ == "__main__":
    main()
