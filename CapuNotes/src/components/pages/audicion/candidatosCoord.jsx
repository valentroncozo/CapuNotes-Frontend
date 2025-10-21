// src/components/pages/audicion/candidatosCoord.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/icons.css";
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
import TurnoEstadoModal from "./TurnoEstadoModal.jsx";

export default function CandidatosCoordPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [dias, setDias] = useState([]);
  const [diaSel, setDiaSel] = useState("-");
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [sp] = useSearchParams();

  useEffect(() => {
    (async () => {
      const ds = await audicionesService.listDias();
      setDias(ds);
      const qp = sp.get("dia");
      const inicial = qp && ds.includes(qp) ? qp : "-";
      setDiaSel(inicial);

      if (inicial !== "-") {
        const t = await audicionesService.listTurnos(inicial);
        setRows(t);
      } else {
        const all = (await Promise.all(ds.map((d) => audicionesService.listTurnos(d)))).flat();
        setRows(all);
      }
    })();
  }, [sp]);

  const nombreApynom = (r) => {
    const ape = (r.apellido || "").trim();
    const nom = (r.nombre || "").trim();
    if (ape && nom) return `${ape}, ${nom}`;
    return nom || ape || "–";
  };

  const estadoCoordinador = (r) => {
    const explicit = String(r?.turnoEstado || r?.turno?.estado || "").toLowerCase();
    if (TURNO_ESTADOS.includes(explicit)) {
      if (explicit === "disponible") return "Disponible";
      if (explicit === "reservado") return "Reservado";
      return "Cancelado";
    }
    const tieneCandidato = !!(r?.nombre && r?.nombre !== "-" || r?.apellido && r?.apellido !== "-");
    return tieneCandidato ? "Reservado" : "Disponible";
  };

  useEffect(() => {
    (async () => {
      if (diaSel === "-") {
        const all = (await Promise.all(dias.map((d) => audicionesService.listTurnos(d)))).flat();
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
    return rows.filter((r) =>
      `${nombreApynom(r)} ${estadoCoordinador(r)}`.toLowerCase().includes(t)
    );
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "hora") return (horaToMinutes(a.hora) - horaToMinutes(b.hora)) * dir;
      if (sortBy === "estado") return estadoCoordinador(a).localeCompare(estadoCoordinador(b)) * dir;
      if (sortBy === "apynom") return nombreApynom(a).localeCompare(nombreApynom(b)) * dir;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy !== key) setSortBy(key), setSortDir("asc");
    else setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };
  const thClass = (key) =>
    sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable";

  const TurnoIcon = ({ estado }) => {
    const e = String(estado || "").toLowerCase();
    if (e === "cancelado")
      return (
        <span className="icon-estado icon-turno--cancel icon-md" title="Cancelado">
          <CanceladoIcon />
        </span>
      );
    if (e === "reservado")
      return (
        <span className="icon-estado icon-turno--res icon-md" title="Reservado">
          <ReservadoIcon />
        </span>
      );
    return (
      <span className="icon-estado icon-turno--disp icon-md" title="Disponible">
        <DisponibleIcon />
      </span>
    );
  };

  const handleOpenInscripcion = async (r) => {
    if (!r?.inscripcion) {
      await alertInfo({
        title: "Sin inscripción",
        text: "Este turno no tiene inscripción asignada.",
      });
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
            placeholder="Buscar por apellido o estado"
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
              <th
                className={thClass("estado")}
                onClick={() => toggleSort("estado")}
              >
                Estado
              </th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r) => {
              const est = estadoCoordinador(r);
              return (
                <tr key={r.id}>
                  <td>{r.hora}</td>
                  <td>{nombreApynom(r)}</td>
                  <td>
                    <TurnoIcon estado={est.toLowerCase()} /> {est}
                  </td>
                  <td className="abmc-actions">
                    <button
                      className="abmc-btn abmc-btn-icon"
                      title="Editar estado"
                      onClick={() => setEditRow(r)}
                    >
                      <PencilFill />
                    </button>
                    <button
                      className="abmc-btn abmc-btn-icon"
                      title="Ver inscripción"
                      onClick={() => handleOpenInscripcion(r)}
                      disabled={!r.inscripcion}
                    >
                      <InfoIcon />
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
            const updated = { ...editRow, turnoEstado: estado.toLowerCase() };
            setRows((prev) =>
              prev.map((x) => (String(x.id) === String(updated.id) ? updated : x))
            );
            await success({ title: "Estado actualizado" });
            setEditRow(null);
          }}
        />
      )}
    </main>
  );
}
