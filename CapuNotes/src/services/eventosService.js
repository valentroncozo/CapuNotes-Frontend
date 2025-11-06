// src/services/eventosService.js
import axios from 'axios';

const API_URL = '/api/eventos';

export const eventosService = {
  // 📋 Obtener todos los eventos (opcionalmente con filtros)
  list: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const res = await axios.get(`${API_URL}${params ? '?' + params : ''}`);
    console.log('📡 Eventos recibidos del backend:', res.data);

    return res.data.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      lugar: e.lugar,
      fecha: e.fechaInicio, // LocalDate
      hora: e.hora, // LocalTime
      tipoEvento: e.tipoEvento,
      descripcion: e.descripcion || '',
    }));
  },

  // ➕ Crear nuevo evento (ensayo o presentación)
  create: async (data) => {
    const payload = {
      nombre: data.nombre,
      lugar: data.lugar,
      descripcion: data.descripcion,
      fechaInicio: data.fecha,
      hora: data.hora,
      tipoEvento: data.tipoEvento, // "ENSAYO" o "PRESENTACION"
    };

    const res = await axios.post(API_URL, payload);
    return {
      id: res.data.id,
      mensaje: res.data.mensaje,
    };
  },

  // ✏️ Editar evento existente
  update: async (data) => {
    const payload = {
      nombre: data.nombre,
      lugar: data.lugar,
      descripcion: data.descripcion,
      fechaInicio: data.fecha,
      hora: data.hora,
      tipoEvento: data.tipoEvento,
    };

    const res = await axios.patch(`${API_URL}/${data.id}`, payload);
    return {
      id: res.data.id,
      mensaje: res.data.mensaje,
    };
  },

  // 🗑️ Eliminar evento
  remove: async (id, tipoEvento) => {
    const res = await axios.delete(`${API_URL}/${id}`, {
      params: { tipoEvento },
    });
    return res.data.mensaje;
  },
};
