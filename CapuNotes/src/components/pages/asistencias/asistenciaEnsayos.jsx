import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensayosService } from "@/services/ensayosService.js";
import { asistenciasService } from "@/services/asistenciasService.js";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";

export default function AsistenciaEnsayos() {
  const [rows, setRows] = useState([]);
  const [qDate, setQDate] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // 🔹 Cargar lista de ensayos al montar
  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        const data = await ensayosService.list();
        setRows(data);
      } catch (error) {
        console.error("❌ Error cargando ensayos:", error);
      }
    };
    fetchEnsayos();
  }, []);

  // 🔹 Filtro por fecha
  const filtered = useMemo(() => {
    if (qDate) {
      const [y, m, d] = qDate.split("-");
      const formatted = `${d}/${m}/${y}`;
      return rows.filter((r) => r.fecha === formatted);
    }
    return rows;
  }, [rows, qDate]);

  // 🔹 Cambiar estado de asistencia (abrir/cerrar)
  const toggleAsistencia = async (ensayo) => {
    if (loadingId === ensayo.id) return; // evitar doble click
    setLoadingId(ensayo.id);

    try {
      if (ensayo.estadoAsistencia === "ABIERTA") {
        // Cerrar asistencia
        await asistenciasService.cerrarAsistencia(ensayo.id);
        setRows((prev) =>
          prev.map((r) =>
            r.id === ensayo.id ? { ...r, estadoAsistencia: "CERRADA" } : r
          )
        );
      } else {
        // Reabrir asistencia
        await asistenciasService.reabrirAsistencia(ensayo.id);
        setRows((prev) =>
          prev.map((r) =>
            r.id === ensayo.id ? { ...r, estadoAsistencia: "ABIERTA" } : r
          )
        );
      }
    } catch (err) {
      console.error("❌ Error al cambiar estado de asistencia:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Asistencia a ensayos</h1>
        </div>

        {/* 🔹 Filtro por fecha */}
        <div className="abmc-topbar">
          <input
            type="date"
            className="abmc-input"
            value={qDate}
            onChange={(e) => setQDate(e.target.value)}
            aria-label="Seleccionar fecha"
          />
          {qDate && (
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 8 }}
              onClick={() => setQDate("")}
            >
              Borrar
            </button>
          )}
        </div>

        {/* 🔹 Tabla de ensayos */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Estado Asistencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>No hay ensayos que coincidan.</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="abmc-row">
                  <td>{r.fecha}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.estadoAsistencia}</td>
                  <td className="abmc-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/asistencias/ensayos/${r.id}`)}
                    >
                      Ver
                    </button>

                    <button
                      className={
                        r.estadoAsistencia === "ABIERTA"
                          ? "btn btn-danger"
                          : "btn btn-primary"
                      }
                      style={{ marginLeft: 8 }}
                      disabled={loadingId === r.id}
                      onClick={() => toggleAsistencia(r)}
                    >
                      {loadingId === r.id
                        ? "Procesando..."
                        : r.estadoAsistencia === "ABIERTA"
                        ? "Cerrar asistencia"
                        : "Reabrir asistencia"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
