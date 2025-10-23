// src/services/fraternidadesService.js
import axios from "axios";

const API_URL = "/api/fraternidades";

export const fraternidadesService = {
  // Listar fraternidades mapeando a { id, nombre }
  list: async () => {
    const res = await axios.get(API_URL);
    return (res.data || []).map((f) => ({ id: f.id, nombre: f.name }));
  },

  // Crear
  create: async (data) => {
    const payload = { name: data.nombre };
    const res = await axios.post(API_URL, payload);
    return { id: res.data.id, nombre: res.data.name };
  },

  // Actualizar
  update: async (data) => {
    const payload = { name: data.nombre };
    const res = await axios.patch(`${API_URL}/${data.id}`, payload);
    return { id: res.data.id, nombre: res.data.name };
  },

  // Eliminar
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

