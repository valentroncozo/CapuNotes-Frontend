// src/components/pages/audiciones/candidatosCoord.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import infoIcon from "/info.png";

import { candidatosService } from "@/services/candidatosService.js";
import { estadoLabel } from "@/constants/candidatos.js";
import { horaToMinutes } from "@/components/common/datetime.js";
import InscripcionView from "@/components/common/InscripcionView.jsx";

export default function CandidatosCoordPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [sortBy, setSortBy] = useState(null); // 'hora' | 'resultado' | 'apynom'
  const [sortDir, setSortDir] = useState("asc");

  const [viewRow, setViewRow] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await candidatosService.list();
      setRows(data);
    })();
  }, []);

  const nombreApynom = (r) => {
    const ape = (r.apellido || "").trim();
    const nom = (r.nombre || "").trim();
    if (ape && nom) return `${ape}, ${nom}`;
    return nom || ape || r.nombre || "";
  };

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => {
      const ape = String(r.apellido || "").toLowerCase();
      const nom = String(r.nombre || "").toLowerCase();
      const apynom = `${ape}, ${nom}`.trim();
      return ape.includes(t) || nom.includes(t) || apynom.includes(t);
    });
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "hora") return (horaToMinutes(a.hora) - horaToMinutes(b.hora)) * dir;
      if (sortBy === "resultado") {
        return estadoLabel(a.resultado?.estado ?? "sin")
          .localeCompare(estadoLabel(b.resultado?.estado ?? "sin")) * dir;
      }
      if (sortBy === "apynom") {
        const av = nombreApynom(a).toLowerCase();
        const bv = nombreApynom(b).toLowerCase();
        return av.localeCompare(bv) * dir;
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
          <h1 className="abmc-title">Candidatos (Coordinadores)</h1>
        </div>

        <div className="abmc-topbar">
          <input className="abmc-input" placeholder="Buscar por apellido o nombre" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="abmc-input" defaultValue="Viernes 14">
            <option>Viernes 14</option>
            <option>Sábado 15</option>
            <option>Domingo 16</option>
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("hora")}>
                <span className="th-label">Hora</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("hora")} aria-label="Ordenar por Hora">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("apynom")}>
                <span className="th-label">Apellido, Nombre</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("apynom")} aria-label="Ordenar por Apellido, Nombre">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th><span className="th-label">Canción</span></th>

              <th className={thClass("resultado")}>
                <span className="th-label">Estado</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("resultado")} aria-label="Ordenar por Estado">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>
              <th style={{ textAlign: "center" }}><span className="th-label">Inscripción</span></th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="abmc-row">
                <td>{r.hora}</td>
                <td>{nombreApynom(r)}</td>
                <td>{r.cancion}</td>
                <td>{estadoLabel(r.resultado?.estado)}</td>
                <td className="abmc-actions">
                  <button
                    className="btn-accion"
                    title="Ver inscripción"
                    aria-label="Ver inscripción"
                    onClick={() => setViewRow(r)}
                  >
                    <img src={infoIcon} alt="Info" style={{ width: 18, height: 18 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
