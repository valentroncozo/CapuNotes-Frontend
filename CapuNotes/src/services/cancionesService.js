// src/services/cancionesService.js
import axios from "axios";

const API_URL = "/api/canciones";

export const cancionesService = {
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Canciones recibidas:", res.data);
    return res.data;
  },
  get: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await axios.post(API_URL, payload);
    console.log("✅ Canción creada:", res.data);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await axios.put(`${API_URL}/${id}`, payload);
    console.log("✏️ Canción actualizada:", res.data);
    return res.data;
  },
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    console.log("⚠️ Canción eliminada:", id);
  },
  reactivar: async (id) => {
    const res = await axios.patch(`${API_URL}/${id}/reactivar`);
    console.log("🟢 Canción reactivada:", id);
    return res.data;
  },
};

export default cancionesService;
