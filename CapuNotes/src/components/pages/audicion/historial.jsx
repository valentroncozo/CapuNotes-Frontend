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
        setRows(data || []);
      } catch (err) {
        console.error('Error cargando historial:', err);
        
        // Verificar si es un error de conexión (endpoint no implementado)
        if (err.message?.includes('Network Error') || err.message?.includes('404')) {
          setError('El servicio de historial aún no está disponible. Por favor, implemente el endpoint del backend.');
        } else {
          setError('No se pudo cargar el historial de audiciones. Verifique la conexión con el servidor.');
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
                <span className="th-label">Apellido, Nombre</span>
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

              <th className={thClass("anio")}>
                <span className="th-label">Año</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("anio")} aria-label="Ordenar por Año">
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
              
              <th style={{ textAlign: "center" }}><span className="th-label">Detalles</span></th>
              <th style={{ textAlign: "center" }}><span className="th-label">Inscripción</span></th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
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

                    <td className="abmc-actions">
                      <button
                        className="btn-accion btn-accion--icon"
                        title="Ver inscripción"
                        onClick={() => alert(JSON.stringify(r.inscripcion || {}, null, 2))}
                        aria-label="Ver inscripción"
                      >
                        <InfoIcon size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
