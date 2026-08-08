const API_BASE_URL = "/backend";

export type DispatchStatus = "building" | "dispatched";

export interface DispatchItem {
  id: number;
  dispatch_id: number;
  picking_id: number;
  scanned: boolean;
}

export interface DispatchRoute {
  id: number;
  route_number: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  vehicle_plate: string | null;
  status: DispatchStatus;
  notes: string | null;
  created_at: string;
  dispatched_at: string | null;
  items: DispatchItem[];
}

export interface CreateDispatchPayload {
  driver_name?: string | null;
  driver_phone?: string | null;
  vehicle_plate?: string | null;
  notes?: string | null;
}

export interface UpdateDispatchPayload {
  driver_name?: string | null;
  driver_phone?: string | null;
  vehicle_plate?: string | null;
  notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getDispatchRoutes(): Promise<DispatchRoute[]> {
  const response = await fetch(`${API_BASE_URL}/dispatch`, { cache: "no-store" });
  return handleResponse<DispatchRoute[]>(response);
}

export async function getDispatchHistory(): Promise<DispatchRoute[]> {
  const response = await fetch(`${API_BASE_URL}/dispatch/history`, { cache: "no-store" });
  return handleResponse<DispatchRoute[]>(response);
}

export async function createDispatchRoute(payload: CreateDispatchPayload): Promise<DispatchRoute> {
  const response = await fetch(`${API_BASE_URL}/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DispatchRoute>(response);
}

export async function updateDispatchRoute(routeId: number, payload: UpdateDispatchPayload): Promise<DispatchRoute> {
  const response = await fetch(`${API_BASE_URL}/dispatch/${routeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<DispatchRoute>(response);
}

export async function addDispatchItem(routeId: number, pickingId: number): Promise<DispatchRoute> {
  const response = await fetch(`${API_BASE_URL}/dispatch/${routeId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ picking_id: pickingId }),
  });
  return handleResponse<DispatchRoute>(response);
}

export async function scanDispatchItem(routeId: number, itemId: number, boxCode: string): Promise<DispatchRoute> {
  const response = await fetch(`${API_BASE_URL}/dispatch/${routeId}/items/${itemId}/scan`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ box_code: boxCode }),
  });
  return handleResponse<DispatchRoute>(response);
}

export async function closeDispatchRoute(routeId: number): Promise<DispatchRoute> {
  const response = await fetch(`${API_BASE_URL}/dispatch/${routeId}/close`, {
    method: "PATCH",
  });
  return handleResponse<DispatchRoute>(response);
}

export async function deleteDispatchRoute(routeId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/dispatch/${routeId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}