// src/services/historialService.js
import apiClient from './apiClient';

export const historialService = {
  list: async () => {
    try {
      return await apiClient.get('/api/audiciones/historial');
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw error.details || error.message;
    }
  }
};

export default historialService;
