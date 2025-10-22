import axios from 'axios';

// En Vite las variables de entorno pblicas deben comenzar con VITE_
// En desarrollo usamos el proxy definido en vite.config.js ("/api" -> http://localhost:8080)
// para evitar problemas de CORS. En producción usamos VITE_API_BASE_URL si est disponible.
const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV ? DEV_PROXY_BASE : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { 'Content-Type': 'application/json' }
});

const AudicionService = {
  crear: async (audicion) => {
    try {
      const r = await api.post('/audiciones', audicion);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  actualizar: async (audicion) => {
    try {
      const r = await api.put('/audiciones', audicion);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  actualizarParcial: async (id, cambios) => {
    try {
      const r = await api.patch(`/audiciones/${id}`, cambios);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  eliminar: async (id) => {
    try {
      const r = await api.delete(`/audiciones/${id}`);
      return r.status === 204;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getById: async (id) => {
    try {
      const r = await api.get(`/audiciones/${id}`);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getAll: async () => {
    try {
      const r = await api.get('/audiciones');
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getActual: async () => {
    try {
      const r = await api.get('/audiciones/actual');
      return r.data;
    } catch (e) {
      // devolver null si 404 u otro mensaje del backend
      if (e.response?.status === 404) return null;
      throw e.response?.data || e.message;
    }
  },

  // cronograma: si page/size son undefined usa sin paginar (backend admite Pageable.unpaged())
  getCronograma: async (audicionId, { dia = null, page = undefined, size = undefined } = {}) => {
    try {
      const params = {};
      if (dia != null) params.dia = dia;
      if (page != null) params.page = page;
      if (size != null) params.size = size;
      const r = await api.get(`/audiciones/cronograma/${audicionId}`, { params });
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getPerfilInscripcion: async (inscripcionId) => {
    try {
      const r = await api.get(`/audiciones/cronograma/perfil/${inscripcionId}`);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getAudicionesPorCandidato: async (tipoDocumento, nroDocumento) => {
    try {
      const r = await api.get(`/audiciones/candidato/${encodeURIComponent(tipoDocumento)}/${encodeURIComponent(nroDocumento)}`);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  }

};

export default AudicionService;