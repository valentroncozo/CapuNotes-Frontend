import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "react-bootstrap";

import "@/styles/abmc.css";
import "@/styles/table.css";
import PopUpReporteParticipacion from "@/components/pages/reportes/PopUpReporteParticipacion.jsx";

import Loader from "@/components/common/Loader.jsx";   // ⬅ AGREGADO
import { reporteParticipacionService } from "@/services/reporteParticipacionService";

export default function ReporteParticipacionPage() {
    const [busqueda, setBusqueda] = useState("");
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [datos, setDatos] = useState([]);
    const [orden, setOrden] = useState({ campo: null, asc: true });
    const navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);



    const [loading, setLoading] = useState(false);   // ⬅ AGREGADO

    // ====== CARGA REAL DESDE EL BACK ======
    useEffect(() => {
        async function cargarReporte() {
            try {
                setLoading(true);   // ⬅ PRENDE LOADER

                const data = await reporteParticipacionService.getReporteParticipacion(
                    anio,
                    estadoFiltro
                );

                const adaptados = data.map((m) => ({
                    id: `${m.tipoDocumento}-${m.nroDocumento}`,
                    tipoDocumento: m.tipoDocumento,
                    nroDocumento: m.nroDocumento,
                    nombre: `${m.apellido}, ${m.nombre}`,
                    cuerda: m.cuerda,
                    area: m.area,
                    porcentaje: m.porcentaje,
                    asistencias: m.presentes,
                    faltas: parseFloat(m.ausentesExactos),
                    activo: m.activo,
                }));


                setDatos(adaptados);
            } catch (error) {
                console.error("❌ Error cargando reporte participación:", error);
            } finally {
                setLoading(false);  // ⬅ APAGA LOADER SIEMPRE
            }
        }

        cargarReporte();
    }, [anio, estadoFiltro]);


    // ⬅ SI ESTÁ CARGANDO → MOSTRAR LOADER
    if (loading) return <Loader />;


    // ===== ORDENAMIENTO =====
    const ordenarPor = (campo) => {
        setOrden((prev) => ({
            campo,
            asc: prev.campo === campo ? !prev.asc : true,
        }));
    };

    // ===== FILTRO + ORDEN =====
    const filtrados = datos
        .filter((d) =>
            d.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        .filter((d) => {
            if (estadoFiltro === "activos") return d.activo;
            if (estadoFiltro === "inactivos") return !d.activo;
            return true;
        })
        .sort((a, b) => {
            if (!orden.campo) return 0;

            const va = a[orden.campo];
            const vb = b[orden.campo];

            if (typeof va === "string") {
                return orden.asc ? va.localeCompare(vb) : vb.localeCompare(va);
            }

            if (typeof va === "boolean") {
                return orden.asc
                    ? (vb === true) - (va === true)
                    : (va === true) - (vb === true);
            }

            return orden.asc ? va - vb : vb - va;
        });

    return (
        <div className="reporte-participacion-page">
            {/* ===== FILTROS ===== */}
            <div className="filtros reportes-filtros">
                <input
                    type="text"
                    className="abmc-input"
                    placeholder="Buscar miembro..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ width: "260px" }}
                />

                <input
                    type="number"
                    className="abmc-input"
                    value={anio}
                    min="2010"
                    max={new Date().getFullYear()}
                    onChange={(e) => setAnio(e.target.value)}
                    style={{ width: "120px" }}
                />

                <select
                    className="abmc-input"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    style={{ width: "180px" }}
                >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
            </div>

            {/* ===== TABLA ===== */}
            <table className="abmc-table abmc-table-rect">
                <thead className="abmc-thead">
                    <tr className="abmc-row">
                        <th onClick={() => ordenarPor("nombre")} style={{ cursor: "pointer" }}>
                            Miembro {orden.campo === "nombre" && (orden.asc ? "▲" : "▼")}
                        </th>

                        <th onClick={() => ordenarPor("cuerda")} style={{ cursor: "pointer" }}>
                            Cuerda {orden.campo === "cuerda" && (orden.asc ? "▲" : "▼")}
                        </th>

                        <th onClick={() => ordenarPor("area")} style={{ cursor: "pointer" }}>
                            Área {orden.campo === "area" && (orden.asc ? "▲" : "▼")}
                        </th>

                        <th onClick={() => ordenarPor("activo")} style={{ cursor: "pointer" }}>
                            Estado {orden.campo === "activo" && (orden.asc ? "▲" : "▼")}
                        </th>

                        <th onClick={() => ordenarPor("porcentaje")} style={{ cursor: "pointer" }}>
                            % Asistencia {orden.campo === "porcentaje" && (orden.asc ? "▲" : "▼")}
                        </th>

                        <th onClick={() => ordenarPor("asistencias")} style={{ cursor: "pointer" }}>
                            Asistencias {orden.campo === "asistencias" && (orden.asc ? "▲" : "▼")}
                        </th>

                        <th onClick={() => ordenarPor("faltas")} style={{ cursor: "pointer" }}>
                            Faltas {orden.campo === "faltas" && (orden.asc ? "▲" : "▼")}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filtrados.map((d) => (
                        <tr className="abmc-row" key={d.id}>
                            <td
                                className="td-nombre-clickable"
                                onClick={() => {
                                    setMiembroSeleccionado({
                                        tipoDocumento: d.tipoDocumento,
                                        nroDocumento: d.nroDocumento,
                                        nombre: d.nombre.split(", ")[1],
                                        apellido: d.nombre.split(", ")[0],
                                    });
                                    setPopupOpen(true);
                                }}
                                title="Ver reporte miembro"
                            >
                                {d.nombre}
                            </td>

                            <td>{d.cuerda}</td>
                            <td>{d.area}</td>

                            <td>
                                <Badge
                                    bg={d.activo ? "success" : "secondary"}
                                    style={{ fontSize: "0.9rem" }}
                                >
                                    {d.activo ? "Activo" : "Inactivo"}
                                </Badge>
                            </td>

                            <td
                                style={{
                                    fontWeight: "bold",
                                    color:
                                        d.porcentaje >= 70
                                            ? "#198754"
                                            : d.porcentaje >= 50
                                                ? "var(--accent)"
                                                : "#FF6B6B",
                                }}
                            >
                                {d.porcentaje}%
                            </td>

                            <td>{d.asistencias}</td>
                            <td>{d.faltas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PopUpReporteParticipacion
                isOpen={popupOpen}
                onClose={() => {
                    setPopupOpen(false);
                    setMiembroSeleccionado(null);
                }}
                miembro={miembroSeleccionado}
                anio={anio}
            />
        </div>
    );
}
