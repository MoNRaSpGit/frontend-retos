export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" });
}
