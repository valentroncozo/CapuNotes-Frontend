import apiClient from "./apiClient";

const API_URL = '/eventos';

export const eventosService = {
  // 🔹 Listar eventos (con filtros opcionales)
  async listarEventos(filtros = {}) {
    try {
      const params = new URLSearchParams(filtros).toString();
      const res = await apiClient.get(`${API_URL}${params ? `?${params}` : ''}`);
      console.log('📅 Eventos obtenidos:', res);
      return res;
    } catch (err) {
      console.error('❌ Error al listar eventos:', err);
      throw err;
    }
  },

  // 🔹 Obtener un evento por ID
  async obtenerEventoPorId(id) {
    try {
      const res = await apiClient.get(`${API_URL}/${id}`);
      console.log(`🔍 Evento ${id}:`, res);
      return res;
    } catch (err) {
      console.error(`❌ Error al obtener evento ${id}:`, err);
      throw err;
    }
  },

  // 🔹 Crear un nuevo evento
  async crearEvento(data) {
    try {
      const res = await apiClient.post(API_URL, data);
      console.log('🆕 Evento creado:', res);
      return res;
    } catch (err) {
      console.error('❌ Error al crear evento:', err);
      throw err;
    }
  },

  // 🔹 Editar evento existente
  async editarEvento(id, data) {
    try {
      const res = await apiClient.put(`${API_URL}/${id}`, data);
      console.log(`✏️ Evento ${id} editado:`, res);
      return res;
    } catch (err) {
      console.error(`❌ Error al editar evento ${id}:`, err);
      throw err;
    }
  },

  // 🔹 Eliminar evento
  async eliminarEvento(id, tipoEvento) {
    try {
      const res = await apiClient.delete(`${API_URL}/${id}`, {
        params: { tipoEvento },
      });
      console.log(`🗑️ Evento ${id} eliminado:`, res);
      return res;
    } catch (err) {
      console.error(`❌ Error al eliminar evento ${id}:`, err);
      throw err;
    }
  },
};
