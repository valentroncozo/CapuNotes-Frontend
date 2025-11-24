// src/services/cuerdasService.js
import axios from "axios";

const API_URL = "/api/cuerdas";

export const cuerdasService = {
  list: async () => {
    const res = await axios.get(API_URL);
    return res.data.map((c) => ({
      id: c.id,
      nombre: c.name,
    }));
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return {
      id: res.data.id,
      nombre: res.data.name,
    };
  },

  create: async (data) => {
    const payload = { name: data.nombre };
    const res = await axios.post(API_URL, payload);
    return {
      id: res.data.id,
      nombre: res.data.name,
    };
  },

  update: async (data) => {
    const payload = { name: data.nombre };
    const res = await axios.put(`${API_URL}/${data.id}`, payload);
    return {
      id: res.data.id,
      nombre: res.data.name,
    };
  },

  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
