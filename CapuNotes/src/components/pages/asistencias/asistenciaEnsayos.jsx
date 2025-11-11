import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensayosService } from "@/services/ensayosService.js";
import { asistenciasService } from "@/services/asistenciasService.js";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import EyeOnIcon from "@/assets/VisibilityOnIcon";
import MakerAsistIcon from "@/assets/MakerAsistIcon";
import OpenAssistIcon from "@/assets/OpenAssistIcon";
import CloseAssistIcon from "@/assets/CloseAssistIcon";


export default function AsistenciaEnsayos() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear().toString(), // ✅ Año actual por defecto
    estado: "",
  });
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // ===============================================================
  // 🔹 Cargar lista de ensayos
  // ===============================================================
  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        const data = await ensayosService.list();
        const ensayos = (Array.isArray(data) ? data : []).map((e) => {
          const fechaIso = e.fechaInicio || null;
          let fecha = fechaIso;
          if (fechaIso) {
            const parts = fechaIso.split("-");
            if (parts.length === 3) fecha = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return {
            id: e.id,
            fecha,
            fechaInicio: fechaIso,
            nombre: e.nombre || "",
            descripcion: e.descripcion || "",
            estadoAsistencia: e.estadoAsistencia || "PENDIENTE",
            porcentajeAsistencia: e.porcentajeAsistencia ?? 0,
          };
        });

        // 🔹 Ordenar: próximos primero (por fecha), luego pasados
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const ordenados = [...ensayos].sort((a, b) => {
          // 🔧 crear fechas en hora local (sin UTC)
          const [aY, aM, aD] = a.fechaInicio.split("-").map(Number);
          const [bY, bM, bD] = b.fechaInicio.split("-").map(Number);

          const fechaA = new Date(aY, aM - 1, aD);
          const fechaB = new Date(bY, bM - 1, bD);

          const esFuturoA = fechaA >= hoy;
          const esFuturoB = fechaB >= hoy;

          if (esFuturoA && !esFuturoB) return -1;
          if (!esFuturoA && esFuturoB) return 1;

          return fechaA - fechaB;
        });


        setRows(ordenados);
      } catch (error) {
        console.error("❌ Error cargando ensayos:", error);
      }
    };
    fetchEnsayos();
  }, []);

  // ===============================================================
  // 🔹 Filtrar por mes / año / estado
  // ===============================================================
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      let coincide = true;

      if (filters.month && r.fechaInicio) {
        coincide = coincide && r.fechaInicio.split("-")[1] === filters.month;
      }
      if (filters.year && r.fechaInicio) {
        coincide = coincide && r.fechaInicio.split("-")[0] === filters.year;
      }
      if (filters.estado) {
        coincide = coincide && r.estadoAsistencia === filters.estado;
      }

      return coincide;
    });
  }, [rows, filters]);

  // ===============================================================
  // 🔹 Cambiar estado de asistencia (cerrar / reabrir)
  // ===============================================================
  const toggleAsistencia = async (ensayo) => {
    if (loadingId === ensayo.id) return;
    setLoadingId(ensayo.id);

    try {
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
      console.error("❌ Error al cambiar estado de asistencia:", err?.response || err);
    } finally {
      setLoadingId(null);
    }
  };

  // ===============================================================
  // 🔹 Render
  // ===============================================================
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <div>
            <h1 className="abmc-title">Asistencia ensayos</h1>
            <div></div>
          </div>
        </div>

        {/* 🔹 Filtros */}
        <div
          className="filtros"
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            justifyContent: "center",
          }}
        >
          <select
            className="abmc-input"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="">Mes</option>
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={String(m + 1).padStart(2, "0")}>
                {new Date(0, m).toLocaleString("es-AR", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            className="abmc-input"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            {[2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            className="abmc-input"
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="ABIERTA">Abierta</option>
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>

        {/* 🔹 Tabla */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>%</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay ensayos que coincidan.</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="abmc-row">
                  <td>{r.fecha}</td>
                  <td title={r.descripcion}>{r.nombre}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          r.estadoAsistencia === "ABIERTA"
                            ? "#1FA453" // 💚 Verde intenso
                            : r.estadoAsistencia === "CERRADA"
                              ? "#D32F2F" // 🔴 Rojo fuerte
                              : "#b6b4b4ff", // Gris para pendiente
                        color: "var(--text-light)",
                        padding: "0.4rem 0.6rem",
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      {r.estadoAsistencia}
                    </span>
                  </td>
                  <td>{r.porcentajeAsistencia ?? 0}%</td>
                  <td className="abmc-actions" style={{justifyContent: 'space-between'}}>
                    <button
                      className="btn btn-amarillo"
                      onClick={() => navigate(`/asistencias/ensayos/${r.id}`)}
                      title={r.estadoAsistencia === "CERRADA" ? 'Ver resumen' : 'Tomar asistencia'}
                    >
                      {r.estadoAsistencia === "CERRADA"
                        ? <EyeOnIcon fill='var(--text-light)' />
                        : <MakerAsistIcon fill='var(--text-light)'/>
                      }
                    </button>

                    <button
                      className="btn btn-amarillo"
                      style={{ marginLeft: 8 }}
                      disabled={loadingId === r.id}
                      onClick={() => toggleAsistencia(r)}
                      title={r.estadoAsistencia === "ABIERTA" ? 'Cerrar asistencia' : 'Reabrir asistencia'}
                    >
                      {loadingId === r.id
                        ? "..."
                        : r.estadoAsistencia === "ABIERTA"
                          ? <CloseAssistIcon fill='var(--text-light)' />
                          : <OpenAssistIcon fill='var(--text-light)' />}
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
