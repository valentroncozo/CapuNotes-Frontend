import React from "react";
import { Link } from "react-router-dom";

export default function Error403() {
  return (
    <main style={{ padding: 24 }}>
      <h1>403 — Prohibido</h1>
      <p>No tiene permisos para acceder a este recurso.</p>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </main>
  );
}