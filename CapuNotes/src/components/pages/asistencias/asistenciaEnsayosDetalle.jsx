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

        <div style={{ borderBottom: "2px solid rgba(200,140,40,0.6)", margin: "0 1rem" }} />

        <div style={{ padding: "1.5rem 2rem" }}>
          <table className="abmc-table abmc-table-rect">
            <thead className="abmc-thead">
              <tr className="abmc-row">
                <th style={{ width: "60%" }}>
                  <span className="th-label">Miembros</span>
                </th>
                <th style={{ textAlign: "center" }}>
                  <span className="th-label">Asistencia</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr className="abmc-row" key={m.id}>
                  <td>{m.nombre}</td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-flex", gap: 12 }}>
                      <button
                        className="btn"
                        style={{
                          background: m.asistencia === "no" ? "#f0a500" : "transparent",
                          borderRadius: 999,
                          width: 40,
                          height: 40,
                          color: m.asistencia === "no" ? "#fff" : "#fff",
                          border: m.asistencia === "no" ? "2px solid #f0a500" : "2px solid rgba(255,255,255,0.15)",
                        }}
                        onClick={() => handleSetAsistencia(m.id, "no")}
                        aria-pressed={m.asistencia === "no"}
                        title="Ausente">
                        ✖
                      </button>

                      <button
                        className="btn"
                        style={{
                          background: m.asistencia === "half" ? "#f0a500" : "transparent",
                          borderRadius: 999,
                          width: 40,
                          height: 40,
                          color: m.asistencia === "half" ? "#fff" : "#fff",
                          border: m.asistencia === "half" ? "2px solid #f0a500" : "2px solid rgba(255,255,255,0.15)",
                        }}
                        onClick={() => handleSetAsistencia(m.id, "half")}
                        aria-pressed={m.asistencia === "half"}
                        title="Medio">
                        ½
                      </button>

                      <button
                        className="btn"
                        style={{
                          background: m.asistencia === "yes" ? "#f0a500" : "transparent",
                          borderRadius: 999,
                          width: 40,
                          height: 40,
                          color: m.asistencia === "yes" ? "#fff" : "#fff",
                          border: m.asistencia === "yes" ? "2px solid #f0a500" : "2px solid rgba(255,255,255,0.15)",
                        }}
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

          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <button
              className="btn"
              style={{ background: "#f0a500", color: "#fff", borderRadius: 999, padding: "10px 36px" }}
              onClick={handleGuardar}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
