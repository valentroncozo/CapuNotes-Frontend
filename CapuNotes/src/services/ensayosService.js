import axios from "axios";

// Base para la gestión de ENSAYOS (CRUD básico)
const ENSAYOS_API_URL = "/api/eventos";

export const ensayosService = {
  // --------------------------------------------------
  // ENSAYOS CRUD (usa ENSAYOS_API_URL)
  // --------------------------------------------------
  // Obtener todos los ensayos (list en AsistenciaEnsayos.jsx usa esto)
  list: async () => {
    const res = await axios.get(ENSAYOS_API_URL);
    console.log("📡 Ensayos recibidos del backend:", res.data);
    return res.data;
  },

  // Obtener ensayo por id
  getById: async (id) => {
    const res = await axios.get(`${ENSAYOS_API_URL}/${id}`);
    return res.data;
  },

  // Crear nuevo ensayo
  create: async (data) => {
    const res = await axios.post(ENSAYOS_API_URL, data);
    console.log("✅ Ensayo creado:", res.data);
    return res.data;
  },

  // Actualizar (PATCH)
  update: async (id, updated) => {
    const res = await axios.patch(`${ENSAYOS_API_URL}/${id}`, updated);
    console.log("✏️ Ensayo actualizado:", res.data);
    return res.data;
  },

  // Eliminar ensayo
  remove: async (id) => {
    await axios.delete(`${ENSAYOS_API_URL}/${id}`);
    console.log(`🗑️ Ensayo eliminado: ${id}`);
  },
};

export default ensayosService;