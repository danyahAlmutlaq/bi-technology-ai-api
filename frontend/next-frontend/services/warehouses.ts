const API_BASE_URL = "/backend";

export interface Warehouse {
  id: number;
  name: string;
  code: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateWarehousePayload {
  name: string;
  code?: string | null;
  address?: string | null;
}

export interface UpdateWarehousePayload {
  name?: string;
  code?: string | null;
  address?: string | null;
  is_active?: boolean;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const response = await fetch(`${API_BASE_URL}/warehouses`, { cache: "no-store" });
  return handleResponse<Warehouse[]>(response);
}

export async function createWarehouse(payload: CreateWarehousePayload): Promise<Warehouse> {
  const response = await fetch(`${API_BASE_URL}/warehouses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Warehouse>(response);
}

export async function updateWarehouse(id: number, payload: UpdateWarehousePayload): Promise<Warehouse> {
  const response = await fetch(`${API_BASE_URL}/warehouses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Warehouse>(response);
}

export async function deleteWarehouse(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/warehouses/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
