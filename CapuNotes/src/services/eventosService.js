import axios from "axios";

const API_URL = "/api/eventos";

export const eventosService = {
  // ⭐ Listar eventos con filtros opcionales
  list: async (filtros = {}) => {
    try {
      const res = await axios.get(API_URL, { params: filtros });
      return res.data;
    } catch (error) {
      console.error("❌ Error al listar eventos:", error);
      throw error;
    }
  },

  // ⭐ Listar solo pendientes
  listPendientes: async () => {
    try {
      const res = await axios.get(`${API_URL}/pendientes`);
      return res.data;
    } catch (error) {
      console.error("❌ Error al listar eventos pendientes:", error);
      throw error;
    }
  },

  // ⭐ Obtener un evento por ID
  getById: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al obtener evento ${id}:`, error);
      throw error;
    }
  },

  // ⭐ Crear evento
  create: async (data) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
      throw error;
    }
  },

  // ⭐ Editar evento (PATCH como en tu backend)
  update: async (id, data) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al actualizar evento ${id}:`, error);
      throw error;
    }
  },

  // ⭐ Eliminar evento (requiere tipoEvento)
  remove: async (id, tipoEvento) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        params: { tipoEvento },
      });
      return res.data;
    } catch (error) {
      console.error(`❌ Error al eliminar evento ${id}:`, error);
      throw error;
    }
  },
};
