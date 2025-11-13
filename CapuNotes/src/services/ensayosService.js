// src/services/ensayosService.js
import axios from "axios";

const ENSAYOS_API_URL = "/api/ensayos";

export const ensayosService = {
  // Obtener todos los ensayos con estado y porcentaje
  list: async () => {
    const res = await axios.get(ENSAYOS_API_URL);
    console.log("Ensayos recibidos del backend:", res.data);
    return res.data.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      descripcion: e.descripcion,
      fechaInicio: e.fechaInicio,
      tipoEvento: e.tipoEvento,
      estadoAsistencia: e.estadoAsistencia,
      porcentajeAsistencia: e.porcentajeAsistencia,
    }));
  },

  // Obtener ensayo por id
  getById: async (id) => {
    const res = await axios.get(`${ENSAYOS_API_URL}/${id}`);
    return res.data;
  },

  // Crear nuevo ensayo
  create: async (data) => {
    const res = await axios.post(ENSAYOS_API_URL, data);
    console.log("Ensayo creado:", res.data);
    return res.data;
  },

  // Actualizar ensayo existente
  update: async (id, updated) => {
    const res = await axios.patch(`${ENSAYOS_API_URL}/${id}`, updated);
    console.log("Ensayo actualizado:", res.data);
    return res.data;
  },

  // Eliminar ensayo
  remove: async (id) => {
    await axios.delete(`${ENSAYOS_API_URL}/${id}`);
    console.log(`Ensayo eliminado: ${id}`);
  },
};

export default ensayosService;
