// src/services/ensayosService.js
import apiClient from "./apiClient";

export const ensayosService = {
  // Obtener todos los ensayos con estado y porcentaje
  list: async () => {
    const data = await apiClient.get('/api/ensayos');  // → en dev: /api/ensayos → Vite proxy → http://localhost:8080/ensayos
    console.log("📡 Ensayos recibidos del backend:", data);
    return data.map((e) => ({
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
    return await apiClient.get(`/api/ensayos/${id}`);
  },

  // Crear nuevo ensayo
  create: async (data) => {
    const result = await apiClient.post('/api/ensayos', { body: data });
    console.log("✅ Ensayo creado:", result);
    return result;
  },

  // Actualizar ensayo existente
  update: async (id, updated) => {
    const result = await apiClient.patch(`/api/ensayos/${id}`, { body: updated });
    console.log("✏️ Ensayo actualizado:", result);
    return result;
  },

  // Eliminar ensayo
  remove: async (id) => {
    await apiClient.delete(`/api/ensayos/${id}`);
    console.log(`🗑️ Ensayo eliminado: ${id}`);
  },
};

export default ensayosService;
