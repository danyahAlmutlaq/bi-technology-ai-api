import { API_BASE_URL } from "@/lib/api";

export type CreateCustomerPayload = {
  name: string;
  type: "individual" | "company";
  phone: string;
  email?: string;
  taxNumber?: string;
  city?: string;
  notes?: string;
  isActive: boolean;
};

export async function createCustomer(
  data: CreateCustomerPayload
) {
  const response = await fetch(
    `${API_BASE_URL}/customers/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof responseData?.detail === "string"
        ? responseData.detail
        : "تعذر إضافة العميل"
    );
  }

  return responseData;
}