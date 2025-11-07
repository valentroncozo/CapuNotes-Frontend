import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// 🛑 Importar el nuevo servicio de asistencias
import { asistenciasService } from "@/services/asistenciasService.js";
import { miembrosService } from "@/services/miembrosService.js";
import { ensayosService } from "@/services/ensayosService.js";
import BackButton from "@/components/common/BackButton.jsx";
import Swal from 'sweetalert2';
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/asistencia.css";

// 🛠️ Corregido: mapeo al Enum real del backend
const ESTADOS_MAP = {
    no: "AUSENTE",
    half: "MEDIA_FALTA",  // <-- antes decía "MEDIO"
    yes: "PRESENTE",
};
// Reverse map: backend state -> local key
const REVERSE_ESTADOS = Object.entries(ESTADOS_MAP).reduce((acc, [k, v]) => {
    acc[v] = k; return acc;
}, {});

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
                const [asistenciasData, miembrosData] = await Promise.all([
                    asistenciasService.listPorEnsayo(idEnsayo).catch(() => []),
                    miembrosService.list().catch(() => []),
                ]);

                // Normalizar asistencias existentes en un mapa para búsqueda rápida
                const asistenciaMap = new Map();
                (Array.isArray(asistenciasData) ? asistenciasData : []).forEach((a) => {
                    // posibles formas de identificar al miembro en la respuesta
                    const keys = [];
                    if (a.miembroId) keys.push(String(a.miembroId));
                    if (a.miembro && a.miembro.id && a.miembro.id.nroDocumento) keys.push(String(a.miembro.id.nroDocumento));
                    if (a.miembroNroDocumento) keys.push(String(a.miembroNroDocumento));
                    // además, formar por nombre-apellido (fallback)
                    const nombreKey = `${(a.miembroNombre||a.miembro?.nombre||'').trim().toLowerCase()}|${(a.miembroApellido||a.miembro?.apellido||'').trim().toLowerCase()}`;
                    keys.push(nombreKey);

                    keys.forEach((k) => {
                        if (k) asistenciaMap.set(k, a);
                    });
                });

                // Mapear los miembros (todos) y unir con la asistencia si existe
                // Generamos un uid estable por fila para evitar colisiones cuando `id` no sea primitivo
                const mappedMembers = (Array.isArray(miembrosData) ? miembrosData : []).map((m, idx) => {
                    // Raw member object as returned by la API de miembros
                    const raw = m || {};

                    // Prefer explicit document or numeric DB id as primary identifier
                    const doc = raw.id && typeof raw.id === 'object' ? (raw.id.nroDocumento || raw.id.numeroDocumento || null) : (raw.numeroDocumento || raw.nroDocumento || raw.id || null);
                    const nameKey = `${(raw.nombre||'').trim().toLowerCase()}|${(raw.apellido||'').trim().toLowerCase()}`;

                    const found = asistenciaMap.get(String(doc)) || asistenciaMap.get(nameKey) || asistenciaMap.get(String(raw.id)) || null;

                    const estadoBackend = found?.estado || found?.estadoAsistencia || found?.estadoAsistenciaCodigo || null;
                    const asistenciaLocal = estadoBackend ? REVERSE_ESTADOS[estadoBackend] || null : null;

                    // Build a stable uid using best available identifier(s)
                    let uid;
                    if (raw.id !== undefined && raw.id !== null) {
                        if (typeof raw.id === 'object') {
                            // If id is an object, prefer composite key nroDocumento + tipoDocumento when available
                            const nro = raw.id.nroDocumento || raw.id.numeroDocumento || null;
                            const tipo = raw.id.tipoDocumento || raw.id.tipo || null;
                            if (nro && tipo) {
                                uid = `${String(nro)}-${String(tipo)}`;
                            } else {
                                // fallback to any available nested identifier
                                uid = String(nro || raw.id.id || JSON.stringify(raw.id));
                            }
                        } else {
                            uid = String(raw.id);
                        }
                    } else if (raw.numeroDocumento || raw.nroDocumento) {
                        // If both documento and tipoDocumento are available at root, use composite
                        const nro = raw.numeroDocumento || raw.nroDocumento;
                        const tipo = raw.tipoDocumento || raw.tipo || null;
                        uid = tipo ? `${String(nro)}-${String(tipo)}` : String(nro);
                    } else {
                        // Fallback to a deterministic name+index
                        uid = `${(raw.nombre||'').trim()}-${(raw.apellido||'').trim()}-${idx}`;
                    }

                    // For payload, keep an `id` that reflects DB id when numeric, else keep raw.id or uid
                    const payloadId = (raw.id !== undefined && raw.id !== null && !isNaN(Number(raw.id))) ? Number(raw.id) : (raw.id ?? uid);

                    return {
                        uid,
                        id: payloadId,
                        nombre: `${raw.nombre || ''} ${raw.apellido || ''}`.trim(),
                        asistencia: asistenciaLocal,
                        cuerda: raw.cuerda?.name || raw.cuerda?.nombre || (raw.cuerda || ''),
                        ensayoId: idEnsayo,
                        raw: raw,
                    };
                });

                                // Intentar obtener info del ensayo desde el endpoint de ensayos/eventos
                                try {
                                    const ensayo = await ensayosService.getById(idEnsayo).catch(() => null);
                                    if (ensayo) {
                                        setEnsayoInfo({ id: ensayo.id || idEnsayo, fecha: ensayo.fechaInicio || ensayo.fecha || '-', descripcion: ensayo.nombre || ensayo.descripcion || '-' });
                                    } else if (Array.isArray(asistenciasData) && asistenciasData.length > 0) {
                                        setEnsayoInfo({ id: idEnsayo, fecha: asistenciasData[0].ensayoFecha || asistenciasData[0].fechaInicio || '-', descripcion: asistenciasData[0].ensayoDescripcion || asistenciasData[0].nombre || '-' });
                                    } else {
                                        setEnsayoInfo({ id: idEnsayo, fecha: '-', descripcion: '-' });
                                    }
                                                } catch {
                                                    setEnsayoInfo({ id: idEnsayo, fecha: '-', descripcion: '-' });
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

    // Ahora identificamos filas por uid para evitar colisiones en `id`/objects
    const handleSetAsistencia = (uid, value) => {
        // Si el usuario hace click sobre el mismo estado, lo desmarcamos (toggle off).
        console.log('✅ Clic detectado:', uid, '→', value);
        setMembers((prev) => prev.map((m) => {
            if (m.uid !== uid) return m;
            // Si ya tiene el mismo valor, lo quitamos (null) para que quede "no marcado"
            const newVal = m.asistencia === value ? null : value;
            return { ...m, asistencia: newVal };
        }));
    };

   // ----------------------------------------------------
// 🔹 Guardar Asistencia (Registro Masivo)
// ----------------------------------------------------
const handleGuardar = async () => {
    setSaving(true);
    try {
            const registradoPor = localStorage.getItem('capunotes_user') || 'UsuarioActual';

            // Depuración: mostrar el estado actual de members antes de filtrar
            console.log("📋 Estado actual de members antes de filtrar:");
            members.forEach((m, i) => {
                console.log(i, m.nombre, "→ asistencia:", m.asistencia, "uid:", m.uid);
            });

            // Filtramos los miembros que tienen asistencia marcada
            const asistencias = members.filter((m) => m.asistencia);

            if (asistencias.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin cambios',
                    text: 'No se seleccionó ninguna asistencia.',
                    background: '#11103a',
                    color: '#E8EAED'
                });
                setSaving(false);
                return;
            }

            // 🧩 Construcción del payload (ya no hace falta mapear estados)
                const asistenciasPayloadArray = asistencias
                .map((m) => {
                    const estadoParaBackend = ESTADOS_MAP[m.asistencia]; // "AUSENTE", "MEDIA_FALTA" o "PRESENTE"
                    if (!estadoParaBackend) return null;

                    const raw = m.raw || {};
                    const entry = { estado: estadoParaBackend, registradoPor };

                    // 1) raw.id puede ser un objeto con tipoDocumento/nroDocumento
                    if (raw.id && typeof raw.id === 'object' && (raw.id.tipoDocumento || raw.id.tipo) && (raw.id.nroDocumento || raw.id.numeroDocumento)) {
                        entry.miembro = { id: { tipoDocumento: raw.id.tipoDocumento || raw.id.tipo, nroDocumento: raw.id.nroDocumento || raw.id.numeroDocumento } };
                        return entry;
                    }

                    // 2) raw.miembro?.id anidado
                    if (raw.miembro && raw.miembro.id && (raw.miembro.id.tipoDocumento || raw.miembro.id.tipo) && (raw.miembro.id.nroDocumento || raw.miembro.id.numeroDocumento)) {
                        entry.miembro = { id: { tipoDocumento: raw.miembro.id.tipoDocumento || raw.miembro.id.tipo, nroDocumento: raw.miembro.id.nroDocumento || raw.miembro.id.numeroDocumento } };
                        return entry;
                    }

                    // 3) campos en root: tipoDocumento + nroDocumento
                    if ((raw.tipoDocumento || raw.tipo) && (raw.nroDocumento || raw.numeroDocumento)) {
                        entry.miembro = { id: { tipoDocumento: raw.tipoDocumento || raw.tipo, nroDocumento: raw.nroDocumento || raw.numeroDocumento } };
                        return entry;
                    }

                    // 4) sólo nroDocumento disponible -> incluir con tipo por defecto si es necesario
                    if (raw.nroDocumento || raw.numeroDocumento) {
                        entry.miembro = { id: { tipoDocumento: raw.tipoDocumento || raw.tipo || 'DNI', nroDocumento: raw.nroDocumento || raw.numeroDocumento } };
                        return entry;
                    }

                    // 5) miembroId numérico (fallback)
                    if (raw.miembroId !== undefined && raw.miembroId !== null && !isNaN(Number(raw.miembroId))) {
                        entry.miembroId = Number(raw.miembroId);
                        return entry;
                    }

                    // 6) raw.id es número (fallback)
                    if (raw.id !== undefined && raw.id !== null && !isNaN(Number(raw.id))) {
                        entry.miembroId = Number(raw.id);
                        return entry;
                    }

                    // Último recurso: enviar raw para que el backend intente mapearlo
                    console.warn('⚠️ No se pudo construir ID de miembro compuesto, enviando raw como último recurso:', raw);
                    entry.miembro = { id: raw.id ?? raw };
                    return entry;
                })
                .filter(Boolean);

            console.log("📤 Payload asistencias masivas (array) (enviando):", asistenciasPayloadArray);

            // Log detallado por registro para depuración (miembro / estado / registradoPor)
            asistenciasPayloadArray.forEach((a, i) => {
                console.log(`➡️ Registro ${i}:`, JSON.stringify(a, null, 2));
            });

            // Construir payload final con la clave que espera el backend
            const payload = {
                registradoPor,
                asistencias: asistenciasPayloadArray
            };

            console.log('📦 Payload final a enviar:', JSON.stringify(payload, null, 2));

            // 🚀 Enviar al backend (espera un objeto con { registradoPor, asistencias: [...] })
            await asistenciasService.registrarAsistenciasMasivas(idEnsayo, payload);

            Swal.fire({
                icon: 'success',
                title: 'Asistencias guardadas',
                text: 'Se registraron correctamente todas las asistencias.',
                timer: 1600,
                showConfirmButton: false,
                background: '#11103a',
                color: '#E8EAED'
            });

            navigate(-1);
        } catch (error) {
            console.error("❌ Error al guardar asistencia:", error);
            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar',
                background: '#11103a',
                color: '#E8EAED'
            });
        } finally {
            setSaving(false);
        }
    };
    // ----------------------------------------------------
    // 🔹 Renderizado

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
                                <tr className="abmc-row" key={m.uid}>
                                    <td>{m.nombre}</td>
                                    <td>
                                        <div className="attendance-actions" role="group" aria-label={`asistencia-${m.uid}`}>
                                            <button
                                                className={`attendance-btn ${m.asistencia === "no" ? "selected" : ""}`}
                                                onClick={() => handleSetAsistencia(m.uid, "no")}
                                                aria-pressed={m.asistencia === "no"}
                                                title="Ausente"
                                                disabled={saving}
                                            >
                                                ✖
                                            </button>

                                            <button
                                                className={`attendance-btn ${m.asistencia === "half" ? "selected" : ""}`}
                                                onClick={() => handleSetAsistencia(m.uid, "half")}
                                                aria-pressed={m.asistencia === "half"}
                                                title="Medio"
                                                disabled={saving}
                                            >
                                                ½
                                            </button>

                                            <button
                                                className={`attendance-btn ${m.asistencia === "yes" ? "selected" : ""}`}
                                                onClick={() => handleSetAsistencia(m.uid, "yes")}
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