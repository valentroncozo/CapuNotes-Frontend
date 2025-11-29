// src/services/presentacionesService.js
import axios from "axios";

const API = "/api/presentaciones";

export const presentacionesService = {
  // ============================================================
  // Crear presentación
  // ============================================================
  create: async (data) => {
    const res = await axios.post(API, data);
    console.log("🟢 Presentación creada:", res.data);
    return res.data;
  },

  // ============================================================
  // Editar presentación
  // ============================================================
  update: async (id, data) => {
    const res = await axios.patch(`${API}/${id}`, data);
    console.log("🛠️ Presentación actualizada:", res.data);
    return res.data;
  },

  // ============================================================
  // Eliminar presentación (pasa a estado CANCELADO)
  // ============================================================
  remove: async (id) => {
    const res = await axios.delete(`${API}/${id}`);
    console.log("🗑️ Presentación cancelada:", res.data);
    return res.data;
  },

  // ============================================================
  // Listar todas las presentaciones
  // ============================================================
  list: async () => {
    const res = await axios.get(API);
    console.log("📡 Presentaciones recibidas:", res.data);
    return res.data;
  },

  // ============================================================
  // Obtener presentación por ID
  // ============================================================
  getById: async (id) => {
    const res = await axios.get(`${API}/${id}`);
    console.log("📡 Presentación por ID:", res.data);
    return res.data;
  },
};
