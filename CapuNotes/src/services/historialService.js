// src/services/historialService.js
import axios from 'axios';

const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV 
  ? DEV_PROXY_BASE 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { 'Content-Type': 'application/json' }
});

export const historialService = {
  list: async () => {
    try {
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
