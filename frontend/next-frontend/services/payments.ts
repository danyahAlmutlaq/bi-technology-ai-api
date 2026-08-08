const API_BASE_URL = "/backend";

export type Payment = {
  id: number;
  customer_id: number;
  invoice_id: number;
  amount: number;
  payment_method: string;
  created_at: string;
};

export type CreatePaymentPayload = {
  customer_id: number;
  invoice_id: number;
  amount: number;
  payment_method: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch(`${API_BASE_URL}/payments`, { cache: "no-store" });
  return handleResponse<Payment[]>(response);
}

export async function createPayment(payload: CreatePaymentPayload): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Payment>(response);
}

export async function updatePayment(id: number, payload: CreatePaymentPayload): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Payment>(response);
}

export async function deletePayment(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}
