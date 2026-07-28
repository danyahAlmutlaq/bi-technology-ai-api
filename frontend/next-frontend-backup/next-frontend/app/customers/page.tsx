"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2, Users, X } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "https://bi-technology-ai-api.onrender.com";

type Customer = {
  id: number;
  name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export default function CustomersPage() {
  const { t } = useLanguage();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
  });

  async function loadCustomers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/customers/`);

      if (!response.ok) {
        throw new Error("Failed to load customers");
      }

      const data = await response.json();

      setCustomers(Array.isArray(data) ? data : data.items ?? []);
    } catch (err) {
      console.error(err);
      setError(
        t(
          "تعذر تحميل العملاء من الخادم.",
          "Could not load customers from the server."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function addCustomer(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/customers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      setForm({
        name: "",
        company_name: "",
        email: "",
        phone: "",
      });

      setShowForm(false);
      await loadCustomers();
    } catch (err) {
      console.error(err);
      setError(
        t(
          "لم تتم إضافة العميل. تحققي من البيانات المطلوبة.",
          "Customer was not added. Check the required fields."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCustomer(id: number) {
    const confirmed = window.confirm(
      t("هل تريدين حذف هذا العميل؟", "Delete this customer?")
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers((current) =>
        current.filter((customer) => customer.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert(t("تعذر حذف العميل.", "Could not delete customer."));
    }
  }

  return (
    <AppShell
      titleAr="إدارة العملاء"
      titleEn="Customer Management"
      subtitleAr="إضافة العملاء وعرض بياناتهم وحذفهم."
      subtitleEn="Add, view and delete your customers."
    >
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span>{t("إجمالي العملاء", "Total customers")}</span>
            <h2>{loading ? "..." : customers.length}</h2>
          </div>

          <button
            className="main-green-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            {t("إضافة عميل", "Add customer")}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p>{t("جاري تحميل العملاء...", "Loading customers...")}</p>
        ) : customers.length === 0 ? (
          <div className="dashboard-card">
            <Users size={32} />
            <h3>{t("لا يوجد عملاء بعد", "No customers yet")}</h3>
            <p>
              {t(
                "اضغطي على إضافة عميل لتجربة النظام.",
                "Click Add customer to test the system."
              )}
            </p>
          </div>
        ) : (
          <div className="dashboard-cards">
            {customers.map((customer) => (
              <article className="dashboard-card blue-card" key={customer.id}>
                <div className="dashboard-card-icon">
                  <Users size={20} />
                </div>

                <strong>
                  {customer.name ||
                    customer.company_name ||
                    t("عميل بدون اسم", "Unnamed customer")}
                </strong>

                <p>{customer.company_name || "-"}</p>
                <p>{customer.email || "-"}</p>
                <p>{customer.phone || "-"}</p>

                <button
                  type="button"
                  onClick={() => deleteCustomer(customer.id)}
                  style={{
                    marginTop: "14px",
                    border: "none",
                    background: "rgba(239, 68, 68, 0.14)",
                    color: "#ef4444",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Trash2 size={16} />
                  {t("حذف", "Delete")}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <form
            onSubmit={addCustomer}
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "white",
              color: "#111827",
              borderRadius: "20px",
              padding: "24px",
              display: "grid",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>{t("إضافة عميل جديد", "Add new customer")}</h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <input
              required
              placeholder={t("اسم العميل", "Customer name")}
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder={t("اسم الشركة", "Company name")}
              value={form.company_name}
              onChange={(event) =>
                setForm({ ...form, company_name: event.target.value })
              }
              style={inputStyle}
            />

            <input
              type="email"
              placeholder={t("البريد الإلكتروني", "Email address")}
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder={t("رقم الهاتف", "Phone number")}
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              style={inputStyle}
            />

            <button
              className="main-green-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? t("جاري الحفظ...", "Saving...")
                : t("حفظ العميل", "Save customer")}
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
};