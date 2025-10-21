// src/components/pages/audicion/candidatos.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/icons.css";
import { PencilFill } from "react-bootstrap-icons";

import { candidatosService } from "@/services/candidatosService.js";
import { audicionesService } from "@/services/audicionesService.js";
import { estadoLabel } from "@/constants/candidatos.js";
import { horaToMinutes } from "@/components/common/datetime.js";

import ResultadosModal from "./ResultadosModal.jsx";
import InscripcionView from "@/components/common/InscripcionView.jsx";
import { success } from "@/utils/alerts.js";

import AceptadoIcon from "@/assets/icons/resultado/AceptadoIcon.jsx";
import RechazadoIcon from "@/assets/icons/resultado/RechazadoIcon.jsx";
import AusenteIcon from "@/assets/icons/resultado/AusenteIcon.jsx";
import SinResultadoIcon from "@/assets/icons/resultado/SinResultadoIcon.jsx";
import InfoIcon from "@/assets/InfoIcon.jsx";

export default function CandidatosPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [dias, setDias] = useState([]);
  const [diaSel, setDiaSel] = useState("-");
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [editRow, setEditRow] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [sp] = useSearchParams();

  useEffect(() => {
    (async () => {
      const [cd, ds] = await Promise.all([
        candidatosService.list(),
        audicionesService.listDias?.() ?? [],
      ]);
      setRows(cd);
      setDias(ds);
      const qp = sp.get("dia");
      if (qp && ds.includes(qp)) setDiaSel(qp);
    })();
  }, [sp]);

  const nombreApynom = (r) => {
    const ape = (r.apellido || "").trim();
    const nom = (r.nombre || "").trim();
    if (ape && nom) return `${ape}, ${nom}`;
    return nom || ape || "";
  };

  const filteredByText = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) =>
      `${r.apellido} ${r.nombre} ${r.cancion}`.toLowerCase().includes(t)
    );
  }, [rows, q]);

  const filtered = useMemo(() => {
    if (diaSel === "-") return filteredByText;
    return filteredByText.filter(
      (r) =>
        String(r?.inscripcion?.diaAudicion || "").trim() ===
        String(diaSel).trim()
    );
  }, [filteredByText, diaSel]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "hora")
        return (horaToMinutes(a.hora) - horaToMinutes(b.hora)) * dir;
      if (sortBy === "resultado") {
        const la = estadoLabel(a.resultado?.estado ?? "sin");
        const lb = estadoLabel(b.resultado?.estado ?? "sin");
        return la.localeCompare(lb) * dir;
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
    if (sortBy !== key) setSortBy(key), setSortDir("asc");
    else setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };
  const thClass = (key) =>
    sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable";

  const ResultadoIcon = ({ estado }) => {
    const e = String(estado || "sin").toLowerCase();
    if (["aceptado", "aceptada", "ok"].includes(e))
      return (
        <span className="icon-estado icon-estado--ok icon-md" title="Aceptado">
          <AceptadoIcon />
        </span>
      );
    if (["rechazado", "rechazada", "bad"].includes(e))
      return (
        <span className="icon-estado icon-estado--bad icon-md" title="Rechazado">
          <RechazadoIcon />
        </span>
      );
    if (["ausente", "pend"].includes(e))
      return (
        <span className="icon-estado icon-estado--pend icon-md" title="Ausente">
          <AusenteIcon />
        </span>
      );
    return (
      <span className="icon-estado icon-estado--sin icon-md" title="Sin resultado">
        <SinResultadoIcon />
      </span>
    );
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Candidatos</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por apellido o nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="abmc-select"
            value={diaSel}
            onChange={(e) => setDiaSel(e.target.value)}
            aria-label="Filtrar por día"
          >
            <option value="-">Todos los días</option>
            {dias.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead>
            <tr>
              <th className={thClass("hora")} onClick={() => toggleSort("hora")}>
                Hora
              </th>
              <th
                className={thClass("apynom")}
                onClick={() => toggleSort("apynom")}
              >
                Apellido, Nombre
              </th>
              <th>Canción</th>
              <th
                className={thClass("resultado")}
                onClick={() => toggleSort("resultado")}
              >
                Resultado
              </th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.hora}</td>
                <td>{nombreApynom(r)}</td>
                <td>{r.cancion}</td>
                <td>
                  <ResultadoIcon estado={r.resultado?.estado} />
                </td>
                <td className="abmc-actions">
                  <button
                    className="abmc-btn abmc-btn-icon"
                    title="Editar resultado"
                    onClick={() => setEditRow(r)}
                  >
                    <PencilFill />
                  </button>
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

        <p style={{ opacity: 0.7, marginTop: 10 }}>
          Vista de <b>evaluadores</b>: pueden asignar <i>Resultado</i> y ajustar
          la <i>Cuerda</i>.
        </p>
      </div>

      {editRow && (
        <ResultadosModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSave={async (estado, obs) => {
            const res = await candidatosService.updateResultado(editRow.id, {
              estado,
              obs,
            });
            setRows((prev) =>
              prev.map((x) =>
                x.id === res.id ? { ...x, resultado: res.resultado } : x
              )
            );
            await success({ title: "Resultado guardado" });
            setEditRow(null);
          }}
        />
      )}

      {viewRow && (
        <InscripcionView
          data={viewRow.inscripcion}
          open={true}
          onClose={() => setViewRow(null)}
          editable={true}
          onSaveCuerda={async (nuevaCuerda) => {
            const updated = await candidatosService.updateInscripcionCuerda(
              viewRow.id,
              nuevaCuerda
            );
            if (!updated) return;
            setRows((prev) =>
              prev.map((x) => (x.id === updated.id ? updated : x))
            );
            await success({ title: "Cuerda actualizada" });
          }}
        />
      )}
    </main>
  );
}
