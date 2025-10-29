import AudicionService from '@/services/audicionService.js';

const base = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

export const candidatosService = {
  list: async () => {
    const a = await AudicionService.getActual();
    if (!a?.id) return [];
    const r = await fetch(`${base}/encuesta/audicion/${a.id}/candidatos`, { headers: { Accept: 'application/json' }, credentials: 'include' });
    if (!r.ok) return [];
    const insc = await r.json();
    const rows = (insc || []).map((i) => {
      const cand = i.candidato || {};
      const t = i.turno || {};
      const d = t.fechaHoraInicio ? new Date(t.fechaHoraInicio) : null;
      const hora = d ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` : '';
      return {
        id: i.id,
        hora,
        nombre: cand.nombre,
        apellido: cand.apellido,
        cancion: i.cancion,
        resultado: { estado: i.resultado, obs: i.observaciones },
        inscripcion: {
          nombreApellido: `${cand.nombre || ''} ${cand.apellido || ''}`.trim(),
          tipoDni: cand?.id?.tipoDocumento || '',
          nroDni: cand?.id?.nroDocumento || '',
          fechaNacimiento: cand?.fechaNacimiento || '',
          correo: cand?.email || '',
          telefono: cand?.telefono || '',
          provincia: cand?.lugarOrigen || '',
          pais: '',
          profesion: cand?.carreraProfesion || '',
          cuerda: cand?.cuerda?.name || '',
          dia: t.fechaHoraInicio ? t.fechaHoraInicio.slice(0,10) : '',
          horario: hora,
          preguntas: [],
        },
      };
    });
    return rows;
  },
};

export default candidatosService;




