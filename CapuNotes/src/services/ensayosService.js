// src/services/ensayosService.js
import axios from "axios";

const API = "/api/ensayos";

export const ensayosService = {
  // ============================================================
  // Crear ensayo
  // ============================================================
  create: async (data) => {
    const res = await axios.post(API, data);
    console.log("🟢 Ensayo creado:", res.data);
    return res.data;
  },

  // ============================================================
  // Editar ensayo existente
  // ============================================================
  update: async (id, data) => {
    const res = await axios.patch(`${API}/${id}`, data);
    console.log("🛠️ Ensayo actualizado:", res.data);
    return res.data;
  },

  // ============================================================
  // Eliminar ensayo (cambia estado a CANCELADO)
  // ============================================================
  remove: async (id) => {
    const res = await axios.delete(`${API}/${id}`);
    console.log("🗑️ Ensayo cancelado:", res.data);
    return res.data;
  },

  // ============================================================
  // Listar todos los ensayos
  //     Cada ensayo viene con porcentaje, estadoAsistencia, etc.
  // ============================================================
  list: async () => {
    const res = await axios.get(API);
    console.log("📡 Ensayos recibidos:", res.data);
    return res.data;
  },

  // ============================================================
  // Obtener ensayo por ID
  // ============================================================
  getById: async (id) => {
    const res = await axios.get(`${API}/${id}`);
    console.log("📡 Ensayo por ID:", res.data);
    return res.data;
  },

  // ============================================================
  // Listar ensayos activos
  // ============================================================
  listActivos: async () => {
  const res = await axios.get(`${API}/activos`);
  console.log("📡 Ensayos activos recibidos:", res.data);
  return res.data;
},

};

