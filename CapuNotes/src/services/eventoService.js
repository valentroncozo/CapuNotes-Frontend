// src/services/eventoService.js
import axios from "axios";

const API_URL = "/api/eventos";

export const eventoService = {
  // Listar todos los eventos (Ensayos + Presentaciones)
  list: async (filtros = {}) => {
    const res = await axios.get(API_URL, { params: filtros });
    console.log("📡 Eventos recibidos:", res.data);
    return res.data;
  },

  // Obtener un evento por ID
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  //  Crear nuevo evento
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    console.log("✅ Evento creado:", res.data);
    return res.data;
  },

  // Editar un evento existente
  update: async (id, data) => {
    const res = await axios.patch(`${API_URL}/${id}`, data);
    console.log("🛠️ Evento actualizado:", res.data);
    return res.data;
  },

  //  Eliminar un evento (requiere tipoEvento en query param)
  remove: async (id, tipoEvento) => {
    const url = `${API_URL}/${id}`;
    const options = {};
    if (tipoEvento) options.params = { tipoEvento };

    console.log('🗑️ Eliminando evento — URL:', url, 'params:', options.params);
    const res = await axios.delete(url, options);
    console.log("🗑️ Evento eliminado:", res.data);
    return res.data;
  },

  // Listar eventos pendientes (ensayos + presentaciones pendientes)
  pendientes: async () => {
    const res = await axios.get(`${API_URL}/pendientes`);
    console.log('📡 Eventos pendientes recibidos:', res.data);
    return res.data;
  },
};
