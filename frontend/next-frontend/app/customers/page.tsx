import AppShell from "../../components/layout/AppShell";
import ModulePage from "../../components/modules/ModulePage";

export default function CustomersPage() {
  return (
    <AppShell>
      <ModulePage
        title="إدارة العملاء"
        subtitle="إدارة العملاء الأفراد والشركات"
        endpoint="/customers/"
        addButtonText="إضافة عميل"
      />
    </AppShell>
  );
}