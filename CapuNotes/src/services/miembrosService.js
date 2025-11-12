// src/services/miembrosService.js
import apiClient from "./apiClient";

const API_URL = "/miembros";

export const miembrosService = {
  // ===============================================================
  // 🔹 Obtener todos los miembros (normaliza los datos)
  // ===============================================================
  list: async () => {                                             
    const data = await apiClient.get(API_URL);
    const list = Array.isArray(data) ? data : [];

    console.log("📡 Miembros recibidos del backend:", list);

    // 🔸 Normalización: aseguramos estructura uniforme
    return list.map((m) => ({
      id: {
        tipoDocumento:
          m.id?.tipoDocumento || m.tipoDocumento || m.tipo || "DNI",
        nroDocumento:
          m.id?.nroDocumento || m.nroDocumento || m.numeroDocumento || null,
      },
      nombre: m.nombre || "",
      apellido: m.apellido || "",
      correo: m.correo || m.email || "",
      telefono: m.telefono || m.celular || "",
      area: m.area?.name || m.area?.nombre || null,
      cuerda: {
        id: m.cuerda?.id || null,
        nombre: m.cuerda?.name || m.cuerda?.nombre || null,
      },
      activo:
        m.activo !== undefined
          ? m.activo
          : m.estado === "ACTIVO" || m.estado === true,
    }));
  },

  // ===============================================================
  // 🔹 Obtener miembro por ID compuesto
  // ===============================================================
  getById: async (nroDocumento, tipoDocumento = "DNI") => {
    const m = await apiClient.get(`${API_URL}/${nroDocumento}/${tipoDocumento}`);

    return {
      id: {
        tipoDocumento:
          m.id?.tipoDocumento || m.tipoDocumento || m.tipo || "DNI",
        nroDocumento:
          m.id?.nroDocumento || m.nroDocumento || m.numeroDocumento || null,
      },
      nombre: m.nombre || "",
      apellido: m.apellido || "",
      correo: m.correo || "",
      telefono: m.telefono || "",
      area: m.area?.name || m.area?.nombre || null,
      cuerda: {
        id: m.cuerda?.id || null,
        nombre: m.cuerda?.name || m.cuerda?.nombre || null,
      },
      activo:
        m.activo !== undefined
          ? m.activo
          : m.estado === "ACTIVO" || m.estado === true,
    };
  },

  // ===============================================================
  // 🔹 Crear nuevo miembro
  // ===============================================================
  create: async (data) => {
    const result = await apiClient.post(API_URL, { body: data });
    console.log("✅ Miembro creado:", result);
    return result;
  },

  // ===============================================================
  // 🔹 Actualizar miembro existente
  // ===============================================================
  update: async (data) => {
    const result = await apiClient.patch(API_URL, { body: data });
    console.log("✏️ Miembro actualizado:", result);
    return result;
  },

  // ===============================================================
  // 🔹 Dar de baja lógica (activo = false)
  // ===============================================================
  darDeBaja: async (nroDocumento, tipoDocumento = "DNI") => {
    await apiClient.delete(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
    console.log(`⚠️ Miembro dado de baja: ${tipoDocumento} ${nroDocumento}`);
  },

  // ===============================================================
  // 🔹 Reactivar miembro dado de baja
  // ===============================================================
  reactivar: async (nroDocumento, tipoDocumento = "DNI") => {
    await apiClient.patch(`${API_URL}/${nroDocumento}/${tipoDocumento}/reactivar`);
    console.log(`🟢 Miembro reactivado: ${tipoDocumento} ${nroDocumento}`);
  },
};

export default miembrosService;

