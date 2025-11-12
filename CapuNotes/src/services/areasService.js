// src/services/areasService.js
import apiClient from "@/services/apiClient";


const API_URL = "/areas";

function handleApiError(err) {
  const status = err?.status ?? err?.response?.status;
  console.error('API error details:', err?.details ?? err?.response?.data ?? err);
  if (status === 401) {
    window.location.replace("/401");
    return;
  }
  if (status === 403) {
    window.location.replace("/403");
    return;
  }
  throw err;
}

export const areasService = {
  // Obtener todas las áreas
  list: async () => {
    try {
      // apiClient.get devuelve directamente los datos (no { res, data })
      const data = await apiClient.get(API_URL);
      console.log("📡 Datos recibidos del backend:", data);
      return (data || []).map((a) => ({
        id: a.id,
        nombre: a.name,
        descripcion: a.description,
      }));
    } catch (err) {
      handleApiError(err);
      throw err;
    }
  },

  // Crear nueva área
  create: async (data) => {
    try {
      const payload = {
        name: data.nombre,
        description: data.descripcion,
      };
      const res = await apiClient.post(API_URL, { body: payload });
      return {
        id: res.id,
        nombre: res.name,
        descripcion: res.description,
      };
    } catch (err) {
      handleApiError(err);
      throw err;
    }
  },

  // Editar área existente
  update: async (data) => {
    try {
      const payload = {
        name: data.nombre,
        description: data.descripcion,
      };
      const res = await apiClient.patch(`${API_URL}/${data.id}`, { body: payload });
      return {
        id: res.id,
        nombre: res.name,
        descripcion: res.description,
      };
    } catch (err) {
      handleApiError(err);
      throw err;
    }
  },

  // Eliminar área
  remove: async (id) => {
    try {
      await apiClient.delete(`${API_URL}/${id}`);
    } catch (err) {
      handleApiError(err);
      throw err;
    }
  },
};




