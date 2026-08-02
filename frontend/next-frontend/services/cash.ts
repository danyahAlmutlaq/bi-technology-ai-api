const API_BASE_URL = "/backend";

export type CashSettlementStatus = "pending" | "settled";

export interface PendingDeliveryItem {
  delivery_id: number;
  picking_id: number;
  recipient_name: string | null;
  cash_collected: number;
  delivered_at: string | null;
}

export interface PendingDriverGroup {
  driver_name: string;
  total_amount: number;
  deliveries: PendingDeliveryItem[];
}

export interface CashSettlementItem {
  id: number;
  delivery_id: number;
  amount: number;
  recipient_name?: string | null;
  delivered_at?: string | null;
}

export interface CashSettlement {
  id: number;
  driver_name: string;
  total_amount: number;
  status: CashSettlementStatus;
  notes: string | null;
  created_at: string;
  settled_at: string | null;
  counted_amount: number | null;
  discrepancy: number | null;
  items: CashSettlementItem[];
}

export interface CreateSettlementPayload {
  driver_name: string;
  notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getPendingCash(): Promise<PendingDriverGroup[]> {
  const response = await fetch(`${API_BASE_URL}/cash/pending`, { cache: "no-store" });
  return handleResponse<PendingDriverGroup[]>(response);
}

export async function getSettlements(): Promise<CashSettlement[]> {
  const response = await fetch(`${API_BASE_URL}/cash/settlements`, { cache: "no-store" });
  return handleResponse<CashSettlement[]>(response);
}

export async function createSettlement(payload: CreateSettlementPayload): Promise<CashSettlement> {
  const response = await fetch(`${API_BASE_URL}/cash/settlements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<CashSettlement>(response);
}

export async function confirmSettlement(settlementId: number, countedAmount: number): Promise<CashSettlement> {
  const response = await fetch(`${API_BASE_URL}/cash/settlements/${settlementId}/confirm`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ counted_amount: countedAmount }),
  });
  return handleResponse<CashSettlement>(response);
}