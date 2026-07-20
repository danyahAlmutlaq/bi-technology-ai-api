import AppShell from "../../components/layout/AppShell";
import ModulePage from "../../components/modules/ModulePage";

export default function InvoicesPage() {
  return (
    <AppShell
      titleAr="الفواتير"
      titleEn="Invoices"
      subtitleAr="إدارة فواتير العملاء"
      subtitleEn="Invoice Management"
    >
      <ModulePage
        title="إدارة الفواتير"
        subtitle="إنشاء الفواتير ومتابعة حالات الدفع"
        endpoint="/invoices/"
        addButtonText="إنشاء فاتورة"
      />
    </AppShell>
  );
}