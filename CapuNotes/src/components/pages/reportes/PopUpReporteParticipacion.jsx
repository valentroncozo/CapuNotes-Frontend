import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import Loader from "@/components/common/Loader.jsx";
import "@/styles/popUpReporteMiembro.css";

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

import { reporteAsistenciaMiembroAnualService } from "@/services/reporteAsistenciaMiembroAnualService";

export default function PopUpReporteParticipacion({
    isOpen,
    onClose,
    miembro,
    anio,
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !miembro) return;

        const cargar = async () => {
            try {
                setLoading(true);

                const res = await reporteAsistenciaMiembroAnualService.getReporteMiembro(
                    miembro.tipoDocumento,
                    miembro.nroDocumento,
                    anio
                );

                setData(res);
            } catch (err) {
                console.error("Error cargando reporte popup:", err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, [isOpen, miembro, anio]);

    if (!isOpen) return null;

    const titulo = `Participación de ${miembro?.apellido || ""}${miembro?.nombre ? ", " + miembro.nombre : ""}`;

    const COLORS = ["#AFD1F0", "#DE9205", "#FF6B6B"];

    const dataTorta = data
        ? [
              { name: "Asistencias", value: data.porcentajeAsistencia ?? 0 },
              { name: "Faltas", value: data.porcentajeAusencia ?? 0 },
          ]
        : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={titulo} className="popup-participacion">
            {loading && <Loader />}

            {!loading && data && (
                <>
                    {/* === PRIMER GRÁFICO === */}
                    <div className="grafico-section">
                        <h4>Distribución de asistencia</h4>
                        <p className="grafico-desc">
                            Proporción de asistencias y faltas durante el año.
                        </p>

                        <ResponsiveContainer width="100%" height={230}>
                            <PieChart>
                                <Pie
                                    data={dataTorta}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={({ name, value }) =>
                                        `${name}: ${value != null ? Number(value).toFixed(1) : "0.0"}%`
                                    }
                                >
                                    {dataTorta.map((entry, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => (value != null ? `${Number(value).toFixed(1)}%` : "0.0%")} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* === SEGUNDO GRÁFICO === */}
                    <div className="grafico-section">
                        <h4>Evolución de continuidad</h4>
                        <p className="grafico-desc">Muestra los ensayos consecutivos asistidos sin faltas.</p>

                        <ResponsiveContainer width="100%" height={230}>
                            <LineChart data={data.continuidad}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="continuidad" stroke="#DE9205" strokeWidth={3} dot />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </Modal>
    );
}
