// src/services/candidatosService.js
import apiClient from "./apiClient";

export const candidatosService = {
  /**
   * Lista todos los candidatos de la audición actual
   * @returns {Promise<Array>} Lista de candidatos
   */
  list: async () => {
    try {
  return await apiClient.get("/candidatos");
    } catch (error) {
      console.error("❌ Error al listar candidatos:", error);
      throw error;
    }
  },

  /**
   * Obtiene un candidato por ID
   * @param {number} id - ID del candidato
   * @returns {Promise<Object>} Datos del candidato
   */
  getById: async (id) => {
    try {
  return await apiClient.get(`/candidatos/${id}`);
    } catch (error) {
      console.error("❌ Error al obtener candidato:", error);
      throw error;
    }
  },

  /**
 * 🔄 Crea o actualiza el resultado de una inscripción de audición
 * @param {number} idInscripcion - ID de la inscripción
 * @param {{estado: string, obs: string}} data - Datos a guardar
 * @returns {Promise<Object>} Inscripción actualizada
 */
  updateResultado: async (idInscripcion, data) => {
    try {
      const payload = {
        resultado: (data.estado || "SIN").toUpperCase(),
        observaciones: data.obs || "",
        cuerda: { name: data.cuerda || "Tenor" },
        cancion: data.cancion || undefined,
      };

      console.log("📤 PATCH /encuesta/audicion/inscripciones", idInscripcion, payload);

      return await apiClient.patch(
  `/encuesta/audicion/inscripciones/${idInscripcion}`,
        { body: payload }
      );
    } catch (error) {
      console.error("❌ Error al actualizar resultado:", error);
      throw error;
    }
  },

  /**
   * Actualiza la cuerda de la inscripción de un candidato
   * @param {number} id - ID del candidato
   * @param {string} cuerda - Nueva cuerda
   * @returns {Promise<Object>} Candidato actualizado
   */
  updateInscripcionCuerda: async (id, cuerda) => {
    try {
  return await apiClient.patch(`/candidatos/${id}/cuerda`, { body: { cuerda } });
    } catch (error) {
      console.error("❌ Error al actualizar cuerda:", error);
      throw error;
    }
  },

  /**
   * Crea un nuevo candidato
   * @param {Object} candidato - Datos del candidato
   * @returns {Promise<Object>} Candidato creado
   */
  create: async (candidato) => {
    try {
  return await apiClient.post("/candidatos", { body: candidato });
    } catch (error) {
      console.error("❌ Error al crear candidato:", error);
      throw error;
    }
  },

  /**
   * Actualiza un candidato existente
   * @param {number} id - ID del candidato
   * @param {Object} candidato - Datos actualizados
   * @returns {Promise<Object>} Candidato actualizado
   */
  update: async (id, candidato) => {
    try {
  return await apiClient.put(`/candidatos/${id}`, { body: candidato });
    } catch (error) {
      console.error("❌ Error al actualizar candidato:", error);
      throw error;
    }
  },

  /**
   * Elimina un candidato
   * @param {number} id - ID del candidato
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  delete: async (id) => {
    try {
  await apiClient.delete(`/candidatos/${id}`);
      return true;
    } catch (error) {
      console.error("❌ Error al eliminar candidato:", error);
      throw error;
    }
  },

  /**
   * Obtiene candidatos por día de audición
   * @param {string} dia - Día de audición
   * @returns {Promise<Array>} Lista de candidatos del día
   */
  getByDia: async (dia) => {
    try {
  return await apiClient.get(`/candidatos/dia/${encodeURIComponent(dia)}`);
    } catch (error) {
      console.error("❌ Error al obtener candidatos por día:", error);
      throw error;
    }
  },
};

export default candidatosService;
