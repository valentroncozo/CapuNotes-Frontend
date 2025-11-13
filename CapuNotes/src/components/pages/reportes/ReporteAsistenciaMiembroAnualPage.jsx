import { useEffect, useState } from "react";
import { reporteAsistenciaMiembroAnualService } from "@/services/reporteAsistenciaMiembroAnualService.js";
import { miembrosService } from "@/services/miembrosService.js";
import BackButton from "@/components/common/BackButton.jsx";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/ReporteAsistenciaMiembroAnual.css";

export default function ReporteAsistenciaMiembroAnualPage() {
  const [miembros, setMiembros] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Cargar miembros activos
  useEffect(() => {
    const cargarMiembros = async () => {
      try {
        const data = await miembrosService.list();
        const activos = data.filter((m) => m.activo);
        setMiembros(activos);
        if (activos.length > 0) setMiembroSeleccionado(activos[0]);
      } catch (err) {
        console.error("❌ Error al cargar miembros:", err);
        setError("No se pudieron cargar los miembros.");
      }
    };
    cargarMiembros();
  }, []);

  // 🔹 Cargar reporte de asistencia
  useEffect(() => {
    if (!miembroSeleccionado) return;
    const fetchReporte = async () => {
      try {
        setLoading(true);
        const { tipoDocumento, nroDocumento } = miembroSeleccionado.id;
        const data =
          await reporteAsistenciaMiembroAnualService.getReporteMiembro(
            tipoDocumento,
            nroDocumento,
            anio
          );
        setReporte(data);
      } catch (err) {
        console.error("❌ Error al cargar el reporte:", err);
        setError("No se pudo cargar el reporte.");
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [miembroSeleccionado, anio]);

  if (loading) return <div className="reporte-loading">Cargando reporte...</div>;
  if (error) return <div className="reporte-error">{error}</div>;
  if (!reporte) return null;

  const COLORS = ["#090928", "#DE9205"];

  const dataTorta = [
    { name: "Presente", value: reporte.porcentajeAsistencia },
    { name: "Ausente", value: reporte.porcentajeAusencia },
  ];

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        {/* ===== HEADER ===== */}
        <div className="abmc-header">
          <BackButton />
          <div>
            <h1 className="abmc-title">Reportes</h1>
           
          </div>
        </div>

        {/* ===== FILTROS ===== */}
        <div className="filtros">
          <label>Miembro:</label>
          <select
            className="abmc-input"
            value={miembroSeleccionado?.id.nroDocumento || ""}
            onChange={(e) =>
              setMiembroSeleccionado(
                miembros.find((m) => m.id.nroDocumento === e.target.value)
              )
            }
          >
            {miembros.map((m) => (
              <option key={m.id.nroDocumento} value={m.id.nroDocumento}>
                {m.nombre} {m.apellido} ({m.cuerda?.nombre || "Sin cuerda"})
              </option>
            ))}
          </select>

          <label>Año:</label>
          <input
            className="abmc-input"
            type="number"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            min="2010"
            max={new Date().getFullYear()}
          />

          <button onClick={() => setAnio(anio)} className="btn-amarillo">
            FILTRAR
          </button>
        </div>

        {/* ===== CUADROS DE DATOS ===== */}
        <div className="metricas-row">
          <div className="metrica-card cuerda">{reporte.cuerda}</div>
          <div className="metrica-card asistencia">
            <h6>Asistencia</h6>
            <p>{reporte.porcentajeAsistencia.toFixed(0)}%</p>
          </div>
          <div className="metrica-card continuidad">
            <h6>Máxima continuidad</h6>
            <p>{reporte.maximaContinuidad}</p>
          </div>
          <div className="metrica-card faltas">
            <h6>Faltas</h6>
            <p>{reporte.porcentajeAusencia.toFixed(0)}%</p>
          </div>
        </div>

        {/* ===== GRAFICOS ===== */}
        <div className="graficos-container">
          {/* TORTA */}
          <div className="card grafico-torta">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataTorta}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  dataKey="value"
                >
                  {dataTorta.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* CONTINUIDAD */}
          <div className="card grafico-linea">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={reporte.continuidad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="fecha" tick={{ fill: "#ccc", fontSize: 12 }} />
                <YAxis tick={{ fill: "#ccc", fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="continuidad"
                  stroke="#192BC2"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
