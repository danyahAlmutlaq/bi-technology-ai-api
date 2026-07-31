const API_BASE_URL = "/backend";

export type CustomsStatus = "pending" | "in_progress" | "released";

export interface CustomsRecord {
  id: number;
  shipment_id: number;
  status: CustomsStatus;
  duty_amount: number;
  vat_amount: number;
  port_charges: number;
  free_time_expiry: string | null;
  released_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateCustomsPayload {
  shipment_id: number;
  duty_amount?: number;
  vat_amount?: number;
  port_charges?: number;
  free_time_expiry?: string | null;
  notes?: string | null;
}

export interface UpdateCustomsPayload {
  status?: CustomsStatus;
  duty_amount?: number;
  vat_amount?: number;
  port_charges?: number;
  free_time_expiry?: string | null;
  notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getCustoms(): Promise<CustomsRecord[]> {
  const response = await fetch(`${API_BASE_URL}/customs`, { cache: "no-store" });
  return handleResponse<CustomsRecord[]>(response);
}

export async function createCustoms(payload: CreateCustomsPayload): Promise<CustomsRecord> {
  const response = await fetch(`${API_BASE_URL}/customs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<CustomsRecord>(response);
}

export async function updateCustoms(customsId: number, payload: UpdateCustomsPayload): Promise<CustomsRecord> {
  const response = await fetch(`${API_BASE_URL}/customs/${customsId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<CustomsRecord>(response);
}

export async function deleteCustoms(customsId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/customs/${customsId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
