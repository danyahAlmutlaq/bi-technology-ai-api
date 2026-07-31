const API_BASE_URL = "/backend";

export type DeliveryStatus = "out_for_delivery" | "delivered" | "failed";

export interface DeliveryRecord {
  id: number;
  picking_id: number;
  status: DeliveryStatus;
  recipient_name: string | null;
  proof_image_url: string | null;
  cash_collected: number;
  failure_reason: string | null;
  notes: string | null;
  created_at: string;
  delivered_at: string | null;
}

export interface CreateDeliveryPayload {
  picking_id: number;
}

export interface CompleteDeliveryPayload {
  recipient_name: string;
  proof_image_url?: string | null;
  cash_collected?: number;
  notes?: string | null;
}

export interface FailDeliveryPayload {
  failure_reason: string;
  notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getDeliveries(): Promise<DeliveryRecord[]> {
  const response = await fetch(`${API_BASE_URL}/delivery`, { cache: "no-store" });
  return handleResponse<DeliveryRecord[]>(response);
}

export async function createDelivery(payload: CreateDeliveryPayload): Promise<DeliveryRecord> {
  const response = await fetch(`${API_BASE_URL}/delivery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DeliveryRecord>(response);
}

export async function completeDelivery(deliveryId: number, payload: CompleteDeliveryPayload): Promise<DeliveryRecord> {
  const response = await fetch(`${API_BASE_URL}/delivery/${deliveryId}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DeliveryRecord>(response);
}

export async function failDelivery(deliveryId: number, payload: FailDeliveryPayload): Promise<DeliveryRecord> {
  const response = await fetch(`${API_BASE_URL}/delivery/${deliveryId}/fail`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DeliveryRecord>(response);
}

export async function deleteDelivery(deliveryId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/delivery/${deliveryId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}