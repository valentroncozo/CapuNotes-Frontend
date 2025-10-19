import axios from "axios";

// Implementación actual: LocalStorage con validación de duplicados por Nombre + Apellido
export const miembrosService = localStorageApi(MIEMBRO_STORAGE_KEY, {
  uniqueBy: ["nombre", "apellido"],
  messages: {
    createDuplicate: "Ya existe un miembro con ese Nombre y Apellido.",
    updateDuplicate: "Ya existe otro miembro con ese Nombre y Apellido.",
  },
});

export const miembrosService = {
  // 🔹 Obtener todos los miembros
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Miembros recibidos del backend:", res.data);
    return res.data;
  },

  // 🔹 Obtener miembro por ID compuesto (nroDocumento + tipoDocumento)
  getById: async (nroDocumento, tipoDocumento) => {
    const res = await axios.get(`${API_URL}/${tipoDocumento}/${nroDocumento}`);
    return res.data;
  },

  // 🔹 Crear nuevo miembro
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    console.log("✅ Miembro creado:", res.data);
    return res.data;
  },

  // 🔹 Actualizar miembro existente
  update: async (data) => {
    const res = await axios.put(API_URL, data);
    console.log("✏️ Miembro actualizado:", res.data);
    return res.data;
  },

  // 🔹 Eliminar miembro
  remove: async (nroDocumento, tipoDocumento) => {
    await axios.delete(`${API_URL}/${tipoDocumento}/${nroDocumento}`);
    console.log(`🗑️ Miembro eliminado: ${tipoDocumento} ${nroDocumento}`);
  },
};
