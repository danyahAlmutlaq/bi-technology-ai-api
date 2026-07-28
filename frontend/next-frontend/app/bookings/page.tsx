"use client";

import { useState } from "react";

import AppShell from "../../components/layout/AppShell";
import ModulePage from "../../components/modules/ModulePage";
import AddBookingModal from "../../components/bookings/AddBookingModal";

export default function BookingsPage() {
  const [isAddBookingOpen, setIsAddBookingOpen] =
    useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  function handleBookingAdded() {
    setRefreshKey((previous) => previous + 1);
  }

  return (
    <AppShell>
      <ModulePage
        key={refreshKey}
        title="إدارة الحجوزات"
        subtitle="إنشاء ومتابعة حجوزات الشحن المحلية والدولية"
        endpoint="/bookings/"
        addButtonText="إضافة حجز"
        onAddClick={() => setIsAddBookingOpen(true)}
      />

      <AddBookingModal
        isOpen={isAddBookingOpen}
        onClose={() => setIsAddBookingOpen(false)}
        onBookingAdded={handleBookingAdded}
      />
    </AppShell>
  );
}