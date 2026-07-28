"use client";

import { useState } from "react";
import { Edit, LogOut, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/DatePicker";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Dropdown from "@/components/ui/Dropdown";

export default function UIDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function handleLoadingTest() {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black">تجربة مكونات الواجهة</h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            صفحة مستقلة لاختبار المكونات قبل استخدامها داخل النظام
          </p>
        </div>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black">الأزرار</h2>

            <div className="flex flex-wrap gap-3">
              <Button>حفظ البيانات</Button>

              <Button variant="secondary">
                إلغاء
              </Button>

              <Button variant="danger">
                حذف
              </Button>

              <Button
                isLoading={isLoading}
                onClick={handleLoadingTest}
              >
                اختبار التحميل
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black">حقول الإدخال</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                id="customer-name"
                label="اسم العميل"
                placeholder="أدخل اسم العميل"
              />

              <Input
                id="customer-email"
                type="email"
                label="البريد الإلكتروني"
                placeholder="example@email.com"
              />

              <Select
                id="customer-type"
                label="نوع العميل"
                defaultValue=""
                options={[
                  {
                    value: "",
                    label: "اختر نوع العميل",
                  },
                  {
                    value: "individual",
                    label: "فرد",
                  },
                  {
                    value: "company",
                    label: "شركة",
                  },
                ]}
              />

              <DatePicker
                id="created-date"
                label="تاريخ الإنشاء"
              />
            </div>

            <div className="mt-5">
              <Textarea
                id="notes"
                label="الملاحظات"
                placeholder="اكتب الملاحظات هنا..."
              />
            </div>

            <div className="mt-5">
              <Checkbox
                id="active-customer"
                label="العميل نشط"
                defaultChecked
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black">
              النوافذ والقوائم
            </h2>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsModalOpen(true)}>
                فتح النافذة
              </Button>

              <Dropdown
                label="الإجراءات"
                items={[
                  {
                    label: "تعديل",
                    icon: <Edit size={17} />,
                    onClick: () => alert("تم اختيار التعديل"),
                  },
                  {
                    label: "حذف",
                    icon: <Trash2 size={17} />,
                    danger: true,
                    onClick: () => alert("تم اختيار الحذف"),
                  },
                  {
                    label: "تسجيل الخروج",
                    icon: <LogOut size={17} />,
                    onClick: () =>
                      alert("تم اختيار تسجيل الخروج"),
                  },
                ]}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black">
              التحميل والتنقل بين الصفحات
            </h2>

            <Loader text="جاري تحميل البيانات..." />

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>

            <p className="mt-4 text-center text-sm font-bold text-slate-500">
              الصفحة الحالية: {currentPage}
            </p>
          </section>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="إضافة عميل جديد"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input
            id="modal-customer-name"
            label="اسم العميل"
            placeholder="أدخل اسم العميل"
          />

          <Textarea
            id="modal-notes"
            label="ملاحظات"
            placeholder="أدخل الملاحظات"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              إلغاء
            </Button>

            <Button onClick={() => setIsModalOpen(false)}>
              حفظ
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}