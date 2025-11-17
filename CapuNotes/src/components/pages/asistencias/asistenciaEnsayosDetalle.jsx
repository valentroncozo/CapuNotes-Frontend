import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { asistenciasService } from '@/services/asistenciasService.js';
import { miembrosService } from '@/services/miembrosService.js';
import { ensayosService } from '@/services/ensayosService.js';
import { cuerdasService } from '@/services/cuerdasService.js';
import BackButton from '@/components/common/BackButton.jsx';
import Swal from 'sweetalert2';
import '@/styles/abmc.css';
import '@/styles/table.css';
import '@/styles/asistencia.css';
import Loader from '@/components/common/Loader.jsx';
import CheckIcon from '@/assets/CheckIcon';
import CloseIcon from '@/assets/CloseIcon';

const ESTADOS_MAP = {
  no: 'AUSENTE',
  half: 'MEDIA_FALTA',
  yes: 'PRESENTE',
};

export default function AsistenciaEnsayosDetalle() {
  const navigate = useNavigate();
  const { idEnsayo } = useParams();

  const [ensayoInfo, setEnsayoInfo] = useState({
    id: null,
    fecha: '-',
    nombre: '-',
    estadoAsistencia: 'PENDIENTE',
  });

  const [members, setMembers] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterCuerda, setFilterCuerda] = useState('todas');

  // ============================================================
  // 🔹 Cargar Ensayo + Miembros + Asistencias + Cuerdas
  // ============================================================
  useEffect(() => {
    if (!idEnsayo) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const ensayoData = await ensayosService.getById(idEnsayo);
        const estadoEnsayo = ensayoData?.estadoAsistencia || 'PENDIENTE';

        const [miembrosData, asistenciasData, cuerdasData] = await Promise.all([
          miembrosService.list().catch(() => []),
          asistenciasService.listPorEnsayo(idEnsayo).catch(() => []),
          cuerdasService.list().catch(() => []),
        ]);

        setCuerdas(cuerdasData);

        const asistenciaMap = new Map();
        asistenciasData.forEach((a) => {
          const nombre = (a.nombreMiembro || '').trim().toLowerCase();
          const apellido = (a.apellidoMiembro || '').trim().toLowerCase();
          asistenciaMap.set(`${nombre}-${apellido}`, a.estado);
        });

        const mappedMembers = miembrosData.map((m, i) => {
          const nombre = (m.nombre || '').trim().toLowerCase();
          const apellido = (m.apellido || '').trim().toLowerCase();
          const clave = `${nombre}-${apellido}`;
          const estadoBackend = asistenciaMap.get(clave);

          const estado =
            estadoEnsayo === 'PENDIENTE'
              ? 'AUSENTE'
              : estadoBackend || 'AUSENTE';

          const asistenciaLocal =
            Object.entries(ESTADOS_MAP).find(([, v]) => v === estado)?.[0] ||
            'no';

          return {
            uid: `${nombre}-${apellido}-${i}`,
            id: m.id,
            nombre: `${m.nombre || ''} ${m.apellido || ''}`.trim(),
            cuerdaId: m.cuerda?.id || null,
            cuerdaNombre: m.cuerda?.name || '-',
            asistencia: asistenciaLocal,
            raw: m,
          };
        });

        setEnsayoInfo({
          id: ensayoData?.id || idEnsayo,
          fecha: ensayoData?.fechaInicio || '-',
          nombre: ensayoData?.nombre || ensayoData?.descripcion || '-',
          estadoAsistencia: estadoEnsayo,
        });

        setMembers(mappedMembers);
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEnsayo]);

  // ============================================================
  //  Filtros
  // ============================================================
  const cuerdaOptions = useMemo(() => {
    return [{ id: 'todas', name: 'Todas las cuerdas' }, ...cuerdas];
  }, [cuerdas]);

  const filteredMembers = useMemo(() => {
    const name = filterName.trim().toLowerCase();
    console.log('Valor de filterName:', name); // Depuración
    return members.filter((m) => {
      // Filtrar por cuerda (por id)
      if (filterCuerda !== 'todas' && m.cuerdaId?.toString() !== filterCuerda) {
        return false;
      }
      // 🎵 Filtrar por nombre
      if (name && !m.nombre.toLowerCase().includes(name)) return false;
      return true;
    });
  }, [members, filterName, filterCuerda]);

  // ============================================================
  // Cambiar estado local de asistencia
  // ============================================================
  const handleSetAsistencia = (uid, value) => {
    if (ensayoInfo.estadoAsistencia === 'CERRADA') return;
    setMembers((prev) =>
      prev.map((m) => (m.uid === uid ? { ...m, asistencia: value } : m))
    );
  };

  // ============================================================
  // Guardar (y opcionalmente cerrar)
  // ============================================================
  const handleGuardar = async (cerrar = false) => {
    setSaving(true);
    try {
      const payload = {
        asistencias: members.map((m) => ({
          estado: ESTADOS_MAP[m.asistencia],
          miembro: {
            id: {
              tipoDocumento: m.raw?.id?.tipoDocumento || 'DNI',
              nroDocumento: m.raw?.id?.nroDocumento || m.raw?.nroDocumento,
            },
          },
        })),
      };

      await asistenciasService.registrarAsistenciasMasivas(idEnsayo, payload);
      if (cerrar) await asistenciasService.cerrarAsistencia(idEnsayo);

      Swal.fire({
        icon: 'success',
        title: cerrar
          ? 'Asistencia guardada y cerrada'
          : 'Asistencias guardadas correctamente',
        timer: 1500,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });

      setTimeout(() => navigate(-1), 1300);
    } catch (error) {
      console.error('❌ Error al guardar asistencias:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar asistencias',
        text: 'Ocurrió un error al procesar las asistencias.',
        background: '#11103a',
        color: '#E8EAED',
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  //  Render
  // ============================================================
  if (loading) return <Loader />;

  const isCerrada = ensayoInfo.estadoAsistencia === 'CERRADA';

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        {/* ======= ENCABEZADO ======= */}
        <div className="abmc-header asistencia-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BackButton />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1
                className="abmc-title"
                style={{
                  fontSize: '1.9rem',
                  fontWeight: 700,
                  marginBottom: '0.3rem',
                }}
              >
                Asistencia {ensayoInfo.nombre}
              </h1>
              <span
                style={{
                  fontSize: '1.05rem',
                  opacity: 0.85,
                  marginTop: '0.1rem',
                }}
              >
                {ensayoInfo.fecha
                  ? ensayoInfo.fecha.split('-').reverse().join('/')
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        <div
          className="asistencia-estado"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginBottom: '1.6rem',
          }}
        >
          <span
            className="badge"
            style={{
              backgroundColor:
                ensayoInfo.estadoAsistencia === 'CERRADA'
                  ? '#FF6B6B'
                  : ensayoInfo.estadoAsistencia === 'ABIERTA'
                  ? '#1FA453'
                  : '#b6b4b4ff',
              color: 'var(--text-light)',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {ensayoInfo.estadoAsistencia}
          </span>
        </div>

        {/* 🔸 Filtros */}
        <div className="abmc-topbar">
          <input
            className="abmc-input"
            placeholder="Buscar por nombre"
            value={filterName}
            onChange={(e) => {
              console.log('Valor ingresado:', e.target.value); // Depuración
              setFilterName(e.target.value);
            }}
          />
          <select
            className="abmc-select"
            value={filterCuerda}
            onChange={(e) => {
              console.log('Cuerda seleccionada:', e.target.value); // Depuración
              setFilterCuerda(e.target.value);
            }}
            disabled={isCerrada}
            style={{ minWidth: 220 }}
          >
            {cuerdaOptions.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Miembro</th>
              <th>Cuerda</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m.uid} className="abmc-row">
                <td>{m.nombre}</td>
                <td>{m.cuerdaNombre}</td>
                <td>
                  <div className="attendance-actions">
                    <button
                      className={`attendance-btn ${
                        m.asistencia === 'no' ? 'selected' : ''
                      }`}
                      onClick={() => handleSetAsistencia(m.uid, 'no')}
                      title="Ausente"
                      disabled={saving || isCerrada}
                    >
                      <CloseIcon fill="var(--text-light)" />
                    </button>

                    <button
                      className={`attendance-btn ${
                        m.asistencia === 'half' ? 'selected white-text' : ''
                      }`}
                      onClick={() => handleSetAsistencia(m.uid, 'half')}
                      title="Media falta"
                      disabled={saving || isCerrada}
                    >
                      ½
                    </button>

                    <button
                      className={`attendance-btn ${
                        m.asistencia === 'yes' ? 'selected' : ''
                      }`}
                      onClick={() => handleSetAsistencia(m.uid, 'yes')}
                      title="Presente"
                      disabled={saving || isCerrada}
                    >
                      <CheckIcon fill="var(--text-light)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔸 Botones */}
        <div
          className="pop-footer"
          style={{
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => handleGuardar(false)}
            disabled={saving || isCerrada}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>

          <button
            className="btn btn-danger"
            onClick={() => handleGuardar(true)}
            disabled={saving || isCerrada}
          >
            {saving ? 'Cerrando...' : 'Guardar y cerrar asistencia'}
          </button>
        </div>
      </div>
    </main>
  );
}