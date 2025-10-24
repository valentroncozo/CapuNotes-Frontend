// src/components/pages/audiciones/candidatos.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";
import "@/styles/table.css";
import "@/styles/forms.css";
import "@/styles/popup.css";

import { candidatosService } from "@/services/candidatosService.js";
import InfoIcon from "@/assets/InfoIcon.jsx";

export default function CandidatosPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [dias, setDias] = useState([]);
  const [diaSel, setDiaSel] = useState("-");

  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [verInscripcion, setVerInscripcion] = useState(null);
  const [verResultado, setVerResultado] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sp] = useSearchParams();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const cd = await candidatosService.list();
      setRows(cd || []);
      
      // Extraer días únicos de los candidatos
      const uniqueDias = [...new Set(cd.map(c => c.dia || c.inscripcion?.diaAudicion).filter(Boolean))];
      setDias(uniqueDias);
      
      const qp = sp.get("dia");
      if (qp && uniqueDias.includes(qp)) setDiaSel(qp);
      else setDiaSel("-");
    } catch (err) {
      console.error('Error cargando candidatos:', err);
      if (err.message?.includes('Network Error') || err.message?.includes('404')) {
        setError('El servicio de candidatos aún no está disponible.');
      }
    } finally {
      setLoading(false);
    }
  };

  const nombreApynom = (r) => {
    const ape = (r.apellido || "").trim();
    const nom = (r.nombre || "").trim();
    if (ape && nom) return `${ape}, ${nom}`;
    return nom || ape || r.nombre || r.nombreLabel || "";
  };

  const filteredByText = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => {
      const ape = String(r.apellido || "").toLowerCase();
      const nom = String(r.nombre || "").toLowerCase();
      const apynom = `${ape}, ${nom}`.trim();
      const label = String(r.nombreLabel || r.nombre || "").toLowerCase();
      return ape.includes(t) || nom.includes(t) || apynom.includes(t) || label.includes(t);
    });
  }, [rows, q]);

  const filtered = useMemo(() => {
    if (diaSel === "-") return filteredByText;
    const getDia = (r) =>
      String(r?.inscripcion?.diaAudicion || r?.dia || r?.fechaAudicion || "").trim();
    return filteredByText.filter((r) => getDia(r) === diaSel);
  }, [filteredByText, diaSel]);

  const horaToMinutes = (hora) => {
    if (!hora) return 0;
    const [h, m] = String(hora).split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const estadoLabel = (estado) => {
    const e = String(estado || "sin").toLowerCase();
    if (e === "aceptado" || e === "aceptada" || e === "ok") return "Aceptado";
    if (e === "rechazado" || e === "rechazada" || e === "bad") return "Rechazado";
    if (e === "ausente" || e === "pend") return "Ausente";
    return "Sin resultado";
  };

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      if (sortBy === "hora") return (horaToMinutes(a.hora) - horaToMinutes(b.hora)) * dir;
      if (sortBy === "resultado") {
        const la = estadoLabel(a.resultado?.estado ?? "sin");
        const lb = estadoLabel(b.resultado?.estado ?? "sin");
        return la.localeCompare(lb) * dir;
      }
      if (sortBy === "apynom") {
        const av = nombreApynom(a).toLowerCase();
        const bv = nombreApynom(b).toLowerCase();
        return av.localeCompare(bv) * dir;
      }
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy !== key) { setSortBy(key); setSortDir("asc"); }
    else { setSortDir((d) => (d === "asc" ? "desc" : "asc")); }
  };
  
  const thClass = (key) => (sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable");

  if (loading) {
    return (
      <main className="abmc-page">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">Candidatos</h1>
          </div>
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando candidatos...</p>
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
            <h1 className="abmc-title">Candidatos</h1>
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
          <h1 className="abmc-title">Candidatos</h1>
        </div>

        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por apellido o nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="abmc-input"
            value={diaSel}
            onChange={(e) => setDiaSel(e.target.value)}
            aria-label="Filtrar por día de audición"
          >
            <option value="-">Todos los días</option>
            {dias.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("hora")}>
                <span className="th-label">Hora</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("hora")} aria-label="Ordenar por Hora">
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("apynom")}>
                <span className="th-label">Nombre</span>
                <button type="button" className="th-caret-btn" onClick={() => toggleSort("apynom")} aria-label="Ordenar por Nombre">
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

              <th style={{ textAlign: "center" }}><span className="th-label"></span></th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  {q || diaSel !== "-"
                    ? 'No se encontraron resultados con los filtros aplicados.' 
                    : 'No hay candidatos registrados.'}
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={r.id} className="abmc-row">
                  <td>{r.hora || "—"}</td>
                  <td>{nombreApynom(r)}</td>
                  <td>{r.cancion || "—"}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn-accion"
                      onClick={() => setVerResultado(r.resultado || { estado: "", obs: "" })}
                      title="Ver detalles del resultado"
                      aria-label="Ver detalles del resultado"
                    >
                      {estadoLabel(r.resultado?.estado)}
                    </button>
                  </td>

                  <td className="abmc-actions" style={{ textAlign: 'center' }}>
                    <button
                      className="btn-accion btn-accion--icon"
                      title="Ver inscripción"
                      aria-label="Ver inscripción"
                      onClick={() => setVerInscripcion(r.inscripcion || r)}
                    >
                      <InfoIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup de Resultado */}
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

      {/* Popup de Inscripción */}
      {verInscripcion && (
        <div className="pop-backdrop" onMouseDown={() => setVerInscripcion(null)}>
          <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="pop-header">
              <h3 className="pop-title">Datos de Inscripción</h3>
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
    </main>
  );
}
