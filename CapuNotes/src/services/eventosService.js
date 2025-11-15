import axios from 'axios';

const API_URL = 'api/eventos';

export const eventosService = {
  // 🔹 Listar eventos (con filtros opcionales)
  async listarEventos(filtros = {}) {
    try {
      const params = new URLSearchParams(filtros).toString();
      const res = await axios.get(`${API_URL}${params ? `?${params}` : ''}`);
      console.log('📅 Eventos obtenidos:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Error al listar eventos:', err);
      throw err;
    }
  },

  // 🔹 Obtener un evento por ID
  async obtenerEventoPorId(id) {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      console.log(`🔍 Evento ${id}:`, res.data);
      return res.data;
    } catch (err) {
      console.error(`❌ Error al obtener evento ${id}:`, err);
      throw err;
    }
  },

  // 🔹 Crear un nuevo evento
  async crearEvento(data) {
    try {
      const res = await axios.post(API_URL, data);
      console.log('🆕 Evento creado:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Error al crear evento:', err);
      throw err;
    }
  },

  // 🔹 Editar evento existente
  async editarEvento(id, data) {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      console.log(`✏️ Evento ${id} editado:`, res.data);
      return res.data;
    } catch (err) {
      console.error(`❌ Error al editar evento ${id}:`, err);
      throw err;
    }
  },

  // 🔹 Eliminar evento
  async eliminarEvento(id, tipoEvento) {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        params: { tipoEvento },
      });
      console.log(`🗑️ Evento ${id} eliminado:`, res.data);
      return res.data;
    } catch (err) {
      console.error(`❌ Error al eliminar evento ${id}:`, err);
      throw err;
    }
  },
};
