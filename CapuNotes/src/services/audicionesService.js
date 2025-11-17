import AudicionService from '@/services/audicionService.js';
import TurnoService from '@/services/turnoServices.js';
import apiClient from '@/services/apiClient';

const formatISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const audicionesService = {
  listDias: async () => {
    const a = await AudicionService.getActual();
    if (!a?.id) return [];
    const resumen = await TurnoService.listarResumenPorDia(a.id);
    return (resumen || []).map(r => r.fecha);
  },

  listTurnos: async (dia) => {
    const a = await AudicionService.getActual();
    if (!a?.id) return [];
    const [turnos, inscripciones] = await Promise.all([
      TurnoService.listarPorAudicion(a.id),
      // EncuestaController devuelve inscripciones de la audición
  apiClient.get(`/encuesta/audicion/${a.id}/candidatos`)
        .then(data => data || [])
        .catch(() => []),
    ]);

    const byTurnoId = new Map();
    (inscripciones || []).forEach((i) => { if (i?.turno?.id) byTurnoId.set(i.turno.id, i); });

    const rows = (turnos || []).filter(t => {
      const fechaTurno = t.fechaHoraInicio.slice(0, 10); // YYYY-MM-DD
      return fechaTurno === dia;
    }).map(t => {
      const insc = byTurnoId.get(t.id);
      const cand = insc?.candidato;
      const [, horaParte] = t.fechaHoraInicio.split("T");
      const [hh, mm] = horaParte.split(":");
      return {
        id: t.id,
        hora: `${hh}:${mm}`,
        nombre: cand?.nombre || '-',
        apellido: cand?.apellido || '-',
        cancion: insc?.cancion || '-',
        turnoEstado: String(t.estado || '').toLowerCase(),
        inscripcion: insc ? {
          nombreApellido: `${cand?.nombre || ''} ${cand?.apellido || ''}`.trim(),
          tipoDni: cand?.id?.tipoDocumento || '',
          nroDni: cand?.id?.nroDocumento || '',
          fechaNacimiento: cand?.fechaNacimiento || '',
          correo: cand?.email || '',
          telefono: cand?.telefono || '',
          profesion: cand?.carreraProfesion || '',
          provincia: cand?.lugarOrigen || '',
          pais: '',
          cuerda: cand?.cuerda?.name || '',
          dia: dia,
          horario: `${hh}:${mm}`,
          preguntas: [],
        } : null,
      };
    });

    return rows;
  },
};

export default audicionesService;

