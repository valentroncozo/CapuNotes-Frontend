import '@/styles/abmc.css';
import '@/styles/table.css';
import BackButton from '@/components/common/BackButton.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AudicionService from '@/services/audicionService.js';
import ResultadosModal from '../audicion/resultados.jsx';
import candidatosService from '@/services/candidatosService.js';
import { InfoCircle as InfoIcon } from 'react-bootstrap-icons';

export default function CandidatosCoordinadoresPage({ title = 'Cronograma (Coordinador)' }) {

  const [dias, setDias] = useState([]); // [{ value, label }]
  const [diaSel, setDiaSel] = useState('-');
  const [cronograma, setCronograma] = useState([]);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [editResultado, setEditResultado] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [sp, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  // Función para ordenar
  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  // Función para clases de ordenamiento
  const thClass = (col) => {
    if (sortBy !== col) return '';
    return sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc';
  };



  // Cargar cronograma y construir lista de días únicos
  useEffect(() => {
    (async () => {
      try {
        const a = await AudicionService.getActual();
        if (!a?.id) {
          setDias([]);
          setCronograma([]);
          setDiaSel('-');
          return;
        }

        const cron = await AudicionService.getCronograma(a.id);
        setCronograma(cron || []);

        const mapa = new Map();
        (cron || []).forEach(item => {
          const f = item?.turno?.fecha;
          if (!f) return;
          const label = item?.turno?.diaString ? `${item.turno.diaString} — ${f}` : f;
          if (!mapa.has(f)) mapa.set(f, { value: f, label });
        });

        const ds = Array.from(mapa.values());
        setDias(ds);

        const qp = sp.get('dia');
        setDiaSel((qp && ds.find(d => d.value === qp)) ? qp : (ds[0]?.value || '-'));
      } catch (e) {
        console.error('Error cargando cronograma/días', e);
        setDias([]);
        setCronograma([]);
        setDiaSel('-');
      }
    })();
  }, [sp, refreshTrigger]);

  // Calcular rows a partir del cronograma y diaSel
  useEffect(() => {
    const build = () => {
      if (!cronograma || cronograma.length === 0) { setRows([]); return; }
      const items = (diaSel && diaSel !== '-') ? cronograma.filter(it => it?.turno?.fecha === diaSel) : cronograma;
      const mapped = items.map(item => {
        const horaRaw = item?.turno?.horaInicio || item?.turno?.hora || item?.turno?.fechaHoraInicio || '';
        const hora = horaRaw ? String(horaRaw).slice(0,5) : '-';
        
        console.log('📦 Mapeando item del cronograma:', item);
        
        return {
          id: item?.id ?? item?.turno?.id,
          idInscripcion: item?.id,
          hora,
          nombre: item?.nombre || '-',
          apellido: item?.apellido || '-',
          cancion: item?.cancion || '-',
          turnoEstado: item?.turno?.estado || '',
          resultado: item?.resultado || null,
          observaciones: item?.observaciones || '',
          cuerda: item?.cuerda || null,
          inscripcion: item?.inscripcion || null,
          raw: item,
        };
      });
      setRows(mapped);
    };

    build();
  }, [cronograma, diaSel]);

  const filtered = useMemo(() => {
    let result = rows;
    
    // Filtro por búsqueda
    if (q) {
      const t = q.toLowerCase();
      result = result.filter(r => 
        `${r.apellido || ''}, ${r.nombre || ''}`.toLowerCase().includes(t) || 
        String(r.cancion || '').toLowerCase().includes(t)
      );
    }

    // Aplicar ordenamiento
    if (sortBy) {
      result = [...result].sort((a, b) => {
        let valA, valB;
        
        if (sortBy === 'hora') {
          valA = a.hora || '';
          valB = b.hora || '';
        } else if (sortBy === 'apynom') {
          valA = `${a.apellido || ''} ${a.nombre || ''}`.toLowerCase();
          valB = `${b.apellido || ''} ${b.nombre || ''}`.toLowerCase();
        } else {
          return 0;
        }

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rows, q, sortBy, sortDir]);

  // 🔹 Botón de resultado (usa ResultadosModal)
  const getResultadoButton = (r) => {
    const estadoRaw = r.resultado?.estado || r.resultado || r.estado || "";
    const estado = String(estadoRaw || "").toLowerCase();
    const idInscripcion = r.idInscripcion || r.inscripcionId || r.id;

    console.log("🚧 Estado del candidato:", estado, r);

    const isNoResultado = !estado || estado === "pendiente" || estado === "sin";
    const isAceptado = estado === "aceptado" || estado === "aprobado";
    const isRechazado = estado === "rechazado";

    const color = isNoResultado ? "#444" : isAceptado ? "green" : isRechazado ? "red" : "#444";
    const label = isNoResultado ? "Añadir" : isAceptado ? "✅" : "❌";
    const readOnly = !isNoResultado; // ✅ Solo lectura si ya hay resultado

    return (
      <button
        className="btn-accion"
        style={{ fontSize: "1.1rem", color }}
        onClick={() => {
          if (!idInscripcion) {
            console.warn("⚠️ No se encontró id de inscripción para el candidato:", r);
            alert("No se encontró la inscripción asociada a este candidato.");
            return;
          }

          const modalRow = {
            ...r,
            idInscripcion,
            resultado:
              typeof r.resultado === "object"
                ? r.resultado
                : { estado: r.resultado || "", obs: r.observaciones || r.obs || "" },
          };

          setEditResultado({ ...modalRow, readOnly }); // ✅ se pasa al modal
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
        </div>

        <div className="abmc-topbar">
          <input className="abmc-input" placeholder="Buscar por apellido o canción" value={q} onChange={(e) => setQ(e.target.value)} />

          <select className="abmc-input" value={diaSel} onChange={(e) => {
            const v = e.target.value;
            setDiaSel(v);
            const params = new URLSearchParams(sp);
            if (v === '-' || v == null) {
              params.delete('dia');
            } else {
              params.set('dia', v);
            }
            setSearchParams(params);
          }}>
            <option value="-">-</option>
            {dias.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th className={thClass("hora")}>
                <span className="th-label">Hora</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("hora")}
                  aria-label="Ordenar por hora"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th className={thClass("apynom")}>
                <span className="th-label">Nombre</span>
                <button
                  type="button"
                  className="th-caret-btn"
                  onClick={() => toggleSort("apynom")}
                  aria-label="Ordenar por nombre"
                >
                  <span className="th-caret" aria-hidden />
                </button>
              </th>

              <th><span className="th-label">Canción</span></th>
              <th><span className="th-label">Resultado</span></th>
              <th style={{ textAlign: "center" }}></th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                  No hay candidatos en esta audición.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="abmc-row">
                  <td>{r.hora || "—"}</td>
                  <td>{(r.apellido || r.nombre) ? `${r.apellido || ''}, ${r.nombre || ''}` : "—"}</td>
                  <td>{r.cancion || "—"}</td>
                  <td style={{ textAlign: "center" }}>{getResultadoButton(r)}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-accion btn-accion--icon"
                      onClick={() => navigate(`/inscripcion/coordinadores/${r.id}`)}
                      title="Ver inscripción"
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
      {/* Modal de resultados */}
      {editResultado && (
        <ResultadosModal
          row={editResultado}
          readOnly={editResultado.readOnly}
          onClose={() => setEditResultado(null)}
          onSave={async (estado, obs) => {
            try {
              // 🔹 Actualizamos el resultado en el backend
              await candidatosService.updateResultado(editResultado.idInscripcion, {
                estado,
                obs,
                cuerda: editResultado.cuerda?.name,
                cancion: editResultado.cancion,
              });

              // 🔹 Recargamos el cronograma completo desde el backend
              setRefreshTrigger(prev => prev + 1);

              // 🔹 Cerramos modal
              setEditResultado(null);
            } catch (err) {
              console.error("❌ Error al guardar resultado:", err);
              alert("No se pudo guardar el resultado.");
            }
          }}
        />
      )}     
    </main>
  );
}