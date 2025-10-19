// src/components/pages/audiciones/candidatos.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/icons.css";
import { PencilFill } from "react-bootstrap-icons";
import infoIcon from "/info.png";

import { candidatosService } from "@/services/candidatosService.js";
import { estadoLabel } from "@/constants/candidatos.js";
import { horaToMinutes } from "@/components/common/datetime.js";

import ResultadosModal from "./ResultadosModal.jsx";
import InscripcionView from "@/components/common/InscripcionView.jsx";
import { success } from "@/utils/alerts.js";

/* Íconos de resultado */
import AceptadoIcon from "@/assets/icons/resultado/AceptadoIcon.jsx";
import RechazadoIcon from "@/assets/icons/resultado/RechazadoIcon.jsx";
import AusenteIcon from "@/assets/icons/resultado/AusenteIcon.jsx";
import SinResultadoIcon from "@/assets/icons/resultado/SinResultadoIcon.jsx";

export default function CandidatosPage() {
  const { audicionId } = useParams(); // <- /audiciones/:audicionId/candidatos
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [selectedDia, setSelectedDia] = useState(searchParams.get("dia") || "Viernes 14");

  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [editRow, setEditRow] = useState(null);
  const [viewRow, setViewRow] = useState(null);

  useEffect(() => {
    (async () => {
      // Si el service soporta filtros, pasalos:
      // const data = await candidatosService.list({ audicionId, dia: selectedDia });
      const data = await candidatosService.list();
      setRows(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audicionId, selectedDia]);

  // Sincronizar estado local si viene un cambio externo en la URL
  useEffect(() => {
    const dia = searchParams.get("dia");
    if (dia && dia !== selectedDia) setSelectedDia(dia);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const nombreApynom = (r) => {
    const ape = (r.apellido || "").trim();
    const nom = (r.nombre || "").trim();
    if (ape && nom) return `${ape}, ${nom}`;
    return nom || ape || r.nombre || r.nombreLabel || "";
    };

  const filtered = useMemo(() => {
    // si tu backend filtra por día, esto quedaría innecesario
    const base = rows;
    if (!q) return base;
    const t = q.toLowerCase();
    return base.filter((r) => {
      const ape = String(r.apellido || "").toLowerCase();
      const nom = String(r.nombre || "").toLowerCase();
      const apynom = `${ape}, ${nom}`.trim();
      const label = String(r.nombreLabel || r.nombre || "").toLowerCase();
      return ape.includes(t) || nom.includes(t) || apynom.includes(t) || label.includes(t);
    });
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "hora") return (horaToMinutes(a.hora) - horaToMinutes(b.hora)) * dir;
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
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };
  const thClass = (key) =>
    sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable";

  const ResultadoIcon = ({ estado }) => {
    const e = String(estado || "sin").toLowerCase();
    if (e === "aceptado" || e === "aceptada" || e === "ok")
      return (
        <span className="icon-estado icon-estado--ok icon-md" title="Aceptado">
          <AceptadoIcon />
        </span>
      );
    if (e === "rechazado" || e === "rechazada" || e === "bad")
      return (
        <span className="icon-estado icon-estado--bad icon-md" title="Rechazado">
          <RechazadoIcon />
        </span>
      );
    if (e === "ausente" || e === "pend")
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

  const handleChangeDia = (e) => {
    const nuevo = e.target.value;
    setSelectedDia(nuevo);
    const next = new URLSearchParams(searchParams);
    if (nuevo) next.set("dia", nuevo);
    else next.delete("dia");
    setSearchParams(next);
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Candidatos</h1>
          <p style={{margin: 0, opacity: .8}}>Audición ID: <code>{audicionId || '—'}</code></p>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por apellido o nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="abmc-input" value={selectedDia} onChange={handleChangeDia} aria-label="Día">
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
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("hora")}
                  aria-label="Ordenar por Hora"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("apynom")}>
                <span className="th-label">Apellido, Nombre</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("apynom")}
                  aria-label="Ordenar por Apellido, Nombre"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th><span className="th-label">Canción</span></th>

              <th className={thClass("resultado")}>
                <span className="th-label">Resultado</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("resultado")}
                  aria-label="Ordenar por Resultado"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th style={{ textAlign: "center" }}>
                <span className="th-label">Inscripción</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="abmc-row">
                <td>{r.hora}</td>
                <td>{nombreApynom(r)}</td>
                <td>{r.cancion}</td>

                <td className="cell-right-action">
                  <ResultadoIcon estado={r.resultado?.estado} />
                  <button
                    type="button"
                    className="btn-accion btn-accion--icon right-action"
                    title="Editar resultado"
                    onClick={() => setEditRow(r)}
                    aria-label="Editar resultado"
                  >
                    <PencilFill size={18} />
                  </button>
                </td>

                <td className="abmc-actions">
                  <button
                    type="button"
                    className="btn-accion btn-accion--icon"
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

        <p style={{ opacity: 0.7, marginTop: 10 }}>
          Vista de <b>evaluadores</b> • Día: <b>{selectedDia}</b>
        </p>
      </div>

      {editRow && (
        <ResultadosModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSave={async (estado, obs) => {
            const res = await candidatosService.updateResultado(editRow.id, { estado, obs });
            setRows((prev) =>
              prev.map((x) => (x.id === res.id ? { ...x, resultado: res.resultado } : x))
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
            const updated = await candidatosService.updateInscripcionCuerda(viewRow.id, nuevaCuerda);
            if (!updated) return;
            setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            await success({ title: "Cuerda actualizada" });
          }}
        />
      )}
    </main>
  );
}
