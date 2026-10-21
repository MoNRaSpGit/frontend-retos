import { useEffect, useState } from "react";
import {
  createChallenge,
  deleteChallenge,
  fetchChallenges,
  fetchState,
  resolveChallenge
} from "../retos.client";
import { errorMessage } from "../retos.shared";
import { RANKS, RETO_TYPE_LABELS, type RetoChallenge, type RetoState, type RetoType } from "../retos.types";

export function RangoScreen() {
  const [state, setState] = useState<RetoState | null>(null);
  const [challenges, setChallenges] = useState<RetoChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<RetoType>("diario");
  const [creating, setCreating] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [stateRes, challengesRes] = await Promise.all([fetchState(), fetchChallenges()]);
      setState(stateRes);
      setChallenges(challengesRes);
    } catch (err) {
      setError(errorMessage(err, "No se pudo cargar la información."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createChallenge({ title: newTitle.trim(), type: newType });
      setNewTitle("");
      setNewType("diario");
      await loadAll();
    } catch (err) {
      setError(errorMessage(err, "No se pudo crear el reto."));
    } finally {
      setCreating(false);
    }
  }

  async function handleResolve(id: number, result: "cumplido" | "fallado") {
    setBusyId(id);
    setError(null);
    try {
      const nextState = await resolveChallenge(id, result);
      setState(nextState);
      await loadAll();
    } catch (err) {
      setError(errorMessage(err, "No se pudo resolver el reto."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id);
    setError(null);
    try {
      await deleteChallenge(id);
      await loadAll();
    } catch (err) {
      setError(errorMessage(err, "No se pudo eliminar el reto."));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="retos-loading">Cargando...</p>;

  const rank = state?.rank ?? RANKS[0];
  const rankIndex = state?.rankIndex ?? 0;
  const progressPct = Math.round((rankIndex / (RANKS.length - 1)) * 100);

  return (
    <div className="retos-screen">
      {error && <p className="retos-error">{error}</p>}

      <section className="rank-card">
        <div className="rank-card__emoji" aria-hidden="true">
          {rank.emoji}
        </div>
        <div className="rank-card__info">
          <span className="rank-card__eyebrow">Rango actual</span>
          <h1 className="rank-card__label">{rank.label}</h1>
          <div className="rank-card__bar">
            <div className="rank-card__bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="rank-card__stats">
            <span className="stat stat--good">✓ {state?.totalCumplidos ?? 0} cumplidos</span>
            <span className="stat stat--bad">✗ {state?.totalFallados ?? 0} fallados</span>
          </div>
        </div>
      </section>

      <section className="retos-section">
        <h2 className="retos-section__title">Retos activos</h2>
        {challenges.length === 0 && <p className="retos-empty">No hay retos activos. Creá uno abajo.</p>}
        <ul className="challenge-list">
          {challenges.map((challenge) => (
            <li key={challenge.id} className="challenge-card">
              <div className="challenge-card__main">
                <span className="challenge-card__title">{challenge.title}</span>
                <span className={`challenge-card__type challenge-card__type--${challenge.type}`}>
                  {RETO_TYPE_LABELS[challenge.type]}
                </span>
              </div>
              <div className="challenge-card__actions">
                {challenge.resolvedForCurrentPeriod ? (
                  <span className="challenge-card__done">Ya resuelto hoy</span>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn--good"
                      disabled={busyId === challenge.id}
                      onClick={() => handleResolve(challenge.id, "cumplido")}
                    >
                      Cumplido
                    </button>
                    <button
                      type="button"
                      className="btn btn--bad"
                      disabled={busyId === challenge.id}
                      onClick={() => handleResolve(challenge.id, "fallado")}
                    >
                      Fallado
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn--ghost"
                  disabled={busyId === challenge.id}
                  onClick={() => handleDelete(challenge.id)}
                  aria-label="Eliminar reto"
                  title="Eliminar reto"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="retos-section">
        <h2 className="retos-section__title">Nuevo reto</h2>
        <form className="new-challenge-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Ej: 5 lagartijas"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            maxLength={160}
            required
          />
          <select value={newType} onChange={(event) => setNewType(event.target.value as RetoType)}>
            <option value="unico">Único</option>
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
          </select>
          <button type="submit" className="btn btn--primary" disabled={creating}>
            Agregar
          </button>
        </form>
      </section>
    </div>
  );
}
