import '@/styles/abmc.css';
import '@/styles/audicion.css';
import { useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import AudicionService from '@/services/audicionService.js';
import TurnoService from '@/services/turnoServices.js';
import getDateRangeDates, { formatDDMMYYYY } from './components/utils/obtenerDias.js';
import TurnoSection from './components/TurnoSection';
import saveEdicion from './components/utils/saveEdicionServices.js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function AudicionEditar({ title = 'Modificar Audición' }) {
  const navigate = useNavigate();
  const [audicion, setAudicion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [diaDesde, setDiaDesde] = useState('');
  const [diaHasta, setDiaHasta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [nombre, setNombre] = useState('');

  const [dias, setDias] = useState([]); // array<Date>
  const [data, setData] = useState({ nombre: '', ubicacion: '', fechaDesde: '', fechaHasta: '', dias: {} });

  // Sync data.dias con lista de días
  useEffect(() => {
    setData(prev => {
      const next = { ...(prev || {}), dias: {} };
      (dias || []).forEach(d => {
        const key = formatDDMMYYYY(d);
        next.dias[key] = prev?.dias?.[key] || [];
      });
      return next;
    });
  }, [dias]);

  useEffect(() => {
    (async () => {
      try {
        const a = await AudicionService.getActual();
        setAudicion(a);
        if (!a) {
          setLoading(false);
          return;
        }
        setNombre(a.nombre || '');
        setDescripcion(a.descripcion || '');
        setUbicacion(a.lugar || '');
        if (a.fechaInicio) setDiaDesde(a.fechaInicio);
        if (a.fechaFin) setDiaHasta(a.fechaFin);
        setData(prev => ({ ...prev, nombre: a.nombre || '', ubicacion: a.lugar || '', fechaDesde: a.fechaInicio || '', fechaHasta: a.fechaFin || '' }));

        // Prefill días + franjas a partir de turnos existentes
        const turnos = await TurnoService.listarPorAudicion(a.id);
        const byDateKey = {};
        for (const t of turnos || []) {
          const start = t.fechaHoraInicio ? new Date(t.fechaHoraInicio) : (t.fecha ? new Date(t.fecha) : null);
          const end = t.fechaHoraFin ? new Date(t.fechaHoraFin) : null;
          if (!start || isNaN(start.getTime()) || !end || isNaN(end.getTime())) continue;
          const keyISO = `${start.getFullYear()}-${String(start.getMonth()+1).padStart(2,'0')}-${String(start.getDate()).padStart(2,'0')}`;
          const keyDDMMYYYY = formatDDMMYYYY(start);
          const hhmm = (d) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
          const durMin = Math.max(0, Math.round((end - start) / 60000));
          const franja = { horaDesde: hhmm(start), horaHasta: hhmm(end), duracion: String(durMin) };
          // Usar fecha local (00:00) para evitar desfasajes por timezone
          const dateLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          if (!byDateKey[keyISO]) byDateKey[keyISO] = { date: dateLocal, keyDDMMYYYY, franjas: [] };
          byDateKey[keyISO].franjas.push(franja);
        }

        const uniqueDates = Object.keys(byDateKey).sort();
        const toDates = uniqueDates.map(s => byDateKey[s].date);
        if (toDates.length > 0) {
          // set days + range
          setDias(toDates);
          setDiaDesde(uniqueDates[0]);
          setDiaHasta(uniqueDates[uniqueDates.length - 1]);
          const diasObj = {};
          uniqueDates.forEach(iso => { diasObj[byDateKey[iso].keyDDMMYYYY] = byDateKey[iso].franjas; });
          setData(prev => ({ ...prev, fechaDesde: formatDDMMYYYY(new Date(uniqueDates[0])), fechaHasta: formatDDMMYYYY(new Date(uniqueDates[uniqueDates.length - 1])), dias: { ...(prev?.dias||{}), ...diasObj } }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlerObtenerDias = (e) => {
    e.preventDefault();
    setDias([]);
    const diasObtenidos = getDateRangeDates(diaDesde, diaHasta);
    setDias(diasObtenidos);
    setData(prev => ({ ...prev, fechaDesde: diaDesde ? formatDDMMYYYY(new Date(diaDesde)) : '', fechaHasta: diaHasta ? formatDDMMYYYY(new Date(diaHasta)) : '' }));
  };

  const handleAgregarDia = () => {
    if (!dias || dias.length === 0) {
      if (!diaDesde) return;
      const [y, m, d] = diaDesde.split('-');
      const first = new Date(Number(y), Number(m) - 1, Number(d));
      setDias([first]);
      if (!diaHasta) setDiaHasta(`${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, '0')}-${String(first.getDate()).padStart(2, '0')}`);
      return;
    }
    const ultimo = dias[dias.length - 1];
    const siguiente = new Date(ultimo.getTime());
    siguiente.setDate(siguiente.getDate() + 1);
    setDias(prev => [...prev, siguiente]);
    const yy = siguiente.getFullYear();
    const mm = String(siguiente.getMonth() + 1).padStart(2, '0');
    const dd = String(siguiente.getDate()).padStart(2, '0');
    setDiaHasta(`${yy}-${mm}-${dd}`);
  };

  const handleGuardar = async () => {
    if (!audicion?.id) return;
    setIsSaving(true);
    try {
      const payload = {
        nombre,
        descripcion,
        ubicacion,
        fechaDesde: diaDesde ? formatDDMMYYYY(new Date(diaDesde)) : '',
        fechaHasta: diaHasta ? formatDDMMYYYY(new Date(diaHasta)) : '',
        dias: data.dias || {},
      };
      await saveEdicion(audicion.id, payload);
      Swal.fire({ icon: 'success', title: 'Cambios guardados', timer: 1500, showConfirmButton: false, background: '#11103a', color: '#E8EAED' });
      navigate('/audicion');
    } catch (err) {
      console.error('Error al guardar:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: err?.response?.data || err.message || 'No se pudo actualizar la audición.', background: '#11103a', color: '#E8EAED' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <main className='audicion-page'>
      <div className='abmc-card'>
        <header className='abmc-header'>
          <BackButton />
          <h1 className='abmc-title'>{title}</h1>
        </header>
        <hr className='divider' />

        {!audicion ? (
          <p style={{ padding: 16 }}>No hay audición actual para modificar.</p>
        ) : (
          <>
            <section className='content-form-audicion'>
              <form className='form-audicion' onSubmit={handlerObtenerDias}>
                <div className='form-group-miembro'>
                  <label htmlFor='lugar'>Lugar</label>
                  <input id='lugar' name='lugar' className='abmc-input' value={ubicacion} onChange={(e) => { setUbicacion(e.target.value); setData(prev => ({ ...prev, ubicacion: e.target.value })); }} />
                </div>

                <div className='content-inputs-date-audicion'>
                  <div className='form-group-miembro'>
                    <label htmlFor='descripcion'>Descripción</label>
                    <input id='descripcion' name='descripcion' className='abmc-input' value={descripcion} onChange={(e) => { setDescripcion(e.target.value); setData(prev => ({ ...prev, descripcion: e.target.value })); }} />
                  </div>
                </div>

                <div className='content-inputs-date-audicion'>
                  <div className='inputs-date-audicion'>
                    <label htmlFor='fechaDesde'>Fecha Desde</label>
                    <input type='date' id='fechaDesde' name='fechaDesde' className='abmc-input' value={diaDesde} onChange={(e) => { setDiaDesde(e.target.value); setData(prev => ({ ...prev, fechaDesde: e.target.value ? formatDDMMYYYY(new Date(e.target.value)) : '' })); }} required />
                  </div>

                  <div className='inputs-date-audicion'>
                    <label htmlFor='fechaHasta'>Fecha Hasta</label>
                    <input type='date' id='fechaHasta' name='fechaHasta' className='abmc-input' value={diaHasta} onChange={(e) => { setDiaHasta(e.target.value); setData(prev => ({ ...prev, fechaHasta: e.target.value ? formatDDMMYYYY(new Date(e.target.value)) : '' })); }} required />
                  </div>

                  <div className='button-date-audicion'>
                    <button type='submit' className='abmc-btn btn-primary'>Actualizar Fechas</button>
                  </div>
                </div>
              </form>

              <hr className='divider' />

              <section className='content-turno-input'>
                {dias.length > 0 ? (
                  dias.map((dia, index) => (
                    <TurnoSection key={index} index={index} day={formatDDMMYYYY(dia)} dias={dias} setDias={setDias} data={data} setData={setData} />
                  ))
                ) : (
                  <p>No hay días seleccionados.</p>
                )}

                <button type='button' className='abmc-btn btn-primary btn-dias' onClick={handleAgregarDia}>Agregar día</button>
              </section>

              <section className='abmc-topbar'>
                <button type='button' className='abmc-btn btn-secondary btn-dias' onClick={() => navigate('/audicion')}>Cancelar</button>
                <button type='button' className='abmc-btn btn-primary btn-dias' onClick={handleGuardar} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
              </section>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
