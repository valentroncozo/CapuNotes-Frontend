import AudicionService from '@/services/audicionService.js';
import TurnoService from '@/services/turnoServices.js';

// Igual a sendToService pero actualizando la audición existente
const convertToISODate = (dateStr) => {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) { const [d,m,y] = dateStr.split('-'); return `${y}-${m}-${d}`; }
  return dateStr;
};

export default async function saveEdicion(audicionId, data) {
  // 1) Actualizar audición
  const patch = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    lugar: data.ubicacion,
    fechaInicio: convertToISODate(data.fechaDesde),
    fechaFin: convertToISODate(data.fechaHasta),
    estadoAudicion: data.estadoAudicion || '',
  };
  await AudicionService.actualizarParcial(audicionId, patch);

  // 2) Generar turnos adicionales según franjas nuevas
  const diasObj = data?.dias || {};
  for (const key of Object.keys(diasObj)) {
    const franjas = diasObj[key] || [];
    for (const turno of franjas) {
      const duracion = parseInt(turno.duracion, 10);
      if (!duracion || !turno.horaDesde || !turno.horaHasta) continue;
      const turnoReq = {
        fecha: convertToISODate(key),
        horaInicio: turno.horaDesde,
        horaFin: turno.horaHasta,
        duracionTurno: duracion,
      };
      await TurnoService.generarTurnos(audicionId, turnoReq);
    }
  }
}

