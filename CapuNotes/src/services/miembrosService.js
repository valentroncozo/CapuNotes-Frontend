import axios from 'axios';

const API_URL = '/api/miembros';

export const miembrosService = {

  // ===============================================================
  // GET TODOS
  // ===============================================================
  list: async () => {
    const res = await axios.get(API_URL);

    return res.data.map((m) => ({
      ...m,
      cuerda: m.idCuerda
        ? { id: m.idCuerda, nombre: m.nombreCuerda }
        : null,
      area: m.idArea
        ? { id: m.idArea, nombre: m.nombreArea }
        : null,
    }));
  },

  getMiembros: async () => miembrosService.list(),

  // ===============================================================
  // GET POR ID
  // ===============================================================
  getById: async (nroDocumento, tipoDocumento = "DNI") => {
    const res = await axios.get(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
    const m = res.data;

    return {
      tipoDocumento: m.tipoDocumento,
      nroDocumento: m.nroDocumento,
      nombre: m.nombre,
      apellido: m.apellido,
      correo: m.correo,
      nroTelefono: m.nroTelefono,
      carreraProfesion: m.carreraProfesion,
      lugarOrigen: m.lugarOrigen,
      instrumentoMusical: m.instrumentoMusical,

      fechaNacimiento: m.fechaNacimiento || null,

      area: m.idArea
        ? { id: m.idArea, nombre: m.nombreArea }
        : null,

      cuerda: m.idCuerda
        ? { id: m.idCuerda, nombre: m.nombreCuerda }
        : null,

      activo: m.activo,
    };
  },

  // ===============================================================
  // CREATE
  // ===============================================================
  create: async (formData) => {
    const req = {
      tipoDocumento: formData.tipoDocumento,
      nroDocumento: formData.nroDocumento,
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      nroTelefono: formData.nroTelefono,
      carreraProfesion: formData.carreraProfesion,
      lugarOrigen: formData.lugarOrigen,
      instrumentoMusical: formData.instrumentoMusical,
      fechaNacimiento: formData.fechaNacimiento || null,
      idArea: formData.idArea ?? null,
      idCuerda: formData.idCuerda ?? null,
      activo: formData.activo ?? true,
    };

    const res = await axios.post(API_URL, req);
    return res.data;
  },

  // ===============================================================
  // UPDATE
  // ===============================================================
  update: async (nroViejo, tipoViejo, formData) => {
    const req = {
      tipoDocumento: formData.tipoDocumento,
      nroDocumento: formData.nroDocumento,
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      nroTelefono: formData.nroTelefono,
      carreraProfesion: formData.carreraProfesion,
      lugarOrigen: formData.lugarOrigen,
      instrumentoMusical: formData.instrumentoMusical,
      fechaNacimiento: formData.fechaNacimiento || null,

      // TOMAR LOS CAMPOS DIRECTOS, NO OBJETOS
      idArea: formData.idArea ?? formData.area ?? null,
      idCuerda: formData.idCuerda ?? formData.cuerda ?? null,

      activo: formData.activo,
    };

    const res = await axios.put(`${API_URL}/${nroViejo}/${tipoViejo}`, req);
    return res.data;
  },


  // ===============================================================
  // BAJA LÓGICA
  // ===============================================================
  darDeBaja: async (nroDocumento, tipoDocumento = "DNI") => {
    await axios.delete(`${API_URL}/${nroDocumento}/${tipoDocumento}`);
  },

  // Reactivar
  reactivar: async (nroDocumento, tipoDocumento = "DNI") => {
    await axios.patch(`${API_URL}/${nroDocumento}/${tipoDocumento}/reactivar`);
  },
};

export default miembrosService;

