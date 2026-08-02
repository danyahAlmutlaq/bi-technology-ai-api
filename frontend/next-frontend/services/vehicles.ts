const API_BASE_URL = "/backend";

export interface Vehicle {
  id: number;
  plate: string;
  driver_name: string | null;
  capacity: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateVehiclePayload {
  plate: string;
  driver_name?: string | null;
  capacity?: string | null;
}

export interface UpdateVehiclePayload {
  plate?: string;
  driver_name?: string | null;
  capacity?: string | null;
  is_active?: boolean;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${API_BASE_URL}/vehicles`, { cache: "no-store" });
  return handleResponse<Vehicle[]>(response);
}

export async function createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Vehicle>(response);
}

export async function updateVehicle(id: number, payload: UpdateVehiclePayload): Promise<Vehicle> {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Vehicle>(response);
}

export async function deleteVehicle(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
