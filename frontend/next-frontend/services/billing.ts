const API_BASE_URL = "/backend";

export interface PendingChargeItem {
  source_type: "order" | "shipment" | "customs";
  source_id: number;
  description: string;
  amount: number;
}

export interface PendingCustomerCharges {
  customer_id: number;
  customer_name: string;
  total_amount: number;
  items: PendingChargeItem[];
}

export interface InvoiceLineItem {
  id: number;
  source_type: string;
  source_id: number;
  description: string;
  amount: number;
}

export interface GeneratedInvoice {
  id: number;
  customer_id: number;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total: number;
  status: string;
  created_at: string;
  items: InvoiceLineItem[];
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getPendingBilling(): Promise<PendingCustomerCharges[]> {
  const response = await fetch(`${API_BASE_URL}/billing/pending`, { cache: "no-store" });
  return handleResponse<PendingCustomerCharges[]>(response);
}

export async function generateInvoice(customerId: number): Promise<GeneratedInvoice> {
  const response = await fetch(`${API_BASE_URL}/billing/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_id: customerId }),
  });
  return handleResponse<GeneratedInvoice>(response);
}