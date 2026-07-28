const API_BASE_URL = "/backend";

export type BookingStatus =
  | "draft"
  | "confirmed"
  | "cancelled";

export type ServiceType =
  | "domestic"
  | "international";

export type CustomerOption = {
  id: number;
  name: string;
  phone?: string | null;
};

export type Booking = {
  id: number;
  booking_number: string;
  customer_id: number;
  service_type: string;
  origin: string;
  destination: string;
  pickup_date?: string | null;
  expected_delivery_date?: string | null;
  package_count: number;
  total_weight: number;
  status: BookingStatus;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type CreateBookingPayload = {
  customer_id: number;
  service_type: ServiceType;
  origin: string;
  destination: string;
  pickup_date?: string;
  expected_delivery_date?: string;
  package_count: number;
  total_weight: number;
  notes?: string;
};

type ApiErrorResponse = {
  detail?: string;
  message?: string;
};

async function getErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  const responseData: ApiErrorResponse | null =
    await response.json().catch(() => null);

  if (typeof responseData?.detail === "string") {
    return responseData.detail;
  }

  if (typeof responseData?.message === "string") {
    return responseData.message;
  }

  return `${fallbackMessage} — رمز الخطأ: ${response.status}`;
}

export async function getCustomers(): Promise<
  CustomerOption[]
> {
  const response = await fetch(
    `${API_BASE_URL}/customers`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "تعذر تحميل قائمة العملاء"
      )
    );
  }

  const responseData: unknown = await response.json();

  if (!Array.isArray(responseData)) {
    throw new Error(
      "بيانات العملاء المستلمة غير صحيحة"
    );
  }

  return responseData as CustomerOption[];
}

export async function createBooking(
  data: CreateBookingPayload
): Promise<Booking> {
  const response = await fetch(
    `${API_BASE_URL}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "تعذر إضافة الحجز"
      )
    );
  }

  return (await response.json()) as Booking;
}

export async function getBookings(): Promise<
  Booking[]
> {
  const response = await fetch(
    `${API_BASE_URL}/bookings`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "تعذر تحميل الحجوزات"
      )
    );
  }

  const responseData: unknown = await response.json();

  if (!Array.isArray(responseData)) {
    throw new Error(
      "بيانات الحجوزات المستلمة غير صحيحة"
    );
  }

  return responseData as Booking[];
}