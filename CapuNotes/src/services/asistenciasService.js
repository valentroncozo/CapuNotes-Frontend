// src/services/asistenciasService.js
import axios from "axios";

const API_URL = "/api/asistencias";

export const asistenciasService = {
  // =======================================================
  //LISTAR ASISTENCIAS POR ENSAYO
  // =======================================================
  /**
   * GET /api/asistencias/ensayo/{idEnsayo}?cuerdaId=&nombre=
   */
  listPorEnsayo: async (idEnsayo, { cuerdaId = null, nombre = null } = {}) => {
    try {
      const res = await axios.get(`${API_URL}/ensayo/${idEnsayo}`, {
        params: { ...(cuerdaId ? { cuerdaId } : {}), ...(nombre ? { nombre } : {}) },
      });
      console.log("Asistencias recibidas:", res.data);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Error listando asistencias:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // REGISTRAR / ACTUALIZAR UNA ASISTENCIA INDIVIDUAL
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
      const res = await axios.post(`${API_URL}/ensayo/${idEnsayo}`, body, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Asistencia registrada:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error registrando asistencia individual:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // REGISTRO MASIVO
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
      const res = await axios.post(`${API_URL}/ensayo/${idEnsayo}/masivo`, body, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("📤 Asistencias masivas enviadas:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error registrando asistencias masivas:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // CERRAR / REABRIR ASISTENCIA
  // =======================================================
  cerrarAsistencia: async (idEnsayo) => {
    try {
      const res = await axios.patch(`${API_URL}/ensayo/${idEnsayo}/cerrar`);
      console.log("🔒 Asistencia cerrada:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error cerrando asistencia:", err?.response || err);
      throw err;
    }
  },

  reabrirAsistencia: async (idEnsayo) => {
    try {
      const res = await axios.patch(`${API_URL}/ensayo/${idEnsayo}/abrir`);
      console.log("Asistencia reabierta:", res.data);
      return res.data;
    } catch (err) {
      console.error(" Error reabriendo asistencia:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  //  ELIMINAR
  // =======================================================
  eliminarAsistenciasPorEnsayo: async (idEnsayo) => {
    try {
      const res = await axios.delete(`${API_URL}/ensayo/${idEnsayo}`);
      console.log("Asistencias eliminadas del ensayo:", res.data);
      return res.data;
    } catch (err) {
      console.error(" Error eliminando asistencias:", err?.response || err);
      throw err;
    }
  },
  getEstado: async (idEnsayo) => {
    try {
      const res = await axios.get(`${API_URL}/ensayo/${idEnsayo}/estado`);
      console.log(" Estado de asistencia recibido:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error obteniendo estado de asistencia:", err?.response || err);
      throw err;
    }
  },
};

export default asistenciasService;
