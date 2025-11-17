// src/services/categoriasCancionesService.js
import axios from "axios";

const API_URL = "/api/categorias-canciones";

export const categoriasCancionesService = {
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Categorías de canciones recibidas:", res.data);
    return res.data;
  },
  get: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await axios.post(API_URL, payload);
    console.log("✅ Categoría creada:", res.data);
    return res.data;
  },
  update: async (data) => {
    const { id, ...rest } = data;
    const res = await axios.put(`${API_URL}/${id}`, rest);
    console.log("✏️ Categoría actualizada:", res.data);
    return res.data;
  },
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    console.log("⚠️ Categoría eliminada:", id);
  },
  reactivar: async (id) => {
    const res = await axios.patch(`${API_URL}/${id}/reactivar`);
    console.log("🟢 Categoría reactivada:", id);
    return res.data;
  },
};

export default categoriasCancionesService;
