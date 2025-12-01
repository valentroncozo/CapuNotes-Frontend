import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensayosService } from "@/services/ensayosService.js";
import { asistenciasService } from "@/services/asistenciasService.js";
import BackButton from "@/components/common/BackButton.jsx";
import Loader from "@/components/common/Loader.jsx";

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
    year: new Date().getFullYear().toString(),
    estado: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const MESES = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  // ===============================================================
  // Cargar ensayos
  // ===============================================================
  const CACHE_KEY = "ensayosActivosCache";


  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        setLoading(true);

        // 1 --- Intentamos cargar desde cache
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          setRows(data);
          setLoading(false);
          return; // no llamamos al backend
        }

        // 2 --- Si no hay cache, llamamos al backend
        const data = await ensayosService.listActivos();

        const base = (Array.isArray(data) ? data : []).filter(
          (e) => e.estado !== "CANCELADO"
        );

        // Pre-procesado
        const preprocesados = base.map((e) => {
          const fechaIso = e.fechaInicio;
          const [y, m, d] = fechaIso.split("-");

          return {
            id: e.id,
            fechaInicio: fechaIso,        // yyyy-mm-dd
            fecha: `${d}/${m}/${y}`,      // dd/mm/yyyy
            nombre: e.nombre ?? "",
            descripcion: e.descripcion ?? "",
            estadoAsistencia: e.estadoAsistencia || "PENDIENTE",
            porcentajeAsistencia: e.porcentajeAsistencia ?? 0,
          };
        });

        // ORDENAMIENTO CORRECTO
        const ordenados = preprocesados.sort((a, b) => {
          const [aY, aM, aD] = a.fechaInicio.split("-").map(Number);
          const [bY, bM, bD] = b.fechaInicio.split("-").map(Number);

          const fechaA = new Date(aY, aM - 1, aD);
          const fechaB = new Date(bY, bM - 1, bD);

          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);

          const esFuturoA = fechaA >= hoy;
          const esFuturoB = fechaB >= hoy;

          // 1) Primero los futuros
          if (esFuturoA && !esFuturoB) return -1;
          if (!esFuturoA && esFuturoB) return 1;

          // 2) En segundo orden, ordenar por fecha real ascendente
          return fechaA - fechaB;
        });


        // 3 --- Guardamos en cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(ordenados));

        // 4 --- Actualizamos estado
        setRows(ordenados);

      } catch (error) {
        console.error("❌ Error cargando ensayos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnsayos();
  }, []);


  // ===============================================================
  // Filtros
  // ===============================================================
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      let coincide = true;

      if (filters.month) {
        coincide = coincide && r.fechaInicio.split("-")[1] === filters.month;
      }
      if (filters.year) {
        coincide = coincide && r.fechaInicio.split("-")[0] === filters.year;
      }
      if (filters.estado) {
        coincide = coincide && r.estadoAsistencia === filters.estado;
      }

      return coincide;
    });
  }, [rows, filters]);

  // ===============================================================
  // Cerrar / Reabrir asistencia
  // ===============================================================
  const toggleAsistencia = async (ensayo) => {
    if (loadingId === ensayo.id) return;

    setLoadingId(ensayo.id);

    try {
      let res;

      if (ensayo.estadoAsistencia === "ABIERTA") {
        res = await asistenciasService.cerrarAsistencia(ensayo.id);
      } else {
        res = await asistenciasService.reabrirAsistencia(ensayo.id);
      }

      console.log("Respuesta del backend:", res);


      // invalidar cache para que la próxima carga sea fresca
      sessionStorage.removeItem(CACHE_KEY);


      setRows((prev) => {
        const updated = prev.map((r) =>
          r.id === ensayo.id
            ? {
              ...r,
              estadoAsistencia: res.estadoAsistencia,
              porcentajeAsistencia: res.porcentajeAsistencia,
            }
            : r
        );

        // Actualizamos también el cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(updated));

        return updated;
      });

    } catch (err) {
      console.error("❌ Error cambiando estado:", err);
    } finally {
      setLoadingId(null);
    }
  };


  // Mes actual por defecto
  useEffect(() => {
    const mesActual = String(new Date().getMonth() + 1).padStart(2, "0");

    setFilters((prev) => ({
      ...prev,
      month: mesActual,
    }));
  }, []);

  // ===============================================================
  // Loader (DEBE IR AQUÍ)
  // ===============================================================
  if (loading) {
    return (
      <main className="abmc-page">
        <div className="abmc-card" style={{ paddingTop: "40px" }}>
          <Loader />
        </div>
      </main>
    );
  }

  // ===============================================================
  // Render
  // ===============================================================
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Asistencia ensayos</h1>
        </div>

        {/* Filtros */}
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
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
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

        {/* Tabla */}
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
                            ? "#1FA453"
                            : r.estadoAsistencia === "CERRADA"
                              ? "#D32F2F"
                              : "#b6b4b4ff",
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

                  <td
                    className="abmc-actions"
                    style={{ justifyContent: "center", gap: "10px" }}
                  >
                    <button
                      className="btn btn-amarillo"
                      title={
                        r.estadoAsistencia === "CERRADA"
                          ? "Ver asistencia"
                          : "Registrar asistencia"
                      }
                      onClick={() => navigate(`/asistencias/ensayos/${r.id}`)}
                    >
                      {r.estadoAsistencia === "CERRADA" ? (
                        <EyeOnIcon fill="var(--text-light)" />
                      ) : (
                        <MakerAsistIcon fill="var(--text-light)" />
                      )}
                    </button>

                    <button
                      className="btn btn-amarillo"
                      style={{ marginLeft: 8 }}
                      disabled={loadingId === r.id}
                      title={
                        loadingId === r.id
                          ? "Procesando..."
                          : r.estadoAsistencia === "ABIERTA"
                            ? "Cerrar asistencia"
                            : r.estadoAsistencia === "CERRADA"
                              ? "Reabrir asistencia"
                              : "Abrir asistencia"
                      }
                      onClick={() => toggleAsistencia(r)}
                    >
                      {loadingId === r.id ? (
                        "..."
                      ) : r.estadoAsistencia === "ABIERTA" ? (
                        <CloseAssistIcon fill="var(--text-light)" />
                      ) : (
                        <OpenAssistIcon fill="var(--text-light)" />
                      )}
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
