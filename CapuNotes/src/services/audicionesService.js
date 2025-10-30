<<<<<<< HEAD
import AudicionService from '@/services/audicionService.js';
import TurnoService from '@/services/turnoServices.js';

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
      fetch(`${import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')}/encuesta/audicion/${a.id}/candidatos`, { headers: { Accept: 'application/json' }, credentials: 'include' })
        .then(r => r.ok ? r.json() : [])
        .catch(() => []),
    ]);

    const byTurnoId = new Map();
    (inscripciones || []).forEach((i) => { if (i?.turno?.id) byTurnoId.set(i.turno.id, i); });

    const rows = (turnos || []).filter(t => {
      const d = new Date(t.fechaHoraInicio);
      return formatISO(d) === String(dia);
    }).map(t => {
      const insc = byTurnoId.get(t.id);
      const cand = insc?.candidato;
      const d = new Date(t.fechaHoraInicio);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
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

=======
import axios from 'axios';

const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV 
  ? DEV_PROXY_BASE 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { 'Content-Type': 'application/json' }
});

export const audicionesService = {
  /**
   * Lista todos los días disponibles de audición
   * @returns {Promise<Array<string>>} Lista de días
   */
  listDias: async () => {
    try {
      const response = await api.get('/audiciones/dias');
      return response.data;
    } catch (error) {
      console.error('Error al listar días:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lista los turnos de un día específico
   * @param {string} dia - Día de audición
   * @returns {Promise<Array>} Lista de turnos
   */
  listTurnos: async (dia) => {
    try {
      const response = await api.get(`/audiciones/turnos/${encodeURIComponent(dia)}`);
      return response.data;
    } catch (error) {
      console.error('Error al listar turnos:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene la audición actual
   * @returns {Promise<Object|null>} Datos de la audición actual o null
   */
  getActual: async () => {
    try {
      const response = await api.get('/audiciones/actual');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error('Error al obtener audición actual:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene todas las audiciones
   * @returns {Promise<Array>} Lista de audiciones
   */
  getAll: async () => {
    try {
      const response = await api.get('/audiciones');
      return response.data;
    } catch (error) {
      console.error('Error al listar audiciones:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene una audición por ID
   * @param {number} id - ID de la audición
   * @returns {Promise<Object>} Datos de la audición
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/audiciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener audición:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crea una nueva audición
   * @param {Object} audicion - Datos de la audición
   * @returns {Promise<Object>} Audición creada
   */
  create: async (audicion) => {
    try {
      const response = await api.post('/audiciones', audicion);
      return response.data;
    } catch (error) {
      console.error('Error al crear audición:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualiza una audición
   * @param {number} id - ID de la audición
   * @param {Object} audicion - Datos actualizados
   * @returns {Promise<Object>} Audición actualizada
   */
  update: async (id, audicion) => {
    try {
      const response = await api.put(`/audiciones/${id}`, audicion);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar audición:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Elimina una audición
   * @param {number} id - ID de la audición
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/audiciones/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Error al eliminar audición:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default audicionesService;
>>>>>>> Francisco-Demaria
