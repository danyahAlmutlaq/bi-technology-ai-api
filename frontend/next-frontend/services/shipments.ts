const API_BASE_URL = "/backend";

export type Shipment = {
  id: number;
  customer_id: number;
  delivery_company_id: number;
  tracking_number?: string | null;
  shipping_cost: number;
  service_type?: string | null;
  container_number?: string | null;
  container_type?: string | null;
  bill_of_lading_number?: string | null;
  vessel_name?: string | null;
  arrival_date?: string | null;
  order_id?: number | null;
  status: string;
  notes?: string | null;
  created_at: string;
  total_invoiced?: number;
  total_paid?: number;
  balance?: number;
  financial_status?: string;
};

export type CreateShipmentPayload = {
  customer_id: number;
  delivery_company_id: number;
  tracking_number?: string;
  shipping_cost?: number;
  service_type?: string;
  container_number?: string;
  container_type?: string;
  bill_of_lading_number?: string;
  vessel_name?: string;
  arrival_date?: string;
  notes?: string;
};

export type UpdateShipmentPayload = {
  tracking_number?: string;
  shipping_cost?: number;
  service_type?: string;
  container_number?: string;
  container_type?: string;
  bill_of_lading_number?: string;
  vessel_name?: string;
  arrival_date?: string;
  status?: string;
  notes?: string;
};

export type CustomerOption = {
  id: number;
  name: string;
  phone?: string | null;
};

export type DeliveryCompanyOption = {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  tracking_url?: string | null;
  notes?: string | null;
  domestic_cost_price?: number | null;
  domestic_sell_price?: number | null;
  international_cost_price?: number | null;
  international_sell_price?: number | null;
  responsibility_note?: string | null;
  is_internal_fleet?: boolean | null;
};
export type DeliveryCompanyPricingPayload = {
  domestic_cost_price?: number;
  domestic_sell_price?: number;
  international_cost_price?: number;
  international_sell_price?: number;
  responsibility_note?: string;
};

type ApiErrorResponse = {
  detail?: string;
  message?: string;
};

async function getErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  const responseData: ApiErrorResponse | null = await response.json().catch(() => null);
  if (typeof responseData?.detail === "string") {
    return responseData.detail;
  }
  if (typeof responseData?.message === "string") {
    return responseData.message;
  }
  return `${fallbackMessage} — رمز الخطأ: ${response.status}`;
}

export async function getCustomers(): Promise<CustomerOption[]> {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر تحميل قائمة العملاء"));
  }
  const responseData: unknown = await response.json();
  if (!Array.isArray(responseData)) {
    throw new Error("بيانات العملاء المستلمة غير صحيحة");
  }
  return responseData as CustomerOption[];
}

export async function getDeliveryCompanies(): Promise<DeliveryCompanyOption[]> {
  const response = await fetch(`${API_BASE_URL}/delivery-companies`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر تحميل شركات التوصيل"));
  }
  const responseData: unknown = await response.json();
  if (!Array.isArray(responseData)) {
    throw new Error("بيانات شركات التوصيل غير صحيحة");
  }
  return responseData as DeliveryCompanyOption[];
}
export async function updateDeliveryCompanyPricing(
  id: number,
  data: DeliveryCompanyPricingPayload
): Promise<DeliveryCompanyOption> {
  const response = await fetch(API_BASE_URL + "/delivery-companies/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر تحديث أسعار شركة التوصيل"));
  }
  return (await response.json()) as DeliveryCompanyOption;
}

export async function getShipments(): Promise<Shipment[]> {
  const response = await fetch(`${API_BASE_URL}/shipments`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر تحميل الشحنات"));
  }
  const responseData: unknown = await response.json();
  if (!Array.isArray(responseData)) {
    throw new Error("بيانات الشحنات المستلمة غير صحيحة");
  }
  return responseData as Shipment[];
}

export async function createShipment(payload: CreateShipmentPayload): Promise<Shipment> {
  const response = await fetch(`${API_BASE_URL}/shipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر إضافة الشحنة"));
  }
  return (await response.json()) as Shipment;
}

export async function updateShipment(shipmentId: number, payload: UpdateShipmentPayload): Promise<Shipment> {
  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر تحديث الشحنة"));
  }
  return (await response.json()) as Shipment;
}

export async function deleteShipment(shipmentId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "تعذر حذف الشحنة"));
  }
}
