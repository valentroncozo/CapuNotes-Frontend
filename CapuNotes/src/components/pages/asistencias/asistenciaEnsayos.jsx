import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";

export default function AsistenciaEnsayos() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Mock rows: 'saved' === true means the attendance was persisted and should show "Ver"
  const [rows, setRows] = useState(() => [
    { id: 1, fecha: "27/10/2025", descripcion: "Ensayo general", tomada: true, saved: true },
    { id: 2, fecha: "21/10/2025", descripcion: "Sección cuerdas", tomada: false, saved: false },
    { id: 3, fecha: "14/10/2025", descripcion: "Ensayo rítmico", tomada: false, saved: false },
    { id: 4, fecha: "07/10/2025", descripcion: "Ensayo vocal", tomada: false, saved: false },
    { id: 5, fecha: "01/10/2025", descripcion: "Ensayo general 2", tomada: false, saved: false },
  ]);

  const filtered = useMemo(() => {
    const t = String(q || "").trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) => r.fecha.toLowerCase().includes(t) || r.descripcion.toLowerCase().includes(t));
  }, [rows, q]);

  // Toggle asistencia: mark as tomada but unsaved (saved: false). This keeps UI showing 'Asistencia' until persisted.
  const toggleAsistencia = (id) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (!r.tomada) return { ...r, tomada: true, saved: false };
        return { ...r, tomada: false, saved: false };
      })
    );
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Asistencia ensayos</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por día"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar por día"
          />
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>
                <span className="th-label">Fecha</span>
              </th>
              <th>
                <span className="th-label">Descripción</span>
              </th>
              <th>
                <span className="th-label">Estado</span>
              </th>
              <th aria-hidden="true"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  No hay ensayos que coincidan.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <React.Fragment key={r.id}>
                  <tr className="abmc-row">
                    <td>{r.fecha}</td>
                    <td>{r.descripcion}</td>
                    <td>{r.tomada ? (r.saved ? "Tomada" : "Tomada (sin guardar)") : "No tomada"}</td>
                    <td className="abmc-actions">
                      {/* Only two visible actions: 'Asistencia' when not saved OR not taken, 'Ver' only when tomada && saved */}
                      {r.tomada && r.saved ? (
                        <button
                          className="btn btn-secondary"
                          onClick={() => navigate(`/asistencias/ensayos/${encodeURIComponent(r.fecha)}`)}
                          aria-label={`Ver ensayo ${r.fecha}`}>
                          Ver
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => toggleAsistencia(r.id)}
                          aria-pressed={r.tomada}>
                          Asistencia
                        </button>
                      )}
                    </td>
                  </tr>

                  
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}