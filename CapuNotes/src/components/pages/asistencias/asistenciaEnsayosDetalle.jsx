import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";

export default function AsistenciaEnsayosDetalle() {
  const navigate = useNavigate();
  const { fecha } = useParams(); // fecha del ensayo (url-encoded)
  const fechaDisplay = fecha ? decodeURIComponent(fecha) : "-";

  // Mock data: in real app, fetch members for the ensayo id
  const [members, setMembers] = useState(() => [
    { id: 1, nombre: "Acuña, Micaela", asistencia: null },
    { id: 2, nombre: "Bottari, Juan Mauro", asistencia: null },
    { id: 3, nombre: "Cantarutti, Ariana", asistencia: null },
    { id: 4, nombre: "Demaria, Francisco", asistencia: null },
    { id: 5, nombre: "Begliardo, Francisco", asistencia: null },
    { id: 6, nombre: "Leyes, Selene", asistencia: null },
    { id: 7, nombre: "Troncozo, Valentina", asistencia: null },
  ]);

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

        <div className="">
          <table className="abmc-table abmc-table-rect">
            <thead className="abmc-thead">
              <tr className="abmc-row">
                <th>
                  <span className="th-label">Miembros</span>
                </th>
                <th>
                  <span className="th-label">Asistencia</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr className="abmc-row" key={m.id}>
                  <td>{m.nombre}</td>
                  <td>
                    <div className="abmc-actions" role="group" aria-label={`asistencia-${m.id}`}>
                      <button
                        className={m.asistencia === "no" ? "btn btn-primary" : "btn btn-secondary"}
                        onClick={() => handleSetAsistencia(m.id, "no")}
                        aria-pressed={m.asistencia === "no"}
                        title="Ausente">
                        ✖
                      </button>

                      <button
                        className={m.asistencia === "half" ? "btn btn-primary" : "btn btn-secondary"}
                        onClick={() => handleSetAsistencia(m.id, "half")}
                        aria-pressed={m.asistencia === "half"}
                        title="Medio">
                        ½
                      </button>

                      <button
                        className={m.asistencia === "yes" ? "btn btn-primary" : "btn btn-secondary"}
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
            <button className="btn-primary btn" onClick={handleGuardar} aria-label="guardar-asistencia">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
