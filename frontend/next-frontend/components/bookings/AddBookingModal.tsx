"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "@/components/ui";

import {
  createBooking,
  getCustomers,
  type CreateBookingPayload,
  type CustomerOption,
  type ServiceType,
} from "@/services/bookings";

type AddBookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookingAdded?: () => void;
};

type BookingFormData = {
  customerId: string;
  serviceType: ServiceType;
  origin: string;
  destination: string;
  pickupDate: string;
  expectedDeliveryDate: string;
  packageCount: string;
  totalWeight: string;
  notes: string;
};

type FormErrors = Partial<
  Record<keyof BookingFormData, string>
>;

const initialFormData: BookingFormData = {
  customerId: "",
  serviceType: "domestic",
  origin: "",
  destination: "",
  pickupDate: "",
  expectedDeliveryDate: "",
  packageCount: "1",
  totalWeight: "0",
  notes: "",
};

export default function AddBookingModal({
  isOpen,
  onClose,
  onBookingAdded,
}: AddBookingModalProps) {
  const [formData, setFormData] =
    useState<BookingFormData>(initialFormData);

  const [customers, setCustomers] = useState<
    CustomerOption[]
  >([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isLoadingCustomers, setIsLoadingCustomers] =
    useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadCustomers() {
      setIsLoadingCustomers(true);
      setSubmitError("");

      try {
        const customerList = await getCustomers();
        setCustomers(customerList);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "تعذر تحميل قائمة العملاء";

        setSubmitError(message);
      } finally {
        setIsLoadingCustomers(false);
      }
    }

    void loadCustomers();
  }, [isOpen]);

  function updateField<K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
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

    if (!formData.customerId) {
      newErrors.customerId = "اختيار العميل مطلوب";
    }

    if (!formData.origin.trim()) {
      newErrors.origin = "مدينة أو موقع الاستلام مطلوب";
    }

    if (!formData.destination.trim()) {
      newErrors.destination =
        "مدينة أو موقع التسليم مطلوب";
    }

    const packageCount = Number(formData.packageCount);

    if (
      !Number.isInteger(packageCount) ||
      packageCount < 1
    ) {
      newErrors.packageCount =
        "عدد الطرود يجب أن يكون 1 أو أكثر";
    }

    const totalWeight = Number(formData.totalWeight);

    if (
      Number.isNaN(totalWeight) ||
      totalWeight < 0
    ) {
      newErrors.totalWeight =
        "الوزن يجب أن يكون رقمًا صحيحًا";
    }

    if (
      formData.pickupDate &&
      formData.expectedDeliveryDate &&
      formData.expectedDeliveryDate <
        formData.pickupDate
    ) {
      newErrors.expectedDeliveryDate =
        "موعد التسليم المتوقع يجب أن يكون بعد موعد الاستلام";
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

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateBookingPayload = {
        customer_id: Number(formData.customerId),
        service_type: formData.serviceType,
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        pickup_date:
          formData.pickupDate || undefined,
        expected_delivery_date:
          formData.expectedDeliveryDate || undefined,
        package_count: Number(formData.packageCount),
        total_weight: Number(formData.totalWeight),
        notes: formData.notes.trim() || undefined,
      };

      await createBooking(payload);

      setSuccessMessage("تمت إضافة الحجز بنجاح");

      onBookingAdded?.();

      setTimeout(() => {
        resetForm();
        onClose();
      }, 700);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "تعذر إضافة الحجز";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const customerOptions = customers.map(
    (customer) => ({
      value: String(customer.id),
      label: customer.phone
        ? `${customer.name} - ${customer.phone}`
        : customer.name,
    })
  );

  return (
    <Modal
      isOpen={isOpen}
      title="إضافة حجز جديد"
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
          <Select
            id="booking-customer"
            label="العميل"
            value={formData.customerId}
            error={errors.customerId}
            disabled={
              isSubmitting || isLoadingCustomers
            }
            options={[
              {
                value: "",
                label: isLoadingCustomers
                  ? "جاري تحميل العملاء..."
                  : "اختر العميل",
              },
              ...customerOptions,
            ]}
            onChange={(event) =>
              updateField(
                "customerId",
                event.target.value
              )
            }
          />

          <Select
            id="booking-service-type"
            label="نوع الخدمة"
            value={formData.serviceType}
            disabled={isSubmitting}
            options={[
              {
                value: "domestic",
                label: "شحن محلي",
              },
              {
                value: "international",
                label: "شحن دولي",
              },
            ]}
            onChange={(event) =>
              updateField(
                "serviceType",
                event.target.value as ServiceType
              )
            }
          />

          <Input
            id="booking-origin"
            label="موقع الاستلام"
            placeholder="مثال: الرياض"
            value={formData.origin}
            error={errors.origin}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("origin", event.target.value)
            }
          />

          <Input
            id="booking-destination"
            label="موقع التسليم"
            placeholder="مثال: جدة"
            value={formData.destination}
            error={errors.destination}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "destination",
                event.target.value
              )
            }
          />

          <Input
            id="booking-pickup-date"
            type="date"
            label="تاريخ الاستلام"
            value={formData.pickupDate}
            error={errors.pickupDate}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "pickupDate",
                event.target.value
              )
            }
          />

          <Input
            id="booking-delivery-date"
            type="date"
            label="تاريخ التسليم المتوقع"
            value={formData.expectedDeliveryDate}
            error={errors.expectedDeliveryDate}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "expectedDeliveryDate",
                event.target.value
              )
            }
          />

          <Input
            id="booking-package-count"
            type="number"
            min="1"
            label="عدد الطرود"
            value={formData.packageCount}
            error={errors.packageCount}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "packageCount",
                event.target.value
              )
            }
          />

          <Input
            id="booking-total-weight"
            type="number"
            min="0"
            step="0.01"
            label="الوزن الإجمالي بالكيلوجرام"
            value={formData.totalWeight}
            error={errors.totalWeight}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "totalWeight",
                event.target.value
              )
            }
          />
        </div>

        <Textarea
          id="booking-notes"
          label="الملاحظات"
          placeholder="أدخل أي ملاحظات خاصة بالحجز"
          value={formData.notes}
          disabled={isSubmitting}
          onChange={(event) =>
            updateField("notes", event.target.value)
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
            disabled={
              isSubmitting || isLoadingCustomers
            }
          >
            إضافة الحجز
          </Button>
        </div>
      </form>
    </Modal>
  );
}