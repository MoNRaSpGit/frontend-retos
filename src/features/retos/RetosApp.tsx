import { useState } from "react";
import { HistorialScreen } from "./screens/HistorialScreen";
import { RangoScreen } from "./screens/RangoScreen";

type Tab = "rango" | "historial";

export function RetosApp() {
  const [tab, setTab] = useState<Tab>("rango");

  return (
    <div className="app">
      <header className="app-bar">
        <strong>Retos</strong>
        <nav className="app-tabs">
          <button type="button" className={tab === "rango" ? "is-active" : ""} onClick={() => setTab("rango")}>
            Rango
          </button>
          <button type="button" className={tab === "historial" ? "is-active" : ""} onClick={() => setTab("historial")}>
            Historial
          </button>
        </nav>
      </header>

      <main className="app-main">{tab === "rango" ? <RangoScreen /> : <HistorialScreen />}</main>
    </div>
  );
}
