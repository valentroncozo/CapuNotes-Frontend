import axios from 'axios';

const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV
  ? DEV_PROXY_BASE
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

export const historialService = {
  list: async () => {
    try {
      const r = await api.get('/historial');
      return r.data;
    } catch (e) {
      // Propagar un mensaje simple; la vista muestra un aviso amigable
      throw new Error(e?.response?.data || e?.message || 'No se pudo obtener el historial');
    }
  },
};

export default historialService;

