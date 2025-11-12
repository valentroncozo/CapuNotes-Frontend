// src/services/cuerdasService.js
import apiClient from "./apiClient";

const API_URL = '/cuerdas';

export const cuerdasService = {
  list: async () => {
    const data = await apiClient.get(API_URL);
    console.log("📡 Datos recibidos de CUERDAS:", data);
    return data;
  },

  getById: async (id) => {
    return await apiClient.get(`${API_URL}/${id}`);
  },

  create: async (data) => {
    return await apiClient.post(API_URL, { body: data });
  },

  update: async (updated) => {
    return await apiClient.patch(`${API_URL}/${updated.id}`, { body: updated });
  },

  remove: async (id) => {
    await apiClient.delete(`${API_URL}/${id}`);
  },
};
