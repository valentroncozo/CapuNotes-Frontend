import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";

export default function AsistenciaEnsayos() {
  // qDate holds yyyy-mm-dd from the date picker; we will convert to dd/mm/yyyy for matching rows
  const [qDate, setQDate] = useState("");
  const navigate = useNavigate();

  // Mock rows: 'saved' === true means the attendance was persisted and should show "Ver"
  const [rows, setRows] = useState(() => [
    { id: 1, fecha: "27/10/2025", descripcion: "Ensayo general", tomada: true, saved: true, clicked: false },
    { id: 2, fecha: "21/10/2025", descripcion: "Sección cuerdas", tomada: false, saved: false, clicked: false },
    { id: 3, fecha: "14/10/2025", descripcion: "Ensayo rítmico", tomada: false, saved: false, clicked: false },
    { id: 4, fecha: "07/10/2025", descripcion: "Ensayo vocal", tomada: false, saved: false, clicked: false },
    { id: 5, fecha: "01/10/2025", descripcion: "Ensayo general 2", tomada: false, saved: false, clicked: false },
  ]);

  const filtered = useMemo(() => {
    // if date selected, convert yyyy-mm-dd -> dd/mm/yyyy and filter by exact match on fecha
    if (qDate) {
      const [y, m, d] = qDate.split("-");
      const formatted = `${d}/${m}/${y}`;
      return rows.filter((r) => r.fecha === formatted);
    }
    // no date selected: show all
    return rows;
  }, [rows, qDate]);

  // Toggle asistencia: mark as tomada but unsaved (saved: false). This keeps UI showing 'Asistencia' until persisted.
  const toggleAsistencia = (id) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        // mark as clicked on first interaction and keep clicked=true afterwards
        if (!r.tomada) return { ...r, tomada: true, saved: false, clicked: true };
        return { ...r, tomada: false, saved: false, clicked: true };
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
            type="date"
            className="abmc-input"
            value={qDate}
            onChange={(e) => setQDate(e.target.value)}
            aria-label="Seleccionar fecha"
          />
          {qDate && (
            <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setQDate("")}>
              Borrar
            </button>
          )}
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
                          className={r.clicked ? "btn btn-primary" : "btn btn-secondary"}
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