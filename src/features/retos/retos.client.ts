import { API_BASE_URL } from "../../shared/config/api";
import type { RetoChallenge, RetoCompletion, RetoState, RetoType, RetoResult } from "./retos.types";

function buildUrl(path: string) {
  return `${API_BASE_URL}/api/v1/retos${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "No se pudo completar la operación.");
  }
  return response.json() as Promise<T>;
}

export function fetchChallenges() {
  return request<RetoChallenge[]>("/challenges");
}

export function createChallenge(input: { title: string; type: RetoType }) {
  return request<RetoChallenge>("/challenges", { method: "POST", body: JSON.stringify(input) });
}

export function deleteChallenge(id: number) {
  return request<void>(`/challenges/${id}`, { method: "DELETE" });
}

export function resolveChallenge(id: number, result: RetoResult) {
  return request<RetoState>(`/challenges/${id}/resolve`, { method: "POST", body: JSON.stringify({ result }) });
}

export function fetchState() {
  return request<RetoState>("/state");
}

export function fetchHistory(limit = 50) {
  return request<RetoCompletion[]>(`/history?limit=${limit}`);
}
