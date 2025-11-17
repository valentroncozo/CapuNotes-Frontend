// src/services/miembrosService.js
import apiClient from "./apiClient";

const API_URL = "/miembros";

export const miembrosService = {
  // Alias
  getMiembros: async () => {
    return await miembrosService.list();
  },

  // ===============================================================
  // Obtener todos los miembros
  // ===============================================================
  list: async () => {                                             
    const data = await apiClient.get(API_URL);
    const list = Array.isArray(data) ? data : [];

    console.log("📡 Miembros recibidos del backend:", list);

    // 🔸 Normalización: aseguramos estructura uniforme
    return list.map((m) => ({
      id: {
        tipoDocumento: m.id?.tipoDocumento || 'DNI',
        nroDocumento: m.id?.nroDocumento || null,
      },
      nombre: m.nombre || '',
      apellido: m.apellido || '',
      correo: m.correo || '',
      nroTelefono: m.nroTelefono || '',
      carreraProfesion: m.carreraProfesion || '',
      lugarOrigen: m.lugarOrigen || '',
      instrumentoMusical: m.instrumentoMusical || '',
      area: m.area?.name || null,
      cuerda: {
        id: m.cuerda?.id || null,
        name: m.cuerda?.name || null,
      },
      activo: m.activo ?? false,
    }));
  },

  // ===============================================================
  // Obtener miembro por ID
  // ===============================================================
  getById: async (nroDocumento, tipoDocumento = "DNI") => {
    const m = await apiClient.get(`${API_URL}/${nroDocumento}/${tipoDocumento}`);

    return {
      id: {
        tipoDocumento: m.id?.tipoDocumento || 'DNI',
        nroDocumento: m.id?.nroDocumento || null,
      },
      nombre: m.nombre || '',
      apellido: m.apellido || '',
      correo: m.correo || '',
      nroTelefono: m.nroTelefono || '',
      carreraProfesion: m.carreraProfesion || '',
      lugarOrigen: m.lugarOrigen || '',
      instrumentoMusical: m.instrumentoMusical || '',
      area: m.area?.nombre || null,
      cuerda: {
        id: m.cuerda?.id || null,
        name: m.cuerda?.nombre || null,
      },
      activo: m.activo ?? false,
    };
  },

  // ===============================================================
  // Crear miembro
  // ===============================================================
  create: async (data) => {
    const result = await apiClient.post(API_URL, { body: data });
    console.log("✅ Miembro creado:", result);
    return result;
  },

  // ===============================================================
  // Actualizar miembro (PUT — si cambia DNI)
  // ===============================================================
  update: async (data) => {
    const result = await apiClient.patch(API_URL, { body: data });
    console.log("✏️ Miembro actualizado:", result);
    return result;
  },

  // ===============================================================
  // Baja lógica
  // ===============================================================
  darDeBaja: async (nroDocumento, tipoDocumento = "DNI") => {
    await apiClient.delete(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
    console.log(`⚠️ Miembro dado de baja: ${tipoDocumento} ${nroDocumento}`);
  },

  // ===============================================================
  // Reactivar
  // ===============================================================
  reactivar: async (nroDocumento, tipoDocumento = "DNI") => {
    await apiClient.patch(`${API_URL}/${nroDocumento}/${tipoDocumento}/reactivar`);
    console.log(`🟢 Miembro reactivado: ${tipoDocumento} ${nroDocumento}`);
  },
};

export default miembrosService;
