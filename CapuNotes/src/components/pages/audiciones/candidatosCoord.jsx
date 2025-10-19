// src/components/pages/audiciones/candidatosCoord.jsx
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
import { horaToMinutes } from "@/components/common/datetime.js";
import InscripcionView from "@/components/common/InscripcionView.jsx";
import { info as alertInfo, success } from "@/utils/alerts.js";
import { TURNO_ESTADOS } from "@/constants/candidatos.js";

import CanceladoIcon from "@/assets/icons/turno/CanceladoIcon.jsx";
import ReservadoIcon from "@/assets/icons/turno/ReservadoIcon.jsx";
import DisponibleIcon from "@/assets/icons/turno/DisponibleIcon.jsx";

import TurnoEstadoModal from "./TurnoEstadoModal.jsx";

export default function CandidatosCoordPage() {
  const { audicionId } = useParams(); // <- /audiciones/:audicionId/coordinadores
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [selectedDia, setSelectedDia] = useState(searchParams.get("dia") || "Viernes 14");

  const [sortBy, setSortBy] = useState(null); // 'hora' | 'estado' | 'apynom'
  const [sortDir, setSortDir] = useState("asc");

  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    (async () => {
      // const data = await candidatosService.list({ audicionId, dia: selectedDia });
      const data = await candidatosService.list();
      setRows(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audicionId, selectedDia]);

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

  const estadoCoordinador = (r) => {
    const explicit = String(r?.turnoEstado ?? r?.turno?.estado ?? "").toLowerCase();
    if (TURNO_ESTADOS.includes(explicit)) {
      return explicit === "disponible"
        ? "Disponible"
        : explicit === "reservado"
        ? "Reservado"
        : "Cancelado";
    }
    const estRes = String(r?.resultado?.estado || "").toLowerCase();
    if (estRes === "cancelado" || estRes === "cancelada") return "Cancelado";
    const tieneCandidato = !!(r?.nombre || r?.apellido || r?.inscripcion);
    return tieneCandidato ? "Reservado" : "Disponible";
  };

  const filtered = useMemo(() => {
    const base = rows; // si filtrás por backend, ya vendría filtrado por día
    if (!q) return base;
    const t = q.toLowerCase();
    return base.filter((r) => {
      const apynom = nombreApynom(r).toLowerCase();
      const cancion = String(r.cancion || "").toLowerCase();
      const estado = estadoCoordinador(r).toLowerCase();
      return apynom.includes(t) || cancion.includes(t) || estado.includes(t);
    });
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "hora") return (horaToMinutes(a.hora) - horaToMinutes(b.hora)) * dir;
      if (sortBy === "estado") return estadoCoordinador(a).localeCompare(estadoCoordinador(b)) * dir;
      if (sortBy === "apynom") {
        return nombreApynom(a).toLowerCase().localeCompare(nombreApynom(b).toLowerCase()) * dir;
      }
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => { if (sortBy !== key) { setSortBy(key); setSortDir("asc"); } else { setSortDir((d) => (d === "asc" ? "desc" : "asc")); } };
  const thClass = (key) => (sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable");

  const TurnoIcon = ({ estado }) => {
    const e = String(estado || "").toLowerCase();
    if (e === "cancelado")  return <span className="icon-estado icon-turno--cancel icon-md" title="Cancelado"><CanceladoIcon /></span>;
    if (e === "reservado")  return <span className="icon-estado icon-turno--res icon-md" title="Reservado"><ReservadoIcon /></span>;
    return <span className="icon-estado icon-turno--disp icon-md" title="Disponible"><DisponibleIcon /></span>;
  };

  const handleOpenInscripcion = async (r) => {
    if (!r?.inscripcion) {
      await alertInfo({ title: "Sin inscripción", text: "Este turno no tiene inscripción asignada." });
      return;
    }
    setViewRow(r);
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
          <h1 className="abmc-title">Candidatos (Coordinadores)</h1>
          <p style={{margin: 0, opacity: .8}}>Audición ID: <code>{audicionId || '—'}</code></p>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por apellido, estado o canción"
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

              <th className={thClass("estado")}>
                <span className="th-label">Estado</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("estado")} aria-label="Ordenar por Estado">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th style={{ textAlign: "center" }}><span className="th-label">Inscripción</span></th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => {
              const est = estadoCoordinador(r); // "Disponible"/"Reservado"/"Cancelado"
              const key = est.toLowerCase();
              return (
                <tr key={r.id} className="abmc-row">
                  <td>{r.hora}</td>
                  <td>{nombreApynom(r) || "—"}</td>
                  <td>{r.cancion || "—"}</td>

                  <td className="cell-right-action">
                    <TurnoIcon estado={key} />
                    <button
                      type="button"
                      className="btn-accion btn-accion--icon right-action"
                      title="Editar estado"
                      aria-label="Editar estado"
                      onClick={() => setEditRow(r)}
                    >
                      <PencilFill size={18} />
                    </button>
                  </td>

                  <td className="abmc-actions">
                    <button
                      className="btn-accion"
                      title="Ver inscripción"
                      aria-label="Ver inscripción"
                      onClick={() => handleOpenInscripcion(r)}
                    >
                      <img src={infoIcon} alt="Info" style={{ width: 18, height: 18, opacity: r?.inscripcion ? 1 : .6 }} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p style={{ opacity: 0.7, marginTop: 10 }}>
          Vista de <b>coordinadores</b> • Día: <b>{selectedDia}</b>
        </p>
      </div>

      {viewRow && (
        <InscripcionView
          data={viewRow.inscripcion}
          open={true}
          onClose={() => setViewRow(null)}
          editable={false}
        />
      )}

      {editRow && (
        <TurnoEstadoModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSave={async (estado) => {
            const updated = await candidatosService.updateTurnoEstado(editRow.id, estado);
            if (updated) {
              setRows((prev) => prev.map((r) => (String(r.id) === String(updated.id) ? { ...r, ...updated } : r)));
              await success({ title: "Estado actualizado" });
            }
            setEditRow(null);
          }}
        />
      )}
    </main>
  );
}
