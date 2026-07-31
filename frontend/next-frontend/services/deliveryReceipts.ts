const API_BASE_URL = "/backend";

export interface DeliveryReceiptRecord {
  id: number;
  shipment_id: number;
  recipient_name: string;
  proof_image_url: string | null;
  notes: string | null;
  is_archived: boolean;
  created_at: string;
}

export interface CreateDeliveryReceiptPayload {
  shipment_id: number;
  recipient_name: string;
  proof_image_url?: string | null;
  notes?: string | null;
}

export interface UpdateDeliveryReceiptPayload {
  recipient_name?: string;
  proof_image_url?: string | null;
  notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getDeliveryReceipts(): Promise<DeliveryReceiptRecord[]> {
  const response = await fetch(`${API_BASE_URL}/delivery-receipts`, { cache: "no-store" });
  return handleResponse<DeliveryReceiptRecord[]>(response);
}

export async function createDeliveryReceipt(payload: CreateDeliveryReceiptPayload): Promise<DeliveryReceiptRecord> {
  const response = await fetch(`${API_BASE_URL}/delivery-receipts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DeliveryReceiptRecord>(response);
}

export async function updateDeliveryReceipt(receiptId: number, payload: UpdateDeliveryReceiptPayload): Promise<DeliveryReceiptRecord> {
  const response = await fetch(`${API_BASE_URL}/delivery-receipts/${receiptId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DeliveryReceiptRecord>(response);
}

export async function deleteDeliveryReceipt(receiptId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/delivery-receipts/${receiptId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}