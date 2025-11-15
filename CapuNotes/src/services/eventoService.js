// src/services/eventoService.js
import apiClient from "./apiClient";

const API_URL = "/eventos";

export const eventoService = {
  // Listar todos los eventos (Ensayos + Presentaciones)
  list: async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const data = await apiClient.get(`${API_URL}${queryString}`);
    console.log("📡 Eventos recibidos:", data);
    return data;
  },
  // Listar pendientes
  listPendientes: async (filtros = {}) => {
    const res = await axios.get(`${API_URL}/pendientes`, { params: filtros });
    console.log("📡 Eventos recibidos:", res.data);
    return res.data;
  },

  // Obtener un evento por ID
  getById: async (id) => {
    return await apiClient.get(`${API_URL}/${id}`);
  },

  //  Crear nuevo evento
  create: async (data) => {
    const result = await apiClient.post(API_URL, { body: data });
    console.log("✅ Evento creado:", result);
    return result;
  },

  // Editar un evento existente
  update: async (id, data) => {
    const result = await apiClient.patch(`${API_URL}/${id}`, { body: data });
    console.log("🛠️ Evento actualizado:", result);
    return result;
  },

  //  Eliminar un evento (requiere tipoEvento en query param)
  remove: async (id, tipoEvento) => {
    const queryString = tipoEvento ? `?tipoEvento=${tipoEvento}` : '';
    const data = await apiClient.delete(`${API_URL}/${id}${queryString}`);
    console.log("🗑️ Evento eliminado:", data);
    return data;
  },

  
};
