"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpLeft,
  CircleDollarSign,
  FileText,
  PackageCheck,
  Sparkles,
  Users,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "https://bi-technology-ai-api.onrender.com";

type DashboardData = {
  total_customers?: number;
  total_invoices?: number;
  total_payments?: number;
  active_shipments?: number;
};

export default function DashboardPage() {
  const { t } = useLanguage();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(`${API_URL}/dashboard/`);

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data = await response.json();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AppShell
      titleAr="مركز تشغيل الأعمال"
      titleEn="Business Workspace"
      subtitleAr="نظرة واضحة على أهم أعمالك وإجراءات اليوم."
      subtitleEn="A clear view of your most important work and daily actions."
    >
      <section className="workspace-hero">
        <div className="workspace-hero-content">
          <span className="workspace-badge">
            <Sparkles size={15} />
            {t("مركز تشغيل ذكي", "Intelligent workspace")}
          </span>

          <h2>{t("صباح الخير، دانية 👋", "Good morning, Danyah 👋")}</h2>

          <p>
            {t(
              "لديك اليوم بعض الإجراءات المهمة. رتّبي أولوياتك وتابعي أعمالك من مساحة واحدة.",
              "You have several important actions today. Organize your priorities and manage your work from one place."
            )}
          </p>

          <button className="main-green-button">
            {t("ابدئي يوم العمل", "Start your workday")}
            <ArrowUpLeft size={17} />
          </button>
        </div>

        <div className="health-ring">
          <div>
            <span>{t("حالة العمل", "Business health")}</span>
            <strong>{t("ممتازة", "Excellent")}</strong>
            <small>84%</small>
          </div>
        </div>
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span>{t("الأولوية الآن", "Current priority")}</span>
            <h2>{t("ما يحتاج انتباهك", "What needs your attention")}</h2>
          </div>
        </div>

        <div className="dashboard-cards">
          <article className="dashboard-card blue-card">
            <div className="dashboard-card-icon">
              <Users size={20} />
            </div>

            <span>{t("إجمالي العملاء", "Total customers")}</span>

            <strong>
              {loading ? "..." : dashboard?.total_customers ?? 0}
            </strong>

            <p>{t("عميل مسجل", "Registered customers")}</p>
          </article>

          <article className="dashboard-card purple-card">
            <div className="dashboard-card-icon">
              <FileText size={20} />
            </div>

            <span>{t("إجمالي الفواتير", "Total invoices")}</span>

            <strong>
              {loading ? "..." : dashboard?.total_invoices ?? 0}
            </strong>

            <p>{t("فاتورة مسجلة", "Registered invoices")}</p>
          </article>

          <article className="dashboard-card green-card">
            <div className="dashboard-card-icon">
              <CircleDollarSign size={20} />
            </div>

            <span>{t("إجمالي المدفوعات", "Total payments")}</span>

            <strong>
              {loading
                ? "..."
                : Number(dashboard?.total_payments ?? 0).toLocaleString()}
            </strong>

            <p>{t("ريال سعودي", "SAR collected")}</p>
          </article>

          <article className="dashboard-card orange-card">
            <div className="dashboard-card-icon">
              <PackageCheck size={20} />
            </div>

            <span>{t("الشحنات النشطة", "Active shipments")}</span>

            <strong>
              {loading ? "..." : dashboard?.active_shipments ?? 0}
            </strong>

            <p>{t("قيد التوصيل الآن", "Currently in delivery")}</p>
          </article>
        </div>
      </section>
    </AppShell>
  );
}