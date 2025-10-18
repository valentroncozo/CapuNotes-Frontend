// src/components/pages/audiciones/historial.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";

import {
  HISTORIAL_AUDICIONES_STORAGE_KEY,
  fmtAudicionLabel,
} from "@/schemas/audicionesHistorial";
import { audicionesHistorialService } from "@/services/audicionesHistorialService";

// Datos de ejemplo (se guardan 1 sola vez si no hay registros)
const seed = [
  {
    nombre: "Juan Perez",
    audicion: "Marzo 2023",
    cancion: "Canción – Autor",
    resultado: "Aprobado",
  },
  {
    nombre: "Juan Perez",
    audicion: "Abril 2024",
    cancion: "Canción – Autor",
    resultado: "Observado",
  },
];

export default function HistorialAudiciones() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const exists = JSON.parse(localStorage.getItem(HISTORIAL_AUDICIONES_STORAGE_KEY) || "[]");
      if (!exists.length) {
        for (const s of seed) await audicionesHistorialService.create(s);
      }
      const list = await audicionesHistorialService.list();
      setItems(list);
    };
    init();
  }, []);

  const filtrados = useMemo(() => {
    if (!q) return items;
    const t = q.toLowerCase();
    return items.filter(
      (r) =>
        (r.nombre || "").toLowerCase().includes(t) ||
        (r.cancion || "").toLowerCase().includes(t) ||
        (r.audicion || "").toLowerCase().includes(t)
    );
  }, [items, q]);

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Historial de audiciones</h1>
        </div>

        {/* Buscador */}
        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder="Buscar por nombre de candidatos"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Nombre</th>
              <th>Audición</th>
              <th>Canción</th>
              <th>Resultado</th>
              <th style={{ textAlign: "center" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr className="abmc-row">
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Sin registros
                </td>
              </tr>
            )}

            {filtrados.map((r) => (
              <tr className="abmc-row" key={r.id}>
                <td>{r.nombre}</td>
                <td>{fmtAudicionLabel(r.audicion)}</td>
                <td>{r.cancion}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => alert(`Ver resultado de ${r.nombre} (${r.audicion})`)}
                  >
                    Ver
                  </button>
                </td>
                <td style={{ textAlign: "center" }}>
                  {/* Botón + (placeholder para abrir detalle / adjuntar) */}
                  <button
                    type="button"
                    className="mini-plus-btn"
                    title="Agregar/adjuntar (a implementar)"
                    onClick={() => alert("Abrir acción extra (a implementar)")}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
