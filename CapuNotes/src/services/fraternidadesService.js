// src/services/fraternidadesService.js
import apiClient from "./apiClient";

const API_URL = "/fraternidades";

export const fraternidadesService = {
  // Listar fraternidades mapeando a { id, nombre }
  list: async () => {
    const data = await apiClient.get(API_URL);
    return (data || []).map((f) => ({ id: f.id, nombre: f.name }));
  },

  // Crear
  create: async (data) => {
    const payload = { name: data.nombre };
    const result = await apiClient.post(API_URL, { body: payload });
    return { id: result.id, nombre: result.name };
  },

  // Actualizar
  update: async (data) => {
    const payload = { name: data.nombre };
    const result = await apiClient.patch(`${API_URL}/${data.id}`, { body: payload });
    return { id: result.id, nombre: result.name };
  },

  // Eliminar
  remove: async (id) => {
    await apiClient.delete(`${API_URL}/${id}`);
  },
};

