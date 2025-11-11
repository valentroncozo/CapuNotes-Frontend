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

  // ✅ NUEVO: Estados para manejar franjas originales
  const [esPublicada, setEsPublicada] = useState(false);
  const [franjasOriginales, setFranjasOriginales] = useState({}); // { 'YYYY-MM-DD': [franjas] }

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
        
        // ✅ NUEVO: Detectar si está publicada
        setEsPublicada(a.estado === 'PUBLICADA');
        
        setNombre(a.nombre || '');
        setDescripcion(a.descripcion || '');
        setUbicacion(a.lugar || '');
        if (a.fechaInicio) setDiaDesde(a.fechaInicio);
        if (a.fechaFin) setDiaHasta(a.fechaFin);
        setData(prev => ({ ...prev, nombre: a.nombre || '', ubicacion: a.lugar || '', fechaDesde: a.fechaInicio || '', fechaHasta: a.fechaFin || '' }));

        // Prefill días + franjas a partir de turnos existentes
        const turnos = await TurnoService.listarFranjasHorarias(a.id);
        const byDateKey = {};
        const originalesTemp = {}; // ✅ NUEVO: Para guardar franjas originales
        
        console.log('Turnos obtenidos para la audición:', turnos);

        for (const t of turnos || []) {
          const fechaBase = t.fecha;
          if (!fechaBase) continue;
          
          const [year, month, day] = fechaBase.split('-').map(Number);
          const horaInicio = t.horaInicio;
          const horaFin = t.horaFin;
          
          if (!horaInicio || !horaFin) continue;
          
          const localDate = new Date(year, month - 1, day);
          const keyDDMMYYYY = formatDDMMYYYY(localDate);
          const keyISO = fechaBase;
          
          const formatHora = (hora) => hora.substring(0, 5);
          
          const franja = { 
            horaDesde: formatHora(horaInicio), 
            horaHasta: formatHora(horaFin), 
            duracion: String(t.duracionTurno || 0),
            turnoId: t.id
          };
          
          if (!byDateKey[keyISO]) {
            byDateKey[keyISO] = { 
              date: localDate, 
              keyDDMMYYYY, 
              franjas: [] 
            };
          }
          byDateKey[keyISO].franjas.push(franja);
          
          // ✅ NUEVO: Guardar en franjas originales
          if (!originalesTemp[keyISO]) {
            originalesTemp[keyISO] = [];
          }
          originalesTemp[keyISO].push({
            horaDesde: formatHora(horaInicio),
            horaHasta: formatHora(horaFin),
            duracion: String(t.duracionTurno || 0)
          });
        }

        // ✅ NUEVO: Guardar franjas originales
        setFranjasOriginales(originalesTemp);
        console.log('📦 Franjas originales guardadas:', originalesTemp);

        const uniqueDates = Object.keys(byDateKey).sort();
        const toDates = uniqueDates.map(s => byDateKey[s].date);
        if (toDates.length > 0) {
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

  // ✅ CORREGIR: Función auxiliar para convertir DD/MM/YYYY o DD-MM-YYYY a YYYY-MM-DD
  const convertirFechaAISO = (fechaDDMMYYYY) => {
    if (!fechaDDMMYYYY || typeof fechaDDMMYYYY !== 'string') return null;
    
    // Aceptar tanto "/" como "-" como separadores
    const separador = fechaDDMMYYYY.includes('/') ? '/' : '-';
    const partes = fechaDDMMYYYY.split(separador);
    
    if (partes.length !== 3) return null;
    
    const [dia, mes, anio] = partes;
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };

  const handleGuardar = async () => {
    if (!audicion?.id) return;
    setIsSaving(true);
    try {
      // ✅ Si está en BORRADOR, eliminar todos los turnos primero
      if (!esPublicada) {
        console.log('Eliminando todos los turnos de la audición (BORRADOR)...');
        await TurnoService.eliminarTurnosPorAudicion(audicion.id);
      }
      
      // ✅ Filtrar franjas según el estado
      let diasParaEnviar = {};
      
      if (esPublicada) {
        // PUBLICADA: Solo enviar franjas NUEVAS (que no están en originales)
        Object.keys(data.dias || {}).forEach(fecha => {
          const franjasDelDia = data.dias[fecha] || [];
          const fechaISO = convertirFechaAISO(fecha);
          const originalesDelDia = franjasOriginales[fechaISO] || [];
          
          console.log(`Procesando día ${fecha} (ISO: ${fechaISO})`);
          console.log('Franjas del día:', franjasDelDia);
          console.log('Franjas originales:', originalesDelDia);
          
          const franjasNuevas = franjasDelDia.filter(franja => {
            // Verificar si esta franja NO existía originalmente
            const esOriginal = originalesDelDia.some(orig => 
              orig.horaDesde === franja.horaDesde && 
              orig.horaHasta === franja.horaHasta && 
              orig.duracion === franja.duracion
            );
            
            console.log(`Franja ${franja.horaDesde}-${franja.horaHasta} es original:`, esOriginal);
            
            return !esOriginal;
          });
          
          console.log('Franjas nuevas filtradas:', franjasNuevas);
          
          // Solo incluir el día si hay franjas nuevas
          if (franjasNuevas.length > 0) {
            diasParaEnviar[fecha] = franjasNuevas;
          }
        });
      } else {
        // BORRADOR: Enviar todas las franjas (ya eliminamos los turnos arriba)
        diasParaEnviar = data.dias || {};
      }

      // ✅ Validar que haya algo que enviar
      if (Object.keys(diasParaEnviar).length === 0) {
        Swal.fire({ 
          icon: 'info', 
          title: 'Sin cambios', 
          text: 'No hay nuevas franjas horarias para agregar',
          background: '#11103a', 
          color: '#E8EAED' 
        });
        setIsSaving(false);
        return;
      }

      const payload = {
        nombre,
        descripcion,
        ubicacion,
        fechaDesde: diaDesde ? formatDDMMYYYY(new Date(diaDesde)) : '',
        fechaHasta: diaHasta ? formatDDMMYYYY(new Date(diaHasta)) : '',
        dias: diasParaEnviar,
      };

      console.log('Estado de la audición:', esPublicada ? 'PUBLICADA' : 'BORRADOR');
      console.log('Payload a enviar:', payload);
      
      await saveEdicion(audicion.id, payload);
      
      const mensaje = esPublicada 
        ? 'Se han agregado las nuevas franjas horarias' 
        : 'Se han recreado todos los turnos según las franjas configuradas';
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Cambios guardados', 
        text: mensaje,
        timer: 2000, 
        showConfirmButton: false, 
        background: '#11103a', 
        color: '#E8EAED' 
      });
      navigate('/audicion');
    } catch (err) {
      console.error('Error al guardar:', err);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: err?.response?.data?.message || err?.response?.data || err.message || 'No se pudo actualizar la audición.', 
        background: '#11103a', 
        color: '#E8EAED' 
      });
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
          {/* ✅ NUEVO: Mostrar estado de la audición */}
          {audicion && (
            <span style={{ 
              marginLeft: 'auto', 
              padding: '4px 12px', 
              borderRadius: '4px', 
              backgroundColor: esPublicada ? '#28a745' : '#ffc107',
              color: esPublicada ? 'white' : 'black',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {esPublicada ? 'PUBLICADA' : 'BORRADOR'}
            </span>
          )}
        </header>

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
                    <TurnoSection 
                      key={index} 
                      index={index} 
                      day={formatDDMMYYYY(dia)} 
                      dias={dias} 
                      setDias={setDias} 
                      data={data} 
                      setData={setData}
                      franjasOriginales={franjasOriginales}
                      esPublicada={esPublicada}
                    />
                  ))
                ) : (
                  <p>No hay días seleccionados.</p>
                )}

                <button type='button' className='abmc-btn btn-primary btn-dias' onClick={handleAgregarDia}>Agregar día</button>
              </section>

              <section className='footer-audicion'>
                <button type='button' className='abmc-btn btn-secondary btn-dias' onClick={() => navigate('/audicion')}>Cancelar</button>
                <button type='button' className='abmc-btn btn-primary btn-dias' onClick={handleGuardar} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</button>
              </section>
            </section>
          </>
        )}
      </div>
    </main>
  );
}