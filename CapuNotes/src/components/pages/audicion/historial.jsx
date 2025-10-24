import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/common/BackButton.jsx";
// Vista simplificada: sin modal adicional
import { historialService } from "@/services/historialService.js";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/popup.css";

import InfoIcon from "@/assets/InfoIcon.jsx";
// Eliminado VerResultadoIcon

export default function HistorialAudicionesPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [verResultado, setVerResultado] = useState(null); // {estado, obs}
  const [verInscripcion, setVerInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 'nombre' | 'fechaAudicion' | 'anio' | 'resultado'
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Simplificado: solo filtro por texto

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await historialService.list();
        
        // Transformar la estructura del backend:
        // De: [{ candidato: {...}, inscripcion: [...] }]
        // A: filas planas para la tabla
        const flatRows = (data || []).flatMap((historialItem) => {
          const { candidato, inscripcion } = historialItem;
          
          // Si no hay inscripciones, crear una fila con datos del candidato
          if (!inscripcion || inscripcion.length === 0) {
            return [{
              id: candidato?.id || Math.random(),
              nombre: candidato?.nombre || '',
              apellido: candidato?.apellido || '',
              fechaAudicion: '',
              cancion: '',
              resultado: null,
              inscripcion: candidato // Guardar datos completos del candidato
            }];
          }
          
          // Crear una fila por cada inscripción
          return inscripcion.map((insc, idx) => ({
            id: `${candidato?.id || 'temp'}-${idx}`,
            nombre: candidato?.nombre || '',
            apellido: candidato?.apellido || '',
            fechaAudicion: insc.fechaAudicion || insc.diaAudicion || '',
            cancion: insc.cancion || '',
            resultado: insc.resultado || null,
            inscripcion: insc // Datos completos de la inscripción
          }));
        });
        
        setRows(flatRows);
      } catch (err) {
        console.error('Error cargando historial:', err);
        
        // Verificar si es un error de conexión (endpoint no implementado)
        if (err.message?.includes('Network Error') || err.message?.includes('404')) {
          setError('El servicio de historial aún no está disponible. Por favor, implemente el endpoint del backend.');
        } 
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getAnio = (label) => {
    const m = String(label || "").match(/\b(20\d{2}|19\d{2})\b/);
    return m ? m[1] : "";
  };

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) =>
      String(r.nombre || "").toLowerCase().includes(t) ||
      String(r.apellido || "").toLowerCase().includes(t) ||
      String(r.cancion || "").toLowerCase().includes(t)
    );
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "nombre") {
        const aNombre = `${a.apellido || ""}, ${a.nombre || ""}`.toLowerCase();
        const bNombre = `${b.apellido || ""}, ${b.nombre || ""}`.toLowerCase();
        return aNombre.localeCompare(bNombre) * dir;
      }
      if (sortBy === "fechaAudicion") {
        return String(a.fechaAudicion || "").toLowerCase()
          .localeCompare(String(b.fechaAudicion || "").toLowerCase()) * dir;
      }
      if (sortBy === "anio") {
        return getAnio(a.fechaAudicion).localeCompare(getAnio(b.fechaAudicion)) * dir;
      }
      if (sortBy === "resultado") {
        const aRes = String(a.resultado?.estado || "").toLowerCase();
        const bRes = String(b.resultado?.estado || "").toLowerCase();
        return aRes.localeCompare(bRes) * dir;
      }
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy !== key) { setSortBy(key); setSortDir("asc"); }
    else { setSortDir((d) => (d === "asc" ? "desc" : "asc")); }
  };
  const thClass = (key) => (sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable");

  // (sin filtros adicionales)

  if (loading) {
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Historial de audiciones</h1>
          </div>
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando historial...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Historial de audiciones</h1>
          </div>
          <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Historial de audiciones</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por nombre, apellido o canción"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("nombre")}>
                <span className="th-label">Nombre</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("nombre")} aria-label="Ordenar por Nombre">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("fechaAudicion")}>
                <span className="th-label">Audición</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("fechaAudicion")} aria-label="Ordenar por Audición">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th><span className="th-label">Canción</span></th>
              
              <th className={thClass("resultado")}>
                <span className="th-label">Resultado</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("resultado")} aria-label="Ordenar por Resultado">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th style={{ width: 60 }} aria-hidden="true" />
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  {q
                    ? 'No se encontraron resultados con el filtro de búsqueda.' 
                    : 'No hay registros en el historial de audiciones.'}
                </td>
              </tr>
            ) : (
              sorted.map((r) => {
                const nombreCompleto = `${r.apellido || ""}, ${r.nombre || ""}`.trim();
                const estadoResultado = r.resultado?.estado || "Sin resultado";
                
                return (
                  <tr key={r.id} className="abmc-row">
                    <td>{nombreCompleto || r.nombre || "—"}</td>
                    <td>{r.fechaAudicion}</td>
                    <td>{getAnio(r.fechaAudicion) || "—"}</td>
                    <td>{r.cancion || "—"}</td>
                    <td>{estadoResultado}</td>

                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-accion"
                        onClick={() => setVerResultado(r.resultado || { estado: "", obs: "" })}
                        title="Ver detalles del resultado"
                        aria-label="Ver detalles del resultado"
                      >
                        Ver
                      </button>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-accion"
                        title="Abrir cuestionario de inscripción"
                        onClick={() => setVerInscripcion(r.inscripcion || r)}
                        aria-label="Abrir cuestionario de inscripción"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {verInscripcion && (
        <div className="pop-backdrop" onMouseDown={() => setVerInscripcion(null)}>
          <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="pop-header">
              <h3 className="pop-title">Cuestionario de inscripción</h3>
              <button className="icon-btn" aria-label="Cerrar" onClick={() => setVerInscripcion(null)}>✕</button>
            </div>
            <div className="pop-body">
              <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="field">
                  <label>Nombre</label>
                  <input className="input" value={verInscripcion.nombre || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Apellido</label>
                  <input className="input" value={verInscripcion.apellido || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Documento</label>
                  <input className="input" value={`${verInscripcion.tipoDocumento || ""} ${verInscripcion.nroDocumento || ""}`.trim()} readOnly disabled />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input className="input" value={verInscripcion.email || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <input className="input" value={verInscripcion.telefono || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Fecha de Nacimiento</label>
                  <input className="input" value={verInscripcion.fechaNacimiento || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Género</label>
                  <input className="input" value={verInscripcion.genero || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Cuerda</label>
                  <input className="input" value={verInscripcion.cuerda || ""} readOnly disabled />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Dirección</label>
                  <input className="input" value={verInscripcion.direccion || ""} readOnly disabled />
                </div>
                {verInscripcion.observaciones && (
                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label>Observaciones</label>
                    <textarea className="input" rows={3} value={verInscripcion.observaciones || ""} readOnly disabled />
                  </div>
                )}
              </div>
            </div>
            <div className="pop-footer" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setVerInscripcion(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {verResultado && (
        <div className="pop-backdrop" onMouseDown={() => setVerResultado(null)}>
          <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="pop-header">
              <h3 className="pop-title">Resultado</h3>
              <button className="icon-btn" aria-label="Cerrar" onClick={() => setVerResultado(null)}>✕</button>
            </div>
            <div className="pop-body">
              <div className="form-grid">
                <div className="field">
                  <label>Estado</label>
                  <input className="input" value={verResultado.estado || ""} readOnly disabled />
                </div>
                <div className="field">
                  <label>Observaciones</label>
                  <textarea className="input" rows={4} value={verResultado.obs || ""} readOnly disabled />
                </div>
              </div>
            </div>
            <div className="pop-footer" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setVerResultado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Sin modal adicional */}
    </main>
  );
}
