import axios from 'axios';

// En Vite usar import.meta.env para variables pblicas (VITE_*)
// En desarrollo usamos el proxy definido en vite.config.js ("/api" -> http://localhost:8080)
const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV ? DEV_PROXY_BASE : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
const api = axios.create({
  baseURL: resolvedBaseURL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'Content-Type': 'application/json' }
});

const TurnoService = {
  listarPorAudicion: async (audicionId) => {
    try {
      const r = await api.get(`/turnos/audicion/${encodeURIComponent(audicionId)}`);
      console.log('Turnos obtenidos:', r.data);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  listarDisponibles: async (audicionId) => {
    try {
      const r = await api.get(`/turnos/audicion/${encodeURIComponent(audicionId)}/disponibles`);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  listarResumenPorDia: async (audicionId) => {
    try {
      const r = await api.get(`/turnos/audicion/${encodeURIComponent(audicionId)}/resumen-diario`);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
  
  listarFranjasHorarias: async (audicionId) => {
    try {
      const r = await api.get(`/turnos/audicion/${encodeURIComponent(audicionId)}/generacion-requests`);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  generarTurnos: async (audicionId, generarTurnosRequest) => {
    try {
      const r = await api.post(`/turnos/audicion/${encodeURIComponent(audicionId)}`, generarTurnosRequest);
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  actualizarEstado: async (turnoId, nuevoEstado) => {
    try {
      // body expected: { estado: "DISPONIBLE" | "RESERVADO" | "CANCELADO" }
      const r = await api.patch(`/turnos/${encodeURIComponent(turnoId)}/estado`, { estado: nuevoEstado });
      return r.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  eliminar: async (turnoId) => {
    try {
      const r = await api.delete(`/turnos/${encodeURIComponent(turnoId)}`);
      return r.status === 204;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  eliminarTurnosPorAudicion: async (audicionId) => {
    try {
      const r = await api.delete(`/turnos/audicion/${encodeURIComponent(audicionId)}`);
      return r.status === 204;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  }
};

export default TurnoService;
