// src/services/asistenciasService.js
import apiClient from "./apiClient";

const API_URL = "/asistencias";

export const asistenciasService = {
  // =======================================================
  // 🔹 LISTAR ASISTENCIAS POR ENSAYO
  // =======================================================
  /**
   * GET /api/asistencias/ensayo/{idEnsayo}?cuerdaId=&nombre=
   */
  listPorEnsayo: async (idEnsayo, { cuerdaId = null, nombre = null } = {}) => {
    try {
      const params = new URLSearchParams();
      if (cuerdaId) params.append('cuerdaId', cuerdaId);
      if (nombre) params.append('nombre', nombre);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const data = await apiClient.get(`${API_URL}/ensayo/${idEnsayo}${queryString}`);
      console.log("📡 Asistencias recibidas:", data);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("❌ Error listando asistencias:", err);
      throw err;
    }
  },

  // =======================================================
  // 🔹 REGISTRAR / ACTUALIZAR UNA ASISTENCIA INDIVIDUAL
  // =======================================================
  /**
   * POST /api/asistencias/ensayo/{idEnsayo}
   * Body esperado:
   * {
   *   miembroId: { tipoDocumento, nroDocumento },
   *   estado: "PRESENTE" | "AUSENTE" | "MEDIA_FALTA"
   * }
   */
  registrarAsistencia: async (idEnsayo, body) => {
    try {
      const data = await apiClient.post(`${API_URL}/ensayo/${idEnsayo}`, { body });
      console.log("✅ Asistencia registrada:", data);
      return data;
    } catch (err) {
      console.error("❌ Error registrando asistencia individual:", err);
      throw err;
    }
  },

  // =======================================================
  // 🔹 REGISTRO MASIVO
  // =======================================================
  /**
   * POST /api/asistencias/ensayo/{idEnsayo}/masivo
   * Body esperado:
   * {
   *   asistencias: [
   *     { miembro: { id: { tipoDocumento, nroDocumento } }, estado }
   *   ]
   * }
   */
  registrarAsistenciasMasivas: async (idEnsayo, body) => {
    try {
      const data = await apiClient.post(`${API_URL}/ensayo/${idEnsayo}/masivo`, { body });
      console.log("📤 Asistencias masivas enviadas:", data);
      return data;
    } catch (err) {
      console.error("❌ Error registrando asistencias masivas:", err);
      throw err;
    }
  },

  // =======================================================
  // 🔹 CERRAR / REABRIR ASISTENCIA
  // =======================================================
  cerrarAsistencia: async (idEnsayo) => {
    try {
      const data = await apiClient.patch(`${API_URL}/ensayo/${idEnsayo}/cerrar`);
      console.log("🔒 Asistencia cerrada:", data);
      return data;
    } catch (err) {
      console.error("❌ Error cerrando asistencia:", err);
      throw err;
    }
  },

  reabrirAsistencia: async (idEnsayo) => {
    try {
      const data = await apiClient.patch(`${API_URL}/ensayo/${idEnsayo}/abrir`);
      console.log("🔓 Asistencia reabierta:", data);
      return data;
    } catch (err) {
      console.error("❌ Error reabriendo asistencia:", err);
      throw err;
    }
  },

  // =======================================================
  // 🔹 ELIMINAR
  // =======================================================
  eliminarAsistenciasPorEnsayo: async (idEnsayo) => {
    try {
      const data = await apiClient.delete(`${API_URL}/ensayo/${idEnsayo}`);
      console.log("🗑️ Asistencias eliminadas del ensayo:", data);
      return data;
    } catch (err) {
      console.error("❌ Error eliminando asistencias:", err);
      throw err;
    }
  },
};

export default asistenciasService;
