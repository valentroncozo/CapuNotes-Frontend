// src/components/pages/audiciones/candidatosCoord.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import { candidatosService } from "@/services/candidatosService";
import { CANDIDATO_STORAGE_KEY, candidatoEstados, fmtHora } from "@/schemas/candidatos";
import "@/styles/abmc.css";

export default function CandidatosCoordinadores() {
  const [dia, setDia] = useState("Viernes 14");
  const [q, setQ]   = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      // si no hay estado en registros existentes, setear "—"
      const list = await candidatosService.list();
      if (list.some(l => l.estado === undefined)) {
        const updated = list.map(l => ({ ...l, estado: "—" }));
        localStorage.setItem(CANDIDATO_STORAGE_KEY, JSON.stringify(updated));
      }
      setItems(JSON.parse(localStorage.getItem(CANDIDATO_STORAGE_KEY) || "[]"));
    };
    load();
  }, []);

  const filtrados = useMemo(() => {
    if (!q) return items;
    const term = q.toLowerCase();
    return items.filter(it =>
      (it.nombre || "").toLowerCase().includes(term) ||
      (it.cancion || "").toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Candidatos</h1>
        </div>

        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder="Buscar por nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="abmc-select"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            aria-label="Seleccionar día"
            style={{ maxWidth: 220 }}
          >
            <option>Viernes 14</option>
            <option>Sábado 15</option>
            <option>Domingo 16</option>
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Hora</th>
              <th>Nombre</th>
              <th>Canción</th>
              <th>Estado</th>
              <th style={{ textAlign: "center" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr className="abmc-row">
                <td colSpan={5} style={{ textAlign: "center" }}>Sin candidatos</td>
              </tr>
            )}

            {filtrados.map((c) => (
              <tr className="abmc-row" key={c.id}>
                <td style={{ whiteSpace: "nowrap" }}>{fmtHora(c.hora)}</td>
                <td>{c.nombre}</td>
                <td>{c.cancion}</td>
                <td>
                  <span className={`badge-estado ${c.estado === "Cancelado" ? "bad" : c.estado === "Reservado" ? "ok" : "pend"}`}>
                    {c.estado || "—"}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  {/* Botón para abrir formulario (placeholder) */}
                  <button
                    type="button"
                    className="mini-plus-btn"
                    title="Abrir detalle (a implementar)"
                    onClick={() => alert("Abrir detalle (a implementar)")}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <small style={{ opacity: .8 }}>Vista de <b>coordinadores</b>: visualizan <i>Estado</i> (Reservado, Cancelado, …).</small>
      </div>
    </main>
  );
}
