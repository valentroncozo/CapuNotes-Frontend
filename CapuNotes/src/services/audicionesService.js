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
