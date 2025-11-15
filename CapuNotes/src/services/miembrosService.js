// src/services/miembrosService.js
import axios from 'axios';

const API_URL = '/api/miembros';

export const miembrosService = {
  // ===============================================================
  // 🔹 Obtener todos los miembros (normaliza los datos)
  // ===============================================================
  list: async () => {
    const res = await axios.get(API_URL);
    const data = Array.isArray(res.data) ? res.data : [];

    console.log('📡 Miembros recibidos del backend:', data);

    // 🔸 Normalización: aseguramos estructura uniforme
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
        nombre: m.cuerda?.name || m.cuerda?.nombre || null,
      },
      activo:
        m.activo !== undefined
          ? m.activo
          : m.estado === 'ACTIVO' || m.estado === true,
    }));
  },

  // ===============================================================
  // 🔹 Obtener miembro por ID compuesto
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
        nombre: m.cuerda?.name || m.cuerda?.name || null,
      },
      activo:
        m.activo !== undefined
          ? m.activo
          : m.estado === 'ACTIVO' || m.estado === true,
    };
  },

  // ===============================================================
  // 🔹 Crear nuevo miembro
  // ===============================================================
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    console.log('✅ Miembro creado:', res.data);
    return res.data;
  },

  // ===============================================================
  // 🔹 Actualizar miembro existente
  // ===============================================================
  update: async (data) => {
    const res = await axios.patch(API_URL, data);
    console.log('✏️ Miembro actualizado:', res.data);
    return res.data;
  },

  // ===============================================================
  // 🔹 Dar de baja lógica (activo = false)
  // ===============================================================
  darDeBaja: async (nroDocumento, tipoDocumento = 'DNI') => {
    await axios.delete(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
    console.log(`⚠️ Miembro dado de baja: ${tipoDocumento} ${nroDocumento}`);
  },

  // ===============================================================
  // 🔹 Reactivar miembro dado de baja
  // ===============================================================
  reactivar: async (nroDocumento, tipoDocumento = 'DNI') => {
    await axios.patch(`${API_URL}/${nroDocumento}/${tipoDocumento}/reactivar`);
    console.log(`🟢 Miembro reactivado: ${tipoDocumento} ${nroDocumento}`);
  },
};

export default miembrosService;
