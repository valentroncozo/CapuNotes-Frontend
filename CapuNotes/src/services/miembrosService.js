// src/services/miembrosService.js
import axios from 'axios';

const API_URL = '/api/miembros';

export const miembrosService = {
  // === Alias seguro para no romper nada ===
  getMiembros: async () => {
    return await miembrosService.list();
  },
  // ===============================================================
  // Obtener todos los miembros
  // ===============================================================
  list: async () => {
    const res = await axios.get(API_URL);
    const data = Array.isArray(res.data) ? res.data : [];

    return data.map((m) => ({
      id: {
        tipoDocumento:
          m.id?.tipoDocumento || m.tipoDocumento || m.tipo || 'DNI',
        nroDocumento:
          m.id?.nroDocumento || m.nroDocumento || m.numeroDocumento || null,
      },
      nombre: m.nombre || '',
      apellido: m.apellido || '',
      correo: m.correo || m.email || '',
      telefono: m.telefono || m.celular || '',
      area: m.area?.name || m.area?.nombre || null,
      cuerda: {
        id: m.cuerda?.id || null,
        name: m.cuerda?.name || m.cuerda?.nombre || null,
      },
      activo:
        m.activo !== undefined
          ? m.activo
          : m.estado === 'ACTIVO' || m.estado === true,
    }));
  },

  // ===============================================================
  // Obtener miembro por ID compuesto
  // ===============================================================
  getById: async (nroDocumento, tipoDocumento = 'DNI') => {
    const res = await axios.get(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
    const m = res.data || {};

    return {
      id: {
        tipoDocumento:
          m.id?.tipoDocumento || m.tipoDocumento || m.tipo || 'DNI',
        nroDocumento:
          m.id?.nroDocumento || m.nroDocumento || m.numeroDocumento || null,
      },
      nombre: m.nombre || '',
      apellido: m.apellido || '',
      correo: m.correo || '',
      telefono: m.telefono || '',
      area: m.area?.name || m.area?.nombre || null,
      cuerda: {
        id: m.cuerda?.id || null,
        name: m.cuerda?.name || m.cuerda?.nombre || null,
      },
      activo:
        m.activo !== undefined
          ? m.activo
          : m.estado === 'ACTIVO' || m.estado === true,
    };
  },

  // ===============================================================
  // Crear nuevo miembro
  // ===============================================================
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  // ===============================================================
  // Actualizar miembro existente (con cambio de documento)
  // ===============================================================
  update: async (nroViejo, tipoViejo, data) => {
    const res = await axios.put(`${API_URL}/${nroViejo}/${tipoViejo}`, data);
    return res.data;
  },

  // ===============================================================
  // Dar de baja lógica
  // ===============================================================
  darDeBaja: async (nroDocumento, tipoDocumento = 'DNI') => {
    await axios.delete(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
  },

  // ===============================================================
  // Reactivar miembro
  // ===============================================================
  reactivar: async (nroDocumento, tipoDocumento = 'DNI') => {
    await axios.patch(`${API_URL}/${nroDocumento}/${tipoDocumento}/reactivar`);
  },
};

export default miembrosService;
