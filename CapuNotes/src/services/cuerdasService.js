// src/services/cuerdasService.js
import axios from "axios";

const API_URL = "/api/cuerdas";

export const cuerdasService = {
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Datos recibidos de CUERDAS:", res.data);
    return res.data.map((c) => ({
      id: c.id,
      nombre: c.name || c.nombre || "(Sin nombre)",
      descripcion: c.description || c.descripcion || "",
    }));
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  update: async (updated) => {
    const res = await axios.put(`${API_URL}/${updated.id}`, updated);
    return res.data;
  },

  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
