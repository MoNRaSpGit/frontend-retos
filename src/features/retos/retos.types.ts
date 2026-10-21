export type RetoType = "unico" | "diario" | "semanal";
export type RetoResult = "cumplido" | "fallado";

export type RetoRank = { key: string; label: string; emoji: string };

export type RetoChallenge = {
  id: number;
  title: string;
  type: RetoType;
  active: boolean;
  createdAt: string;
  resolvedForCurrentPeriod: boolean;
};

export type RetoCompletion = {
  id: number;
  challengeId: number;
  challengeTitle: string;
  challengeType: RetoType;
  periodLabel: string | null;
  result: RetoResult;
  rankAfter: number;
  resolvedAt: string;
};

export type RetoState = {
  rankIndex: number;
  rank: RetoRank;
  totalCumplidos: number;
  totalFallados: number;
};

export const RETO_TYPE_LABELS: Record<RetoType, string> = {
  unico: "Único",
  diario: "Diario",
  semanal: "Semanal"
};

// Mismo orden que backend/src/modules/retos/retos.types.ts (RANKS).
export const RANKS: RetoRank[] = [
  { key: "huevito", label: "Huevito", emoji: "🥚" },
  { key: "gatito", label: "Gatito", emoji: "🐱" },
  { key: "soldadito", label: "Soldadito", emoji: "🪖" },
  { key: "espadita", label: "Espadita", emoji: "⚔️" },
  { key: "fueguito", label: "Fueguito", emoji: "🔥" },
  { key: "estrella", label: "Estrella", emoji: "⭐" },
  { key: "cohete", label: "Cohete", emoji: "🚀" },
  { key: "rayo", label: "Rayo", emoji: "⚡" },
  { key: "corona", label: "Corona", emoji: "👑" }
];
