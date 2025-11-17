import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader.jsx";

import {
  PieChart, Pie, Cell,
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

import { reporteAsistenciaMiembroAnualService } from "@/services/reporteAsistenciaMiembroAnualService.js";
import { miembrosService } from "@/services/miembrosService.js";

import "@/styles/ReportesPage.css";
import "@/styles/ReporteAsistenciaMiembroAnual.css";

export default function ReportePorMiembroPage() {

  const [miembros, setMiembros] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  // ====== CARGAR MIEMBROS ======
  useEffect(() => {
    const cargar = async () => {
      const res = await miembrosService.getMiembros();
      setMiembros(res);
      setMiembroSeleccionado(null); // NO seleccionar el primero
    };
    cargar();
  }, []);

  // ====== CARGAR REPORTE ======
  useEffect(() => {
    if (!miembroSeleccionado) return;

    const cargar = async () => {
      setLoading(true);

      const { tipoDocumento, nroDocumento } = miembroSeleccionado.id;

      const r = await reporteAsistenciaMiembroAnualService.getReporteMiembro(
        tipoDocumento, nroDocumento, anio
      );

      setReporte(r);
      setLoading(false);
    };

    cargar();
  }, [miembroSeleccionado, anio]);

  // ========== CASO: NO ELEGIDO TODAVÍA ==========
  if (!miembroSeleccionado) {
    return (
      <div className="pm-container">
        <Filtros
          miembros={miembros}
          miembroSeleccionado={miembroSeleccionado}
          setSeleccionado={setMiembroSeleccionado}
          anio={anio}
          setAnio={setAnio}
        />

        <p style={{ marginTop: "40px", color: "var(--text-light)" }}>
          Seleccione un miembro para ver su reporte.
        </p>
      </div>
    );
  }

  if (loading || !reporte) return <Loader />;

  // ========== CÁLCULOS ==========
  const asistenciasTotales = reporte.presentes ?? 0;

  const faltasTotales =
    (reporte.ausentes ?? 0) + ((reporte.mediasFaltas ?? 0) * 0.5);

  const COLORS = ["#AFD1F0", "#DE9205"];
  const dataTorta = [
    { name: "Presente", value: Number(reporte.porcentajeAsistencia ?? 0) },
    { name: "Ausente", value: Number(reporte.porcentajeAusencia ?? 0) },
  ];

  return (
    <div className="pm-container">

      {/* FILTROS */}
      <Filtros
        miembros={miembros}
        miembroSeleccionado={miembroSeleccionado}
        setSeleccionado={setMiembroSeleccionado}
        anio={anio}
        setAnio={setAnio}
      />

      {/* ========== TORTA + CARDS ========== */}
      <div className="pm-top">

        <div className="pm-card pm-torta">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={dataTorta}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) =>
                  `${name}: ${Number(value).toFixed(1)}%`
                }
                labelLine={{ stroke: "#fff" }}
              >
                {dataTorta.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="pm-metricas">

          <div className="pm-card pm-small">
            <h5>Cuerda</h5>
            <p>{reporte.cuerda}</p>
          </div>

          <div className="pm-card pm-small">
            <h5>Asistencias</h5>
            <p>{asistenciasTotales}</p>
          </div>

          <div className="pm-card pm-small">
            <h5>Máx. continuidad</h5>
            <p>{reporte.maximaContinuidad}</p>
          </div>

          <div className="pm-card pm-small">
            <h5>Faltas</h5>
            <p>{faltasTotales}</p>
          </div>

        </div>

      </div>

      {/* ========== GRÁFICO DE CONTINUIDAD ========== */}
      <div className="pm-card pm-linea">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={reporte.continuidad}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="continuidad" stroke="#DE9205" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}


/* ========================================================= */
/* FILTROS — SELECT NATIVO IGUAL AL RESTO DE LA APP */
/* ========================================================= */
function Filtros({
  miembros,
  miembroSeleccionado,
  setSeleccionado,
  anio,
  setAnio
}) {
  return (
    <div className="reportes-filtros">

      {/* ==== SELECT MIEMBRO ==== */}
      <select
        className="abmc-input"
        value={miembroSeleccionado?.id?.nroDocumento || ""}
        onChange={(e) => {
          const seleccionado = miembros.find(
            (m) => m.id.nroDocumento === e.target.value
          );
          setSeleccionado(seleccionado || null);
        }}
        style={{ width: "260px" }}
      >
        <option value="">Seleccionar miembro...</option>

        {miembros.map((m) => (
          <option key={m.id.nroDocumento} value={m.id.nroDocumento}>
            {m.apellido}, {m.nombre}
          </option>
        ))}
      </select>

      {/* ==== AÑO ==== */}
      <input
        type="number"
        className="abmc-input"
        value={anio}
        onChange={(e) => setAnio(e.target.value)}
        placeholder="Año"
        style={{ width: "150px" }}
      />

      {/* ==== ESTADO DEL MIEMBRO ==== */}
      {miembroSeleccionado && (
        <span
          className="estado-pill"
          style={{
            background: miembroSeleccionado.activo ? "#198754" : "#dc3545",
            color: "white",
            padding: "8px 14px",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            height: "42px"
          }}
        >
          {miembroSeleccionado.activo ? "Activo" : "Inactivo"}
        </span>
      )}

    </div>
  );
}

