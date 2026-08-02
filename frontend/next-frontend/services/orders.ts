const API_BASE_URL = "/backend";

export type OrderStatus =
  | "new"
  | "pending_approval"
  | "in_progress"
  | "ready_to_ship"
  | "completed";

export type OrderPriority = "high" | "medium" | "normal";

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  title: string;
  amount: number;
  status: OrderStatus;
  priority: OrderPriority;
  due_date: string | null;
  owner: string | null;
  progress: number;
  invoice_ready: boolean;
  shipment_ready: boolean;
  notes: string | null;
  origin: string | null;
  destination: string | null;
  service_type: string | null;
  package_count: number | null;
  delivery_company_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateOrderPayload {
  customer_id: number;
  title: string;
  amount: number;
  priority: OrderPriority;
  due_date?: string | null;
  owner?: string | null;
  notes?: string | null;
  origin?: string | null;
  destination?: string | null;
  service_type?: string | null;
  package_count?: number | null;
  delivery_company_id?: number | null;
}

export interface UpdateOrderPayload {
  title?: string;
  amount?: number;
  priority?: OrderPriority;
  due_date?: string | null;
  owner?: string | null;
  notes?: string | null;
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

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`, { cache: "no-store" });
  return handleResponse<Order[]>(response);
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Order>(response);
}

export async function updateOrder(orderId: number, payload: UpdateOrderPayload): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Order>(response);
}

export async function advanceOrder(orderId: number): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/advance`, {
    method: "PATCH",
  });
  return handleResponse<Order>(response);
}

export async function toggleInvoiceReady(orderId: number): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/toggle-invoice`, {
    method: "PATCH",
  });
  return handleResponse<Order>(response);
}

export interface OrderShipmentPayload {
  origin?: string;
  destination?: string;
  service_type?: string;
  package_count?: number;
}
export async function toggleShipmentReady(orderId: number, payload?: OrderShipmentPayload): Promise<Order> {
  const response = await fetch(API_BASE_URL + "/orders/" + orderId + "/toggle-shipment", {
    method: "PATCH",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  return handleResponse<Order>(response);
}

export async function deleteOrder(orderId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
