// src/services/areasService.js
import axios from "axios";

const API_URL = "/api/areas";

export const areasService = {
  // Obtener todas las áreas
  list: async () => {
    const res = await axios.get(API_URL);
    console.log("📡 Datos recibidos del backend:", res.data);
    return res.data.map((a) => ({
      id: a.id,
      nombre: a.name,
      descripcion: a.description,
    }));
  },

  // Crear nueva área
  create: async (data) => {
    const payload = {
      name: data.nombre,
      description: data.descripcion,
    };
    const res = await axios.post(API_URL, payload);
    return {
      id: res.data.id,
      nombre: res.data.name,
      descripcion: res.data.description,
    };
  },

  // Editar área existente
  update: async (data) => {
    // data debe incluir id, nombre, descripcion
    const payload = {
      name: data.nombre,
      description: data.descripcion,
    };
    const res = await axios.patch(`${API_URL}/${data.id}`, payload);
    return {
      id: res.data.id,
      nombre: res.data.name,
      descripcion: res.data.description,
    };
  },

  // Eliminar área
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};




