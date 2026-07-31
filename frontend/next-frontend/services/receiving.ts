const API_BASE_URL = "/backend";

export type ReceivingStatus = "pending" | "received" | "discrepancy";

export interface ReceivingRecord {
  id: number;
  shipment_id: number;
  expected_quantity: number;
  actual_quantity: number | null;
  storage_location: string | null;
  damage_notes: string | null;
  status: ReceivingStatus;
  receipt_sent: boolean;
  received_at: string | null;
  created_at: string;
}

export interface CreateReceivingPayload {
  shipment_id: number;
  expected_quantity: number;
}

export interface RecordArrivalPayload {
  actual_quantity: number;
  storage_location?: string | null;
  damage_notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getReceiving(): Promise<ReceivingRecord[]> {
  const response = await fetch(`${API_BASE_URL}/receiving`, { cache: "no-store" });
  return handleResponse<ReceivingRecord[]>(response);
}

export async function createReceiving(payload: CreateReceivingPayload): Promise<ReceivingRecord> {
  const response = await fetch(`${API_BASE_URL}/receiving`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ReceivingRecord>(response);
}

export async function recordArrival(receivingId: number, payload: RecordArrivalPayload): Promise<ReceivingRecord> {
  const response = await fetch(`${API_BASE_URL}/receiving/${receivingId}/receive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ReceivingRecord>(response);
}

export async function sendReceivingReceipt(receivingId: number): Promise<ReceivingRecord> {
  const response = await fetch(`${API_BASE_URL}/receiving/${receivingId}/send-receipt`, {
    method: "PATCH",
  });
  return handleResponse<ReceivingRecord>(response);
}

export async function deleteReceiving(receivingId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/receiving/${receivingId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}