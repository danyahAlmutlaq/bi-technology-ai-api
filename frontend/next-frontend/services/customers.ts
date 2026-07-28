const API_BASE_URL = "/backend";

export type CustomerType = "individual" | "company";

export type Customer = {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  tax_number?: string | null;
  notes?: string | null;
  customer_type?: CustomerType | null;
  city?: string | null;
  national_id?: string | null;
  commercial_registration?: string | null;
  company_website?: string | null;
  contact_person?: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateCustomerPayload = {
  name: string;
  type: CustomerType;
  phone: string;
  email?: string;
  taxNumber?: string;
  city?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  nationalId?: string;
  commercialRegistration?: string;
  companyWebsite?: string;
  contactPerson?: string;
};

type BackendCustomerPayload = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string;
  notes?: string;
  customer_type?: CustomerType;
  city?: string;
  national_id?: string;
  commercial_registration?: string;
  company_website?: string;
  contact_person?: string;
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

function toBackendPayload(
  data: CreateCustomerPayload
): BackendCustomerPayload {
  return {
    name: data.name,
    phone: data.phone || undefined,
    email: data.email || undefined,
    address: data.address || undefined,
    tax_number: data.taxNumber || undefined,
    notes: data.notes || undefined,
    customer_type: data.type,
    city: data.city || undefined,
    national_id: data.nationalId || undefined,
    commercial_registration: data.commercialRegistration || undefined,
    company_website: data.companyWebsite || undefined,
    contact_person: data.contactPerson || undefined,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

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
    throw new Error("بيانات العملاء المستلمة غير صحيحة");
  }

  return responseData as Customer[];
}

export async function createCustomer(
  data: CreateCustomerPayload
): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(toBackendPayload(data)),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "تعذر إضافة العميل")
    );
  }

  return (await response.json()) as Customer;
}