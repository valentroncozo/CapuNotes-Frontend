// src/components/pages/audicion/historial.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import InscripcionView from "@/components/common/InscripcionView.jsx";
import { historialService } from "@/services/historialService.js";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/popup.css";
import InfoIcon from "@/assets/InfoIcon.jsx";
import VerResultadoIcon from "@/assets/icons/VerResultadoIcon.jsx";

export default function HistorialAudicionesPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [viewRow, setViewRow] = useState(null);
  const [verResultado, setVerResultado] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    (async () => {
      const data = await historialService.list();
      setRows(data);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => String(r.nombre || "").toLowerCase().includes(t));
  }, [rows, q]);

  const getAudicionLabel = (r) => {
    const fecha = String(r.fechaAudicion || "").trim();
    const matchYear = fecha.match(/\b(20\d{2}|19\d{2})\b/);
    const anio = matchYear ? matchYear[1] : "—";
    return `${anio} - ${r.diaAudicion || fecha}`;
  };

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "nombre")
        return (
          String(a.nombre || "").localeCompare(String(b.nombre || ""), "es") * dir
        );
      if (sortBy === "audicion")
        return getAudicionLabel(a).localeCompare(getAudicionLabel(b), "es") * dir;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy !== key) setSortBy(key), setSortDir("asc");
    else setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };
  const thClass = (key) =>
    sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable";

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Historial de Audiciones</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead>
            <tr>
              <th className={thClass("nombre")} onClick={() => toggleSort("nombre")}>Nombre</th>
              <th className={thClass("audicion")} onClick={() => toggleSort("audicion")}>Audición</th>
              <th>Canción</th>
              <th style={{ textAlign: "center" }}>Resultado</th>
              <th style={{ textAlign: "center" }}>Inscripción</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{getAudicionLabel(r)}</td>
                <td>{r.cancion || "—"}</td>
                <td className="abmc-actions">
                  <button
                    className="abmc-btn abmc-btn-icon"
                    title="Ver resultado"
                    onClick={() => setVerResultado(r.resultado)}
                  >
                    <VerResultadoIcon />
                  </button>
                </td>
                <td className="abmc-actions">
                  <button
                    className="abmc-btn abmc-btn-icon"
                    title="Ver inscripción"
                    onClick={() => setViewRow(r)}
                  >
                    <InfoIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {verResultado && (
        <div className="pop-backdrop" onMouseDown={() => setVerResultado(null)}>
          <div
            className="pop-dialog"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: 420 }}
          >
            <div className="pop-header">
              <h3 className="pop-title">Resultado</h3>
              <button className="icon-btn" aria-label="Cerrar" onClick={() => setVerResultado(null)}>
                ✕
              </button>
            </div>
            <div className="pop-body">
              <div className="form-grid">
                <div className="field">
                  <label>Estado</label>
                  <input className="input" value={verResultado.estado || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Observaciones</label>
                  <textarea className="input" rows={4} value={verResultado.obs || ""} readOnly disabled />
                </div>
              </div>
            </div>
            <div className="pop-footer" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setVerResultado(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {viewRow && (
        <InscripcionView
          data={viewRow.inscripcion}
          open={true}
          onClose={() => setViewRow(null)}
          editable={false}
        />
      )}
    </main>
  );
}
