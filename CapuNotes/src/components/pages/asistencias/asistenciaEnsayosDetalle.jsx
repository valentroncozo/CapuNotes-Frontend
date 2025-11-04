import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/asistencia.css";

export default function AsistenciaEnsayosDetalle() {
  const navigate = useNavigate();
  const { fecha } = useParams(); // fecha del ensayo (url-encoded)
  const fechaDisplay = fecha ? decodeURIComponent(fecha) : "-";

  // Mock data: in real app, fetch members for the ensayo id
  const [members, setMembers] = useState(() => [
    { id: 1, nombre: "Acuña, Micaela", asistencia: null, cuerda: "Cuerdas" },
    { id: 2, nombre: "Bottari, Juan Mauro", asistencia: null, cuerda: "Vientos" },
    { id: 3, nombre: "Cantarutti, Ariana", asistencia: null, cuerda: "Cuerdas" },
    { id: 4, nombre: "Demaria, Francisco", asistencia: null, cuerda: "Percusión" },
    { id: 5, nombre: "Begliardo, Francisco", asistencia: null, cuerda: "Vientos" },
    { id: 6, nombre: "Leyes, Selene", asistencia: null, cuerda: "Coro" },
    { id: 7, nombre: "Troncozo, Valentina", asistencia: null, cuerda: "Cuerdas" },
  ]);

  const [filterName, setFilterName] = useState("");
  const [filterCuerda, setFilterCuerda] = useState("Todas");

  const cuerdaOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.cuerda).filter(Boolean));
    return ["Todas", ...Array.from(set)];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const name = String(filterName || "").trim().toLowerCase();
    return members.filter((m) => {
      if (filterCuerda && filterCuerda !== "Todas" && m.cuerda !== filterCuerda) return false;
      if (!name) return true;
      return m.nombre.toLowerCase().includes(name);
    });
  }, [members, filterName, filterCuerda]);

  const handleSetAsistencia = (memberId, value) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, asistencia: value } : m)));
  };

  const handleGuardar = () => {
    // Aquí se haría la persistencia: API call o localStorage
    // Por ahora, simplemente volvemos atrás o mostramos un toast
    // Simulamos que guardamos y volvemos a la lista
    navigate(-1);
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Asistencia ensayo {fechaDisplay}</h1>
        </div>

        <div>
          <div className="abmc-topbar">
            <input
              className="abmc-input"
              placeholder="Buscar por nombre"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              aria-label="Buscar por nombre"
            />

            <select
              className="abmc-select"
              value={filterCuerda}
              onChange={(e) => setFilterCuerda(e.target.value)}
              aria-label="Filtrar por cuerda"
            >
              {cuerdaOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <table className="abmc-table abmc-table-rect">
            <thead className="abmc-thead">
              <tr className="abmc-row">
                <th>
                  <span className="th-label">{filterCuerda && filterCuerda !== "Todas" ? `Miembros - ${filterCuerda}` : "Miembros"}</span>
                </th>
                <th>
                  <span className="th-label">Asistencia</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr className="abmc-row" key={m.id}>
                  <td>{m.nombre}</td>
                  <td>
                    <div className="attendance-actions" role="group" aria-label={`asistencia-${m.id}`}>
                      <button
                        className={`attendance-btn ${m.asistencia === "no" ? "selected" : ""}`}
                        onClick={() => handleSetAsistencia(m.id, "no")}
                        aria-pressed={m.asistencia === "no"}
                        title="Ausente">
                        ✖
                      </button>

                      <button
                        className={`attendance-btn ${m.asistencia === "half" ? "selected" : ""}`}
                        onClick={() => handleSetAsistencia(m.id, "half")}
                        aria-pressed={m.asistencia === "half"}
                        title="Medio">
                        ½
                      </button>

                      <button
                        className={`attendance-btn ${m.asistencia === "yes" ? "selected" : ""}`}
                        onClick={() => handleSetAsistencia(m.id, "yes")}
                        aria-pressed={m.asistencia === "yes"}
                        title="Presente">
                        ✓
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pop-footer" style={{ justifyContent: "center" }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              aria-label="cerrar-sin-guardar"
              style={{ marginRight: 8 }}
            >
              Cerrar
            </button>

            <button className="btn-primary btn" onClick={handleGuardar} aria-label="guardar-asistencia">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
