const API_BASE_URL = "/backend";

export type ReturnStatus = "pending" | "resolved";
export type ReturnCondition = "good" | "damaged";
export type ReturnOutcome = "back_to_stock" | "quarantine" | "return_to_customer";

export interface ReturnRecord {
  id: number;
  delivery_id: number;
  status: ReturnStatus;
  condition: ReturnCondition | null;
  outcome: ReturnOutcome | null;
  notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface CreateReturnPayload {
  delivery_id: number;
}

export interface ResolveReturnPayload {
  condition: ReturnCondition;
  outcome: ReturnOutcome;
  notes?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getReturns(): Promise<ReturnRecord[]> {
  const response = await fetch(`${API_BASE_URL}/returns`, { cache: "no-store" });
  return handleResponse<ReturnRecord[]>(response);
}

export async function createReturn(payload: CreateReturnPayload): Promise<ReturnRecord> {
  const response = await fetch(`${API_BASE_URL}/returns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ReturnRecord>(response);
}

export async function resolveReturn(returnId: number, payload: ResolveReturnPayload): Promise<ReturnRecord> {
  const response = await fetch(`${API_BASE_URL}/returns/${returnId}/resolve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ReturnRecord>(response);
}

export async function deleteReturn(returnId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/returns/${returnId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
}