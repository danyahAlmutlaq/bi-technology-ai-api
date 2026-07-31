const API_BASE_URL = "/backend";

export type Invoice = {
  id: number;
  customer_id: number;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total: number;
  status: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getInvoices(): Promise<Invoice[]> {
  const response = await fetch(`${API_BASE_URL}/invoices`, { cache: "no-store" });
  return handleResponse<Invoice[]>(response);
}
