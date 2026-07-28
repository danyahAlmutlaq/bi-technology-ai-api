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
): Promise<unknown> {
  const response = await fetch(
    "https://bi-technology-ai-api.onrender.com/customers/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error("تعذر إضافة العميل");
  }

  return responseData;
}
