import axios from 'axios';

// En Vite las variables de entorno públicas deben comenzar con VITE_
// En desarrollo usamos el proxy definido en vite.config.js ("/api" -> http://localhost:8080)
// para evitar problemas de CORS. En producción usamos VITE_API_BASE_URL si está disponible.
const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV 
  ? DEV_PROXY_BASE 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { 'Content-Type': 'application/json' }
});

export const historialService = {
  // Versión mínima: un solo método para listar
  list: async () => {
    try {
      // Si tu backend expone /api/historial, cambia '/historial' por '/api/historial'
      const response = await api.get('/historial');
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default historialService;
