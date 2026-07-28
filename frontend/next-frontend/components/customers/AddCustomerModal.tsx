"use client";

import { useState, type FormEvent } from "react";

import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  Textarea,
} from "@/components/ui";

import {
  createCustomer,
  type CreateCustomerPayload,
} from "@/services/customers";

type CustomerType = "individual" | "company";

type AddCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded?: () => void;
};

type CustomerFormData = {
  name: string;
  type: CustomerType;
  phone: string;
  email: string;
  taxNumber: string;
  city: string;
  notes: string;
  isActive: boolean;
};

type FormErrors = Partial<
  Record<keyof CustomerFormData, string>
>;

const initialFormData: CustomerFormData = {
  name: "",
  type: "individual",
  phone: "",
  email: "",
  taxNumber: "",
  city: "",
  notes: "",
  isActive: true,
};

export default function AddCustomerModal({
  isOpen,
  onClose,
  onCustomerAdded,
}: AddCustomerModalProps) {
  const [formData, setFormData] =
    useState<CustomerFormData>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setSubmitError("");
    setSuccessMessage("");
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم العميل مطلوب";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الجوال مطلوب";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (
      formData.type === "company" &&
      !formData.taxNumber.trim()
    ) {
      newErrors.taxNumber =
        "الرقم الضريبي مطلوب للشركات";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError("");
    setSuccessMessage("");
  }

  function handleClose() {
    if (isSubmitting) return;

    resetForm();
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const payload: CreateCustomerPayload = {
        name: formData.name.trim(),
        type: formData.type,
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        taxNumber:
          formData.type === "company"
            ? formData.taxNumber.trim() || undefined
            : undefined,
        city: formData.city.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        isActive: formData.isActive,
      };

      await createCustomer(payload);

      setSuccessMessage("تمت إضافة العميل بنجاح");

      onCustomerAdded?.();

      setTimeout(() => {
        resetForm();
        onClose();
      }, 700);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "تعذر إضافة العميل";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="إضافة عميل جديد"
      onClose={handleClose}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="customer-name"
            label="اسم العميل"
            placeholder="أدخل اسم العميل"
            value={formData.name}
            error={errors.name}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
          />

          <Select
            id="customer-type"
            label="نوع العميل"
            value={formData.type}
            disabled={isSubmitting}
            options={[
              {
                value: "individual",
                label: "فرد",
              },
              {
                value: "company",
                label: "شركة",
              },
            ]}
            onChange={(event) =>
              updateField(
                "type",
                event.target.value as CustomerType
              )
            }
          />

          <Input
            id="customer-phone"
            type="tel"
            label="رقم الجوال"
            placeholder="05xxxxxxxx"
            value={formData.phone}
            error={errors.phone}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
          />

          <Input
            id="customer-email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            value={formData.email}
            error={errors.email}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
          />

          {formData.type === "company" && (
            <Input
              id="customer-tax-number"
              label="الرقم الضريبي"
              placeholder="أدخل الرقم الضريبي"
              value={formData.taxNumber}
              error={errors.taxNumber}
              disabled={isSubmitting}
              onChange={(event) =>
                updateField(
                  "taxNumber",
                  event.target.value
                )
              }
            />
          )}

          <Input
            id="customer-city"
            label="المدينة"
            placeholder="مثال: الرياض"
            value={formData.city}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("city", event.target.value)
            }
          />
        </div>

        <Textarea
          id="customer-notes"
          label="الملاحظات"
          placeholder="أدخل أي ملاحظات خاصة بالعميل"
          value={formData.notes}
          disabled={isSubmitting}
          onChange={(event) =>
            updateField("notes", event.target.value)
          }
        />

        <Checkbox
          id="customer-active"
          label="العميل نشط"
          checked={formData.isActive}
          disabled={isSubmitting}
          onChange={(event) =>
            updateField(
              "isActive",
              event.target.checked
            )
          }
        />

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            إلغاء
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            إضافة العميل
          </Button>
        </div>
      </form>
    </Modal>
  );
}