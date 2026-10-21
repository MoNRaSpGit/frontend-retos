import { useEffect, useState } from "react";
import { fetchHistory } from "../retos.client";
import { errorMessage, formatDate } from "../retos.shared";
import { RANKS, RETO_TYPE_LABELS, type RetoCompletion } from "../retos.types";

export function HistorialScreen() {
  const [history, setHistory] = useState<RetoCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setHistory)
      .catch((err) => setError(errorMessage(err, "No se pudo cargar el historial.")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="retos-loading">Cargando...</p>;

  return (
    <div className="retos-screen">
      {error && <p className="retos-error">{error}</p>}
      <section className="retos-section">
        <h2 className="retos-section__title">Historial</h2>
        {history.length === 0 && <p className="retos-empty">Todavía no resolviste ningún reto.</p>}
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className={`history-item history-item--${item.result}`}>
              <span className="history-item__icon" aria-hidden="true">
                {item.result === "cumplido" ? "✓" : "✗"}
              </span>
              <div className="history-item__body">
                <span className="history-item__title">{item.challengeTitle}</span>
                <span className="history-item__meta">
                  {RETO_TYPE_LABELS[item.challengeType]} · {formatDate(item.resolvedAt)}
                </span>
              </div>
              <span className="history-item__rank" title="Rango después de resolver">
                {RANKS[item.rankAfter]?.emoji}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
