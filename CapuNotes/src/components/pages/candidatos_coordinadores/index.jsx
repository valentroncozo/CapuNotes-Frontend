import '@/styles/abmc.css';
import '@/styles/table.css';
import BackButton from '@/components/common/BackButton.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import AudicionService from '@/services/audicionService.js';
import InscripcionView from '@/components/common/InscripcionView.jsx';
import TableABMC from '@/components/common/table.jsx';
import TurnoService from '@/services/turnoServices';
import { XCircleFill } from "react-bootstrap-icons";
import EyeOnIcon from '@/assets/VisibilityOnIcon';


export default function CandidatosCoordinadoresPage({ title = 'Cronograma (Administrador)' }) {

  const [dias, setDias] = useState([]); // [{ value, label }]
  const [diaSel, setDiaSel] = useState('-');
  const [cronograma, setCronograma] = useState([]);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [viewRow, setViewRow] = useState(null);

  const [sp, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const handlerCancelarTurno = async (d) => {
    if (!d || !d.id) {
      console.warn('No se proporcionó un turno válido para cancelar.');
      return;
    }

    const confirm = window.confirm(`¿Está seguro que desea cancelar el turno de ${d.apellido}, ${d.nombre} a las ${d.hora}?`);
    if (!confirm) return;

    try {
      await TurnoService.actualizarEstado(d.raw.turno.id, 'CANCELADO');
      alert('Turno cancelado correctamente.');
      // Refrescar la lista de turnos
      const a = await AudicionService.getActual();
      if (a?.id) {
        const cron = await AudicionService.getCronograma(a.id);
        setCronograma(cron || []);
      }

    }
    catch (e) {
      console.error('Error al cancelar el turno:', e);
      alert('No se pudo cancelar el turno. Por favor, intente nuevamente.');
    }
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
  }, [sp]);

  // Calcular rows a partir del cronograma y diaSel
  useEffect(() => {
    const build = () => {
      if (!cronograma || cronograma.length === 0) { setRows([]); return; }
      const items = (diaSel && diaSel !== '-') ? cronograma.filter(it => it?.turno?.fecha === diaSel) : cronograma;
      const mapped = items.map(item => {
        const horaRaw = item?.turno?.horaInicio || item?.turno?.hora || item?.turno?.fechaHoraInicio || '';
        const hora = horaRaw ? String(horaRaw).slice(0,5) : '-';
        return {
          id: item?.id ?? item?.turno?.id,
          hora,
          nombre: item?.nombre || '-',
          apellido: item?.apellido || '-',
          cancion: item?.cancion || '-',
          turnoEstado: item?.turno?.estado || '',
          inscripcion: item?.inscripcion || null,
          raw: item,
        };
      });
      setRows(mapped);
    };

    build();
  }, [cronograma, diaSel]);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter(r => `${r.apellido || ''}, ${r.nombre || ''}`.toLowerCase().includes(t) || String(r.cancion||'').toLowerCase().includes(t));
  }, [rows, q]);

  const headers = ['Hora', 'Apellido', 'Nombre', 'Canción', 'Acciones'];
  const columns = ['hora', 'apellido', 'nombre', 'cancion'];

  const actions = [
    {
      className: 'abmc-btn btn-primary',
      onClick: (d) => { handlerCancelarTurno(d); },
      title: 'Cancelar turno',
      icon: <XCircleFill />,
      label: ''
    },
    {
      className: 'abmc-btn ',
      onClick: (d) => { navigate(`/inscripcion/${d.id}`); },
      title: 'Ver inscripción',
      icon: <EyeOnIcon/>,
    }
  ];

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

        <TableABMC
          headers={headers}
          data={filtered}
          columns={columns}
          actions={actions}
          emptyMenssage="No hay candidatos"
        />

      </div>

      {viewRow && (
        <InscripcionView data={viewRow.inscripcion} open={true} onClose={() => setViewRow(null)} editable={false} />
      )}
    </main>
  );
}
