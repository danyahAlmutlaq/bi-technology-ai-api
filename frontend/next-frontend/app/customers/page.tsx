"use client";

import { useState } from "react";

import AppShell from "../../components/layout/AppShell";
import ModulePage from "../../components/modules/ModulePage";
import AddCustomerModal from "../../components/customers/AddCustomerModal";

export default function CustomersPage() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  return (
    <AppShell>
      <ModulePage
        title="إدارة العملاء"
        subtitle="إدارة العملاء الأفراد والشركات"
        endpoint="/customers/"
        addButtonText="إضافة عميل"
        onAddClick={() => setIsAddCustomerOpen(true)}
      />

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      />
    </AppShell>
  );
}