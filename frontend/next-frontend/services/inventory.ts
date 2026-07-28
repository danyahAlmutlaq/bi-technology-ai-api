const API_BASE_URL = "/backend";

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  status: string;
  category: string | null;
  warehouse: string | null;
  location: string | null;
  batch_number: string | null;
  shipment_id: number | null;
  customer_id: number | null;
  minimum: number;
  maximum: number;
  movement: number;
  created_at: string;
}

export interface CreateInventoryPayload {
  name: string;
  quantity: number;
  unit_price: number;
  customer_id: number;
  category?: string;
  warehouse?: string;
  location?: string;
  batch_number?: string;
  shipment_id?: number;
  minimum?: number;
  maximum?: number;
}

export interface UpdateInventoryPayload {
  name?: string;
  sku?: string;
  quantity?: number;
  unit_price?: number;
  status?: string;
  category?: string;
  warehouse?: string;
  location?: string;
  batch_number?: string;
  customer_id?: number;
  minimum?: number;
  maximum?: number;
}

export interface CustomerOption {
  id: number;
  name: string;
  customer_type: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getCustomers(): Promise<CustomerOption[]> {
  const response = await fetch(`${API_BASE_URL}/customers`, { cache: "no-store" });
  return handleResponse<CustomerOption[]>(response);
}

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/inventory`, { cache: "no-store" });
  return handleResponse<InventoryItem[]>(response);
}

export async function createInventoryItem(payload: CreateInventoryPayload): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<InventoryItem>(response);
}

export async function updateInventoryItem(itemId: number, payload: UpdateInventoryPayload): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<InventoryItem>(response);
}

export async function restockInventoryItem(itemId: number): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE_URL}/inventory/${itemId}/restock`, {
    method: "PATCH",
  });
  return handleResponse<InventoryItem>(response);
}

export async function deleteInventoryItem(itemId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
