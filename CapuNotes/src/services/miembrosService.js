// src/services/miembrosService.js
import axios from 'axios';

const API_URL = '/api/miembros';

export const miembrosService = {
  // Alias
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
    }));
  },

  // ===============================================================
  // Obtener miembro por ID
  // ===============================================================
  getById: async (nroDocumento, tipoDocumento = 'DNI') => {
    const res = await axios.get(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
    const m = res.data || {};

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
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  // ===============================================================
  // Actualizar miembro (PUT — si cambia DNI)
  // ===============================================================
  update: async (nroViejo, tipoViejo, data) => {
    const res = await axios.put(`${API_URL}/${nroViejo}/${tipoViejo}`, data);
    return res.data;
  },

  // ===============================================================
  // Baja lógica
  // ===============================================================
  darDeBaja: async (nroDocumento, tipoDocumento = 'DNI') => {
    await axios.delete(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
  },

  // ===============================================================
  // Reactivar
  // ===============================================================
  reactivar: async (nroDocumento, tipoDocumento = 'DNI') => {
    await axios.patch(`${API_URL}/${nroDocumento}/${tipoDocumento}/reactivar`);
  },
};

export default miembrosService;
