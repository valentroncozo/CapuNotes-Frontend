// src/services/repertoriosService.js
import axios from "axios";

const API_URL = "/api/repertorios";

export const repertoriosService = {
  // Listar todos los repertorios
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Repertorios recibidos:", res.data);
    return Array.isArray(res.data) ? res.data : [];
  },

  // Obtener repertorio por id
  get: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Crear repertorio
  create: async (payload) => {
    const res = await axios.post(API_URL, payload);
    console.log("✅ Repertorio creado:", res.data);
    return res.data;
  },

  // Actualizar repertorio
  update: async (id, payload) => {
    const res = await axios.put(`${API_URL}/${id}`, payload);
    console.log("✏️ Repertorio actualizado:", res.data);
    return res.data;
  },

  // Soft delete
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    console.log("⚠️ Repertorio eliminado:", id);
  },

  // Reactivar
  reactivar: async (id) => {
    const res = await axios.patch(`${API_URL}/${id}/reactivar`);
    console.log("🟢 Repertorio reactivado:", id);
    return res.data;
  },
};

export default repertoriosService;
