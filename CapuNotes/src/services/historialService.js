<<<<<<< HEAD
import axios from 'axios';

const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV
  ? DEV_PROXY_BASE
=======
// src/services/historialService.js
import axios from 'axios';

const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV 
  ? DEV_PROXY_BASE 
>>>>>>> Francisco-Demaria
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
  baseURL: resolvedBaseURL,
<<<<<<< HEAD
  headers: { 'Content-Type': 'application/json' },
=======
  headers: { 'Content-Type': 'application/json' }
>>>>>>> Francisco-Demaria
});

export const historialService = {
  list: async () => {
    try {
<<<<<<< HEAD
      const r = await api.get('/historial');
      return r.data;
    } catch (e) {
      // Propagar un mensaje simple; la vista muestra un aviso amigable
      throw new Error(e?.response?.data || e?.message || 'No se pudo obtener el historial');
    }
  },
};

export default historialService;

=======
      // ✅ cambiamos '/historial' por '/audiciones/historial'
      const response = await api.get('/audiciones/historial');
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default historialService;
>>>>>>> Francisco-Demaria
