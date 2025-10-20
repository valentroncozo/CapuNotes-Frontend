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
  const [verResultado, setVerResultado] = useState(null); // {estado, obs}

  // 'nombre' | 'fechaAudicion' | 'anio'
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    (async () => {
      const data = await historialService.list();
      setRows(data);
    })();
  }, []);

  const getAnio = (label) => {
    const m = String(label || "").match(/\b(20\d{2}|19\d{2})\b/);
    return m ? m[1] : "";
  };

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => String(r.nombre || "").toLowerCase().includes(t));
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "nombre") {
        return String(a.nombre || "").toLowerCase()
          .localeCompare(String(b.nombre || "").toLowerCase()) * dir;
      }
      if (sortBy === "fechaAudicion") {
        return String(a.fechaAudicion || "").toLowerCase()
          .localeCompare(String(b.fechaAudicion || "").toLowerCase()) * dir;
      }
      if (sortBy === "anio") {
        return getAnio(a.fechaAudicion).localeCompare(getAnio(b.fechaAudicion)) * dir;
      }
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy !== key) { setSortBy(key); setSortDir("asc"); }
    else { setSortDir((d) => (d === "asc" ? "desc" : "asc")); }
  };
  const thClass = (key) => (sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable");

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Historial de audiciones</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por nombre de candidatos"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("nombre")}>
                <span className="th-label">Nombre</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("nombre")} aria-label="Ordenar por Nombre">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("fechaAudicion")}>
                <span className="th-label">Audición</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("fechaAudicion")} aria-label="Ordenar por Audición">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("anio")}>
                <span className="th-label">Año</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("anio")} aria-label="Ordenar por Año">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th><span className="th-label">Canción</span></th>
              <th style={{ textAlign: "center" }}><span className="th-label">Resultado</span></th>
              <th style={{ textAlign: "center" }}><span className="th-label">Inscripción</span></th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="abmc-row">
                <td>{r.nombre}</td>
                <td>{r.fechaAudicion}</td>
                <td>{getAnio(r.fechaAudicion) || "—"}</td>
                <td>{r.cancion}</td>

                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn-accion btn-accion--icon"
                    onClick={() => setVerResultado(r.resultado)}
                    title="Ver resultado"
                    aria-label="Ver resultado"
                  >
                    <VerResultadoIcon />
                  </button>
                </td>

                <td className="abmc-actions">
                  <button
                    className="btn-accion btn-accion--icon"
                    title="Ver inscripción"
                    onClick={() => setViewRow(r)}
                    aria-label="Ver inscripción"
                  >
                    <InfoIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {verResultado && (
        <div className="pop-backdrop" onMouseDown={() => setVerResultado(null)}>
          <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="pop-header">
              <h3 className="pop-title">Resultado</h3>
              <button className="icon-btn" aria-label="Cerrar" onClick={() => setVerResultado(null)}>✕</button>
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
              <button className="btn btn-secondary" onClick={() => setVerResultado(null)}>Cerrar</button>
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
