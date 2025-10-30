<<<<<<< HEAD
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
=======
// src/services/candidatosService.js
import axios from "axios";

const DEV_PROXY_BASE = "/api";
const resolvedBaseURL = import.meta.env.DEV
  ? DEV_PROXY_BASE
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { "Content-Type": "application/json" },
});

export const candidatosService = {
  /**
   * Lista todos los candidatos de la audición actual
   * @returns {Promise<Array>} Lista de candidatos
   */
  list: async () => {
    try {
      const response = await api.get("/candidatos");
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar candidatos:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene un candidato por ID
   * @param {number} id - ID del candidato
   * @returns {Promise<Object>} Datos del candidato
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/candidatos/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener candidato:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
 * 🔄 Crea o actualiza el resultado de una inscripción de audición
 * @param {number} idInscripcion - ID de la inscripción
 * @param {{estado: string, obs: string}} data - Datos a guardar
 * @returns {Promise<Object>} Inscripción actualizada
 */
  updateResultado: async (idInscripcion, data) => {
  try {
    const payload = {
      resultado: (data.estado || "SIN").toUpperCase(),
      observaciones: data.obs || "",
      cuerda: { name: data.cuerda || "Tenor" },
      cancion: data.cancion || undefined,
    };

    console.log("📤 PATCH /encuesta/audicion/inscripciones", idInscripcion, payload);

    const response = await api.patch(
      `/encuesta/audicion/inscripciones/${idInscripcion}`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar resultado:", error);
    throw error.response?.data || error.message;
  }
},


  /**
   * Actualiza la cuerda de la inscripción de un candidato
   * @param {number} id - ID del candidato
   * @param {string} cuerda - Nueva cuerda
   * @returns {Promise<Object>} Candidato actualizado
   */
  updateInscripcionCuerda: async (id, cuerda) => {
    try {
      const response = await api.patch(`/candidatos/${id}/cuerda`, { cuerda });
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar cuerda:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crea un nuevo candidato
   * @param {Object} candidato - Datos del candidato
   * @returns {Promise<Object>} Candidato creado
   */
  create: async (candidato) => {
    try {
      const response = await api.post("/candidatos", candidato);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear candidato:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualiza un candidato existente
   * @param {number} id - ID del candidato
   * @param {Object} candidato - Datos actualizados
   * @returns {Promise<Object>} Candidato actualizado
   */
  update: async (id, candidato) => {
    try {
      const response = await api.put(`/candidatos/${id}`, candidato);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar candidato:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Elimina un candidato
   * @param {number} id - ID del candidato
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/candidatos/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error("❌ Error al eliminar candidato:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene candidatos por día de audición
   * @param {string} dia - Día de audición
   * @returns {Promise<Array>} Lista de candidatos del día
   */
  getByDia: async (dia) => {
    try {
      const response = await api.get(`/candidatos/dia/${encodeURIComponent(dia)}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener candidatos por día:", error);
      throw error.response?.data || error.message;
    }
>>>>>>> Francisco-Demaria
  },
};

export default candidatosService;
<<<<<<< HEAD




=======
>>>>>>> Francisco-Demaria
