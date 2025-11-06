import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// 🛑 Importar el nuevo servicio de asistencias
import { asistenciasService } from "@/services/asistenciasService.js";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/asistencia.css";

// 🛑 Definimos las constantes del estado de asistencia para mapear al Backend (Java Enum)
const ESTADOS_MAP = {
    "no": "AUSENTE",
    "half": "MEDIO",
    "yes": "PRESENTE",
};

export default function AsistenciaEnsayosDetalle() {
    const navigate = useNavigate();
    // 🛑 CAMBIO: Obtener idEnsayo de los parámetros
    const { idEnsayo } = useParams(); 
    
    // Estado para la información del Ensayo (nombre, fecha)
    const [ensayoInfo, setEnsayoInfo] = useState({ id: null, fecha: '-', descripcion: '' });

    // Estado para la lista real de asistencias
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [filterName, setFilterName] = useState("");
    const [filterCuerda, setFilterCuerda] = useState("Todas");

    // ----------------------------------------------------
    // 🔹 Carga Inicial de Datos (Ensayos y Asistencias)
    // ----------------------------------------------------
    useEffect(() => {
        if (!idEnsayo) {
            setLoading(false);
            return;
        }

        const fetchAsistencias = async () => {
            setLoading(true);
            try {
                // Llama al Backend con el ID del Ensayo
                const data = await asistenciasService.listPorEnsayo(idEnsayo);
                
                // Mapear los datos del Backend (AsistenciaResponse) al estado del Frontend
                const mappedMembers = data.map(a => ({
                    // Aquí asumimos que AsistenciaResponse trae campos anidados (Miembro, Cuerda, etc.)
                    id: a.miembroId, // Necesitas un ID único para el miembro (Ej: nroDocumento)
                    nombre: `${a.miembroNombre} ${a.miembroApellido}`,
                    asistencia: a.estado ? Object.keys(ESTADOS_MAP).find(key => ESTADOS_MAP[key] === a.estado) : null,
                    cuerda: a.cuerdaNombre, 
                    // Guardamos la información del ensayo (asumimos que todos son iguales)
                    ensayoId: idEnsayo 
                }));
                
                // Si la ruta trae la fecha o info en URL, se usaría. 
                // Pero es más seguro obtener la info del Ensayo por su ID si la API lo permite.
                if (data.length > 0) {
                   setEnsayoInfo({ 
                        id: idEnsayo,
                        fecha: data[0].ensayoFecha || '-', // Asume que la respuesta trae la fecha
                        descripcion: data[0].ensayoDescripcion || '-'
                    });
                }
                
                setMembers(mappedMembers);
            } catch (error) {
                console.error("❌ Error al cargar asistencias:", error);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAsistencias();
    }, [idEnsayo]); // Se ejecuta al cargar y si cambia el ID

    // ----------------------------------------------------
    // 🔹 Filtros y Opciones
    // ----------------------------------------------------
    const cuerdaOptions = useMemo(() => {
        const set = new Set(members.map((m) => m.cuerda).filter(Boolean));
        return ["Todas", ...Array.from(set)];
    }, [members]);

    const filteredMembers = useMemo(() => {
        const name = String(filterName || "").trim().toLowerCase();
        // 🛑 CAMBIO: Usar id para filtrar si es necesario (asumimos que la API filtra por cuerda/nombre)
        return members.filter((m) => {
            if (filterCuerda && filterCuerda !== "Todas" && m.cuerda !== filterCuerda) return false;
            if (!name) return true;
            return m.nombre.toLowerCase().includes(name);
        });
    }, [members, filterName, filterCuerda]);

    const handleSetAsistencia = (memberId, value) => {
        setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, asistencia: value } : m)));
    };

    // ----------------------------------------------------
    // 🔹 Guardar Asistencia (Registro Masivo)
    // ----------------------------------------------------
    const handleGuardar = async () => {
        setSaving(true);
        try {
            // Preparamos el payload para el registro masivo
            const payload = {
                registradoPor: "UsuarioActual", // 🛑 DEBES CAMBIAR ESTO: Usar el nombre del usuario logueado
                asistencias: members.map(m => ({
                    // Asumimos que el Backend necesita el ID del Miembro y el estado
                    miembro: { id: m.id }, 
                    estado: ESTADOS_MAP[m.asistencia] // Mapear 'yes', 'no' a 'PRESENTE', 'AUSENTE'
                }))
                .filter(a => a.estado !== null) // Solo enviamos los que tienen estado definido
            };

            // Llamamos al servicio de registro masivo
            const res = await asistenciasService.registrarAsistenciasMasivas(idEnsayo, payload);
            
            console.log("✅ Asistencia Guardada:", res);
            // Mostrar un mensaje de éxito (no usamos alert() en Canvas)

            navigate(-1); // Volvemos a la lista
        } catch (error) {
            console.error("❌ Error al guardar asistencia:", error);
            // Mostrar un mensaje de error
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Cargando asistencias...</div>;
    }

    if (!ensayoInfo.id) {
        return <div className="error-message">Error: Ensayo no encontrado o ID inválido.</div>;
    }

    return (
        <main className="abmc-page">
            <div className="abmc-card">
                <div className="abmc-header">
                    <BackButton />
                    {/* 🛑 CAMBIO: Usar info real del estado, no de URL */}
                    <h1 className="abmc-title">Asistencia Ensayo {ensayoInfo.fecha}</h1>
                    <p className="abmc-subtitle">{ensayoInfo.descripcion}</p>
                </div>

                <div>
                    <div className="abmc-topbar">
                        <input
                            className="abmc-input"
                            placeholder="Buscar por nombre"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            aria-label="Buscar por nombre"
                        />
                        {/* El filtro por cuerda debería interactuar con la API si la lista es muy grande. 
                           Por ahora, filtramos localmente sobre la lista completa. */}
                        <select
                            className="abmc-select"
                            value={filterCuerda}
                            onChange={(e) => setFilterCuerda(e.target.value)}
                            aria-label="Filtrar por cuerda"
                        >
                            {cuerdaOptions.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="abmc-table abmc-table-rect">
                        <thead className="abmc-thead">
                            <tr className="abmc-row">
                                <th>
                                    <span className="th-label">{filterCuerda && filterCuerda !== "Todas" ? `Miembros - ${filterCuerda}` : "Miembros"}</span>
                                </th>
                                <th>
                                    <span className="th-label">Asistencia</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((m) => (
                                <tr className="abmc-row" key={m.id}>
                                    <td>{m.nombre}</td>
                                    <td>
                                        <div className="attendance-actions" role="group" aria-label={`asistencia-${m.id}`}>
                                            <button
                                                className={`attendance-btn ${m.asistencia === "no" ? "selected" : ""}`}
                                                onClick={() => handleSetAsistencia(m.id, "no")}
                                                aria-pressed={m.asistencia === "no"}
                                                title="Ausente"
                                                disabled={saving}
                                            >
                                                ✖
                                            </button>

                                            <button
                                                className={`attendance-btn ${m.asistencia === "half" ? "selected" : ""}`}
                                                onClick={() => handleSetAsistencia(m.id, "half")}
                                                aria-pressed={m.asistencia === "half"}
                                                title="Medio"
                                                disabled={saving}
                                            >
                                                ½
                                            </button>

                                            <button
                                                className={`attendance-btn ${m.asistencia === "yes" ? "selected" : ""}`}
                                                onClick={() => handleSetAsistencia(m.id, "yes")}
                                                aria-pressed={m.asistencia === "yes"}
                                                title="Presente"
                                                disabled={saving}
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pop-footer" style={{ justifyContent: "center" }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            aria-label="cerrar-sin-guardar"
                            style={{ marginRight: 8 }}
                            disabled={saving}
                        >
                            Cerrar
                        </button>

                        <button 
                            className="btn-primary btn" 
                            onClick={handleGuardar} 
                            aria-label="guardar-asistencia"
                            disabled={saving}
                        >
                           {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}