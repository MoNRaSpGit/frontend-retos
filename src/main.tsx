import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RetosApp } from "./features/retos/RetosApp";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RetosApp />
  </StrictMode>
);
