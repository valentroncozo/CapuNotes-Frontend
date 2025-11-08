import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// 🛑 Importar el nuevo servicio de asistencias
import { asistenciasService } from '@/services/asistenciasService.js';
import { miembrosService } from '@/services/miembrosService.js';
import { ensayosService } from '@/services/ensayosService.js';
import BackButton from '@/components/common/BackButton.jsx';
import Swal from 'sweetalert2';
import '@/styles/abmc.css';
import '@/styles/table.css';
import '@/styles/asistencia.css';

// 🛑 Definimos las constantes del estado de asistencia para mapear al Backend (Java Enum)
const ESTADOS_MAP = {
  no: 'AUSENTE',
  half: 'MEDIO',
  yes: 'PRESENTE',
};

// Reverse map: backend state -> local key
const REVERSE_ESTADOS = Object.entries(ESTADOS_MAP).reduce((acc, [k, v]) => {
  acc[v] = k;
  return acc;
}, {});

export default function AsistenciaEnsayosDetalle() {
  const navigate = useNavigate();
  // 🛑 CAMBIO: Obtener idEnsayo de los parámetros
  const { idEnsayo } = useParams();

  // Estado para la información del Ensayo (nombre, fecha)
  const [ensayoInfo, setEnsayoInfo] = useState({
    id: null,
    fecha: '-',
    descripcion: '',
  });

  // Estado para la lista real de asistencias
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [filterCuerda, setFilterCuerda] = useState('Todas');

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
          if (a.miembro && a.miembro.id && a.miembro.id.nroDocumento)
            keys.push(String(a.miembro.id.nroDocumento));
          if (a.miembroNroDocumento) keys.push(String(a.miembroNroDocumento));
          // además, formar por nombre-apellido (fallback)
          const nombreKey = `${(a.miembroNombre || a.miembro?.nombre || '')
            .trim()
            .toLowerCase()}|${(a.miembroApellido || a.miembro?.apellido || '')
            .trim()
            .toLowerCase()}`;
          keys.push(nombreKey);

          keys.forEach((k) => {
            if (k) asistenciaMap.set(k, a);
          });
        });

        // Mapear los miembros (todos) y unir con la asistencia si existe
        // Generamos un uid estable por fila para evitar colisiones cuando `id` no sea primitivo
        const mappedMembers = (
          Array.isArray(miembrosData) ? miembrosData : []
        ).map((m, idx) => {
          const doc = m.id?.nroDocumento || m.numeroDocumento || m.id || '';
          const nameKey = `${(m.nombre || '').trim().toLowerCase()}|${(
            m.apellido || ''
          )
            .trim()
            .toLowerCase()}`;

          const found =
            asistenciaMap.get(String(doc)) ||
            asistenciaMap.get(nameKey) ||
            asistenciaMap.get(String(m.id)) ||
            null;

          const estadoBackend =
            found?.estado ||
            found?.estadoAsistencia ||
            found?.estadoAsistenciaCodigo ||
            null;
          const asistenciaLocal = estadoBackend
            ? REVERSE_ESTADOS[estadoBackend] || null
            : null;

          // uid: prefer numeric/string document or DB id; fallback to name+idx to guarantee uniqueness
          const uidBase =
            doc ||
            (m.id !== undefined && m.id !== null ? String(m.id) : null) ||
            `${m.nombre || ''}-${m.apellido || ''}-${idx}`;
          const uid = String(uidBase);

          return {
            uid,
            id: doc || (m.id !== undefined && m.id !== null ? m.id : uid),
            nombre: `${m.nombre || ''} ${m.apellido || ''}`.trim(),
            asistencia: asistenciaLocal,
            cuerda: m.cuerda?.name || m.cuerda?.nombre || m.cuerda || '',
            ensayoId: idEnsayo,
            raw: m,
          };
        });

        // Intentar obtener info del ensayo desde el endpoint de ensayos/eventos
        try {
          const ensayo = await ensayosService
            .getById(idEnsayo)
            .catch(() => null);
          if (ensayo) {
            setEnsayoInfo({
              id: ensayo.id || idEnsayo,
              fecha: ensayo.fechaInicio || ensayo.fecha || '-',
              descripcion: ensayo.nombre || ensayo.descripcion || '-',
            });
          } else if (
            Array.isArray(asistenciasData) &&
            asistenciasData.length > 0
          ) {
            setEnsayoInfo({
              id: idEnsayo,
              fecha:
                asistenciasData[0].ensayoFecha ||
                asistenciasData[0].fechaInicio ||
                '-',
              descripcion:
                asistenciasData[0].ensayoDescripcion ||
                asistenciasData[0].nombre ||
                '-',
            });
          } else {
            setEnsayoInfo({ id: idEnsayo, fecha: '-', descripcion: '-' });
          }
        } catch {
          setEnsayoInfo({ id: idEnsayo, fecha: '-', descripcion: '-' });
        }
        console.table(
          mappedMembers.map((m) => ({
            uid: m.uid,
            nombre: m.nombre,
            doc:
              m.raw?.id?.nroDocumento ||
              m.raw?.numeroDocumento ||
              m.raw?.id ||
              '',
          }))
        );

        setMembers(mappedMembers);
      } catch (error) {
        console.error('❌ Error al cargar asistencias:', error);
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
    return ['Todas', ...Array.from(set)];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const name = String(filterName || '')
      .trim()
      .toLowerCase();
    // 🛑 CAMBIO: Usar id para filtrar si es necesario (asumimos que la API filtra por cuerda/nombre)
    return members.filter((m) => {
      if (filterCuerda && filterCuerda !== 'Todas' && m.cuerda !== filterCuerda)
        return false;
      if (!name) return true;
      return m.nombre.toLowerCase().includes(name);
    });
  }, [members, filterName, filterCuerda]);

  // Ahora identificamos filas por uid para evitar colisiones en `id`/objects
  const handleSetAsistencia = (uid, value) => {
    setMembers((prev) =>
      prev.map((m) => (m.uid === uid ? { ...m, asistencia: value } : m))
    );
  };

  // ----------------------------------------------------
  // 🔹 Guardar Asistencia (Registro Masivo)
  // ----------------------------------------------------
  const handleGuardar = async () => {
    setSaving(true);
    try {
      const registradoPor =
        localStorage.getItem('capunotes_user') || 'UsuarioActual';

      // Filtramos los miembros que tienen asistencia marcada
      const asistencias = members.filter((m) => m.asistencia);

      if (asistencias.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin cambios',
          text: 'No se seleccionó ninguna asistencia.',
          background: '#11103a',
          color: '#E8EAED',
        });
        setSaving(false);
        return;
      }

      // Construimos un array para el endpoint masivas: [ { miembroId, estado, registradoPor }, ... ]
      const asistenciasPayloadArray = asistencias
        .map((m) => {
          const estado = ESTADOS_MAP[m.asistencia];
          if (!estado) return null;

          const raw = m.raw || null;
          let miembroId = null;

          if (raw) {
            // Preferir id numérico si existe
            if (
              raw.id !== undefined &&
              raw.id !== null &&
              !isNaN(Number(raw.id))
            ) {
              miembroId = Number(raw.id);
            } else if (
              raw.miembroId !== undefined &&
              raw.miembroId !== null &&
              !isNaN(Number(raw.miembroId))
            ) {
              miembroId = Number(raw.miembroId);
            } else if (raw.numeroDocumento || raw.nroDocumento) {
              // fallback: usar documento como identificador si el backend lo acepta
              miembroId = raw.numeroDocumento || raw.nroDocumento;
            }
          } else if (
            m.id !== undefined &&
            m.id !== null &&
            !isNaN(Number(m.id))
          ) {
            miembroId = Number(m.id);
          }

          const entry = { estado, registradoPor };
          if (miembroId !== null && miembroId !== undefined && miembroId !== '')
            entry.miembroId = miembroId;
          else if (raw) entry.miembro = { id: raw.id ?? raw }; // última opción: enviar objeto miembro

          return entry;
        })
        .filter(Boolean);

      console.log(
        '📤 Payload asistencias masivas (array) (enviando):',
        asistenciasPayloadArray
      );

      await asistenciasService.registrarAsistenciasMasivas(
        idEnsayo,
        asistenciasPayloadArray
      );

      Swal.fire({
        icon: 'success',
        title: 'Asistencias guardadas',
        text: 'Se registraron correctamente todas las asistencias.',
        timer: 1600,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });

      navigate(-1);
    } catch (error) {
      console.error('❌ Error al guardar asistencia:', error);
      const msg =
        error?.response?.data || error?.message || 'Error desconocido';
      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        html: `<pre style="text-align:left;white-space:pre-wrap">${JSON.stringify(
          msg,
          null,
          2
        )}</pre>`,
        background: '#11103a',
        color: '#E8EAED',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Cargando asistencias...</div>;
  }

  if (!ensayoInfo.id) {
    return (
      <div className="error-message">
        Error: Ensayo no encontrado o ID inválido.
      </div>
    );
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
                  <span className="th-label">
                    {filterCuerda && filterCuerda !== 'Todas'
                      ? `Miembros - ${filterCuerda}`
                      : 'Miembros'}
                  </span>
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
                    <div
                      className="attendance-actions"
                      role="group"
                      aria-label={`asistencia-${m.uid}`}
                    >
                      <button
                        className={`attendance-btn ${
                          m.asistencia === 'no' ? 'selected' : ''
                        }`}
                        onClick={() => handleSetAsistencia(m.uid, 'no')}
                        aria-pressed={m.asistencia === 'no'}
                        title="Ausente"
                        disabled={saving}
                      >
                        ✖
                      </button>

                      <button
                        className={`attendance-btn ${
                          m.asistencia === 'half' ? 'selected' : ''
                        }`}
                        onClick={() => handleSetAsistencia(m.uid, 'half')}
                        aria-pressed={m.asistencia === 'half'}
                        title="Medio"
                        disabled={saving}
                      >
                        ½
                      </button>

                      <button
                        className={`attendance-btn ${
                          m.asistencia === 'yes' ? 'selected' : ''
                        }`}
                        onClick={() => handleSetAsistencia(m.uid, 'yes')}
                        aria-pressed={m.asistencia === 'yes'}
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
          <div className="pop-footer" style={{ justifyContent: 'center' }}>
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
