// src/components/pages/audiciones/candidatosCoord.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import { PencilFill } from "react-bootstrap-icons";

import { audicionesService } from "@/services/audicionesService.js";
import { horaToMinutes } from "@/components/common/datetime.js";
import InscripcionView from "@/components/common/InscripcionView.jsx";
import { info as alertInfo, success } from "@/utils/alerts.js";
import { TURNO_ESTADOS } from "@/constants/candidatos.js";

import CanceladoIcon from "@/assets/icons/turno/CanceladoIcon.jsx";
import ReservadoIcon from "@/assets/icons/turno/ReservadoIcon.jsx";
import DisponibleIcon from "@/assets/icons/turno/DisponibleIcon.jsx";

import InfoIcon from "@/assets/InfoIcon.jsx";

export default function CandidatosCoord() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [dias, setDias] = useState([]);
  const [diaSel, setDiaSel] = useState("-");

  const [sortBy, setSortBy] = useState(null); // 'hora' | 'estado' | 'apynom'
  const [sortDir, setSortDir] = useState("asc");

  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);

  const [sp] = useSearchParams();

  useEffect(() => {
    (async () => {
      const ds = await audicionesService.listDias();
      setDias(ds);
      const qp = sp.get("dia");
      const inicial = (qp && ds.includes(qp)) ? qp : "-";
      setDiaSel(inicial);

      if (inicial !== "-") {
        const t = await audicionesService.listTurnos(inicial);
        setRows(t);
      } else {
        const all = (await Promise.all(ds.map(d => audicionesService.listTurnos(d)))).flat();
        setRows(all);
      }
    })();
  }, [sp]);

  const nombreApynom = (r) => {
    const rawApe = (r.apellido ?? "").trim();
    const rawNom = (r.nombre ?? "").trim();
    const ape = rawApe || "";
    const nom = rawNom || "";
    const isDashApe = ape === "-";
    const isDashNom = nom === "-";
    if ((ape && !isDashApe) && (nom && !isDashNom)) return `${ape}, ${nom}`;
    if ((ape && !isDashApe) && (!nom || isDashNom)) return ape;
    if ((nom && !isDashNom) && (!ape || isDashApe)) return nom;
    return "–"; // ambos son "-" o vacíos
  };

  const estadoCoordinador = (r) => {
    const explicit = String(r?.turnoEstado ?? r?.turno?.estado ?? "").toLowerCase();
    if (TURNO_ESTADOS.includes(explicit)) {
      return explicit === "disponible" ? "Disponible" : explicit === "reservado" ? "Reservado" : "Cancelado";
    }
    const tieneCandidato = !!(r?.nombre && r?.nombre !== "-" || r?.apellido && r?.apellido !== "-" || r?.inscripcion);
    return tieneCandidato ? "Reservado" : "Disponible";
  };

  useEffect(() => {
    (async () => {
      if (diaSel === "-") {
        const all = (await Promise.all(dias.map(d => audicionesService.listTurnos(d)))).flat();
        setRows(all);
      } else {
        const t = await audicionesService.listTurnos(diaSel);
        setRows(t);
      }
    })();
  }, [diaSel, dias]);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => {
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
      if (sortBy === "apynom") return nombreApynom(a).toLowerCase().localeCompare(nombreApynom(b).toLowerCase()) * dir;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => { if (sortBy !== key) { setSortBy(key); setSortDir("asc"); } else { setSortDir((d) => d === "asc" ? "desc" : "asc"); } };
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

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Candidatos (Coordinadores)</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por apellido, estado o canción"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="abmc-input"
            value={diaSel}
            onChange={(e) => setDiaSel(e.target.value)}
            aria-label="Filtrar por día"
          >
            <option value="-">-</option>
            {dias.map(d => <option key={d} value={d}>{d}</option>)}
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
              const est = estadoCoordinador(r);
              const key = est.toLowerCase();
              const hasInscripcion = !!r.inscripcion;
              return (
                <tr key={r.id} className="abmc-row">
                  <td>{r.hora}</td>
                  <td>{nombreApynom(r)}</td>
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
                      className="btn-accion btn-accion--icon"
                      title="Ver inscripción"
                      aria-label="Ver inscripción"
                      onClick={() => handleOpenInscripcion(r)}
                      disabled={!hasInscripcion}
                    >
                      <InfoIcon size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
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

      {editRow && (
        <TurnoEstadoModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSave={async (estado) => {
            const updated = { ...editRow, turnoEstado: estado.toLowerCase() }; // mock
            setRows((prev) => prev.map((x) => (String(x.id) === String(updated.id) ? updated : x)));
            await success({ title: "Estado actualizado" });
            setEditRow(null);
          }}
        />
      )}
    </main>
  );
}
