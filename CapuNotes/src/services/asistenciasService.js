import axios from "axios";

// Seguimos la convención del proyecto: en desarrollo usamos el proxy '/api' definido en vite.config.js
// y en producción usaremos la variable de entorno VITE_API_BASE_URL si está definida.
const DEV_PROXY = "/api";
const PROD_BASE = import.meta.env.VITE_API_BASE_URL || "";
const base = import.meta.env.DEV ? DEV_PROXY : PROD_BASE;

const ASISTENCIAS_BASE = `${base}/asistencias`;
const ENSAYOS_BASE = `${base}/ensayos`;

export const asistenciasService = {
  // --------------------------------------------------
  // LISTAR
  // --------------------------------------------------
  /**
   * Listar asistencias de un ensayo con filtros opcionales.
   * GET /api/asistencias/ensayo/{idEnsayo}?cuerdaId=...&nombre=...
   */
  listPorEnsayo: async (idEnsayo, { cuerdaId = null, nombre = null } = {}) => {
    try {
      const res = await axios.get(`${ASISTENCIAS_BASE}/ensayo/${idEnsayo}`, {
        params: { ...(cuerdaId != null ? { cuerdaId } : {}), ...(nombre ? { nombre } : {}) },
        withCredentials: true,
      });
      // retorna List<AsistenciaResponse> según el controller
      return res.data;
    } catch (err) {
      console.error("Error listando asistencias (ensayo):", err?.response || err);
      throw err;
    }
  },

  // --------------------------------------------------
  // REGISTRAR / ACTUALIZAR INDIVIDUAL
  // --------------------------------------------------
  /**
   * Registrar o actualizar una asistencia individual.
   * POST /api/asistencias/ensayo/{idEnsayo}
   * body: { miembroId: { tipoDocumento, nroDocumento }, estado: 'PRESENTE'|'AUSENTE'|'MEDIO', registradoPor }
   */
  registrarAsistencia: async (idEnsayo, body) => {
    try {
      const res = await axios.post(`${ASISTENCIAS_BASE}/ensayo/${idEnsayo}`, body, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data; // devuelve { mensaje, idAsistencia, porcentajeAsistencia } según controller
    } catch (err) {
      console.error("Error registrando asistencia individual:", err?.response || err);
      throw err;
    }
  },

  // --------------------------------------------------
  // REGISTRO MASIVO
  // --------------------------------------------------
  /**
   * Registrar asistencias masivas.
   * POST /api/asistencias/ensayo/{idEnsayo}/masivo
   * body: { registradoPor: string, asistencias: [ { miembro: { id: { tipoDocumento, nroDocumento } }, estado } ] }
   */
  registrarAsistenciasMasivas: async (idEnsayo, body) => {
    try {
      const res = await axios.post(`${ASISTENCIAS_BASE}/ensayo/${idEnsayo}/masivo`, body, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data; // devuelve { mensaje, porcentajeAsistencia }
    } catch (err) {
      console.error("Error registrando asistencias masivas:", err?.response || err);
      throw err;
    }
  },

  // --------------------------------------------------
  // CERRAR / REABRIR
  // --------------------------------------------------
  cerrarAsistencia: async (idEnsayo) => {
    try {
      const res = await axios.patch(`${ASISTENCIAS_BASE}/ensayo/${idEnsayo}/cerrar`, null, {
        withCredentials: true,
      });
      return res.data; // { mensaje, estadoAsistencia, porcentajeAsistencia }
    } catch (err) {
      console.error("Error cerrando asistencia:", err?.response || err);
      throw err;
    }
  },

  reabrirAsistencia: async (idEnsayo) => {
    try {
      const res = await axios.patch(`${ASISTENCIAS_BASE}/ensayo/${idEnsayo}/abrir`, null, {
        withCredentials: true,
      });
      return res.data; // { mensaje, estadoAsistencia }
    } catch (err) {
      console.error("Error reabriendo asistencia:", err?.response || err);
      throw err;
    }
  },

  // --------------------------------------------------
  // ELIMINACIONES
  // --------------------------------------------------
  eliminarAsistencia: async (idAsistencia) => {
    try {
      const res = await axios.delete(`${ASISTENCIAS_BASE}/${idAsistencia}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error eliminando asistencia:", err?.response || err);
      throw err;
    }
  },

  eliminarAsistenciasPorEnsayo: async (idEnsayo) => {
    try {
      const res = await axios.delete(`${ASISTENCIAS_BASE}/ensayo/${idEnsayo}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error eliminando asistencias por ensayo:", err?.response || err);
      throw err;
    }
  },

  // --------------------------------------------------
  // UTIL (opcional) - obtener ensayos (usa controller de ensayos)
  // --------------------------------------------------
  listEnsayos: async () => {
    try {
      const res = await axios.get(`${ENSAYOS_BASE}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error obteniendo ensayos:", err?.response || err);
      throw err;
    }
  },
};

export default asistenciasService;
