import axios from "axios";

const API_URL = "/api/ensayos";

export const ensayosService = {
  // Obtener todos los ensayos
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Ensayos recibidos del backend:", res.data);
    return res.data;
  },

  // Obtener ensayo por id
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Crear nuevo ensayo
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    console.log("✅ Ensayo creado:", res.data);
    return res.data;
  },

  // Actualizar (PATCH)
  update: async (id, updated) => {
    const res = await axios.patch(`${API_URL}/${id}`, updated);
    console.log("✏️ Ensayo actualizado:", res.data);
    return res.data;
  },

  // Eliminar ensayo
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    console.log(`🗑️ Ensayo eliminado: ${id}`);
  },
};

export default ensayosService;
