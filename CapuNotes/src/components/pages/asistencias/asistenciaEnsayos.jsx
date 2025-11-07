import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensayosService } from "@/services/ensayosService.js";
import { asistenciasService } from "@/services/asistenciasService.js"; 
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";

export default function AsistenciaEnsayos() {
  const [rows, setRows] = useState([]);
  // selectedMonth: bound to the month picker input (yyyy-mm)
  // appliedMonth: the month currently applied to the filter (yyyy-mm)
  const [selectedMonth, setSelectedMonth] = useState("");
  const [appliedMonth, setAppliedMonth] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // 🔹 Cargar lista de ensayos al montar
  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        // La lista principal se obtiene de ensayosService (devuelve /api/eventos)
        const data = await ensayosService.list();
        // Filtrar SOLO los eventos que son tipo ENSAYO y normalizar campos esperados por esta pantalla
        const ensayos = (Array.isArray(data) ? data : [])
          .filter((e) => String(e.tipoEvento || e.tipo || '').toUpperCase() === 'ENSAYO')
          .map((e) => {
            // fechaInicio viene como YYYY-MM-DD, convertimos a DD/MM/YYYY para visual
            const fechaIso = e.fechaInicio || e.fecha || null;
            let fecha = fechaIso;
            if (fechaIso) {
              const parts = fechaIso.split('-');
              if (parts.length === 3) fecha = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return {
              id: e.id,
              fecha,
              fechaInicio: fechaIso,
              descripcion: e.nombre || e.descripcion || '',
              estadoAsistencia: e.estadoAsistencia || e.estado || (e.asistencias ? 'CERRADA' : 'ABIERTA'),
            };
          });

        setRows(ensayos);
      } catch (error) {
        console.error("❌ Error cargando ensayos:", error);
      }
    };
    fetchEnsayos();
  }, []);

  // 🔹 Filtro por mes (selección por usuario + botón Buscar)
  const filtered = useMemo(() => {
    if (appliedMonth) {
      // appliedMonth tiene formato yyyy-mm (desde input type=month)
      return rows.filter((r) => {
        if (r.fechaInicio) return r.fechaInicio.startsWith(appliedMonth);
        // Fallback: r.fecha es dd/mm/yyyy -> construir yyyy-mm para comparar
        if (r.fecha) {
          const parts = (r.fecha || '').split('/'); // [dd,mm,yyyy]
          if (parts.length === 3) {
            const mm = parts[1];
            const yyyy = parts[2];
            return `${yyyy}-${mm}` === appliedMonth;
          }
        }
        return false;
      });
    }
    return rows;
  }, [rows, appliedMonth]);

  // 🔹 Cambiar estado de asistencia (abrir/cerrar)
  const toggleAsistencia = async (ensayo) => {
    if (loadingId === ensayo.id) return; 
    setLoadingId(ensayo.id);

    try {
      // 🛑 CAMBIO 2: Usamos asistenciasService para cerrar/reabrir
      if (ensayo.estadoAsistencia === "ABIERTA") {
        await asistenciasService.cerrarAsistencia(ensayo.id);
        setRows((prev) =>
          prev.map((r) =>
            r.id === ensayo.id ? { ...r, estadoAsistencia: "CERRADA" } : r
          )
        );
      } else {
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

        {/* 🔹 Filtro por mes (se aplica al presionar Buscar) */}
        <div className="abmc-topbar" style={{ alignItems: 'center', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>Mes:</span>
            <input
              type="month"
              className="abmc-input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Seleccionar mes"
            />
          </label>

          <button
            className="btn btn-primary"
            onClick={() => setAppliedMonth(selectedMonth)}
            disabled={!selectedMonth}
          >
            Buscar
          </button>

          <button
            className="btn btn-secondary"
            style={{ marginLeft: 8 }}
            onClick={() => { setSelectedMonth(""); setAppliedMonth(""); }}
          >
            Limpiar
          </button>
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