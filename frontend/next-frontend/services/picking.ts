const API_BASE_URL = "/backend";

export type PickingStatus = "pending" | "picking" | "missing" | "packed" | "dispatched";
export interface PickingRecord {
  id: number;
  order_id: number;
  status: PickingStatus;
  delivery_number: string | null;
  missing_notes: string | null;
  created_at: string;
  packed_at: string | null;
}

export interface CreatePickingPayload {
  order_id: number;
}

export interface ReportMissingPayload {
  missing_notes: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getPicking(): Promise<PickingRecord[]> {
  const response = await fetch(`${API_BASE_URL}/picking`, { cache: "no-store" });
  return handleResponse<PickingRecord[]>(response);
}

export async function createPicking(payload: CreatePickingPayload): Promise<PickingRecord> {
  const response = await fetch(`${API_BASE_URL}/picking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<PickingRecord>(response);
}

export async function startPicking(pickingId: number): Promise<PickingRecord> {
  const response = await fetch(`${API_BASE_URL}/picking/${pickingId}/start`, {
    method: "PATCH",
  });
  return handleResponse<PickingRecord>(response);
}

export async function reportMissing(pickingId: number, payload: ReportMissingPayload): Promise<PickingRecord> {
  const response = await fetch(`${API_BASE_URL}/picking/${pickingId}/report-missing`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<PickingRecord>(response);
}

export async function packOrder(pickingId: number): Promise<PickingRecord> {
  const response = await fetch(`${API_BASE_URL}/picking/${pickingId}/pack`, {
    method: "PATCH",
  });
  return handleResponse<PickingRecord>(response);
}

export async function deletePicking(pickingId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/picking/${pickingId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
