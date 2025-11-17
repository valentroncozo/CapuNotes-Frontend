// src/services/tiemposLiturgicosService.js
import axios from "axios";

const API_URL = "/api/tiempos-liturgicos";

export const tiemposLiturgicosService = {
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Tiempos litúrgicos recibidos:", res.data);
    return res.data;
  },
  get: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await axios.post(API_URL, payload);
    console.log("✅ Tiempo creado:", res.data);
    return res.data;
  },
  update: async (data) => {
    const { id, ...rest } = data;
    const res = await axios.put(`${API_URL}/${id}`, rest);
    console.log("✏️ Tiempo actualizado:", res.data);
    return res.data;
  },
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    console.log("⚠️ Tiempo eliminado:", id);
  },
  reactivar: async (id) => {
    const res = await axios.patch(`${API_URL}/${id}/reactivar`);
    console.log("🟢 Tiempo reactivado:", id);
    return res.data;
  },
};

export default tiemposLiturgicosService;
