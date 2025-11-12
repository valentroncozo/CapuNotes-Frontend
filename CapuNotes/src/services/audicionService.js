import apiClient from './apiClient';

const AudicionService = {
  crear: async (audicion) => {
    try {
      return await apiClient.post('/audiciones', { body: audicion });
    } catch (e) {
      throw e.details || e.message;
    }
  },

  actualizar: async (audicion) => {
    try {
      return await apiClient.patch('/audiciones', { body: audicion });
    } catch (e) {
      throw e.details || e.message;
    }
  },

  actualizarParcial: async (id, cambios) => {
    try {
      return await apiClient.patch(`/audiciones/${id}`, { body: cambios });
    } catch (e) {
      throw e.details || e.message;
    }
  },

  eliminar: async (id) => {
    try {
      await apiClient.delete(`/audiciones/${id}`);
      return true;
    } catch (e) {
      throw e.details || e.message;
    }
  },

  getById: async (id) => {
    try {
      return await apiClient.get(`/audiciones/${id}`);
    } catch (e) {
      throw e.details || e.message;
    }
  },

  getAll: async () => {
    try {
      return await apiClient.get('/audiciones');
    } catch (e) {
      throw e.details || e.message;
    }
  },

  getActual: async () => {
    try {
      return await apiClient.get('/audiciones/actual');
    } catch (e) {
      // devolver null si 404 u otro mensaje del backend
      if (e.status === 404) return null;
      throw e.details || e.message;
    }
  },

  // cronograma: si page/size son undefined usa sin paginar (backend admite Pageable.unpaged())
  getCronograma: async (audicionId, { dia = null, page = undefined, size = undefined } = {}) => {
    try {
      const params = {};
      if (dia != null) params.dia = dia;
      if (page != null) params.page = page;
      if (size != null) params.size = size;
      return await apiClient.get(`/audiciones/cronograma/${audicionId}`, { params });
    } catch (e) {
      throw e.details || e.message;
    }
  },

  getPerfilInscripcion: async (inscripcionId) => {
    try {
      return await apiClient.get(`/audiciones/cronograma/perfil/${inscripcionId}`);
    } catch (e) {
      throw e.details || e.message;
    }
  },

  getAudicionesPorCandidato: async (tipoDocumento, nroDocumento) => {
    try {
      return await apiClient.get(`/audiciones/candidato/${encodeURIComponent(tipoDocumento)}/${encodeURIComponent(nroDocumento)}`);
    } catch (e) {
      throw e.details || e.message;
    }
  }

};

export default AudicionService;