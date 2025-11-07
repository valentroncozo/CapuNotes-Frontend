import axios from "axios";

// Base para la gestión de ASISTENCIAS
const API_URL = "/api/asistencias"; 

export const asistenciasService = {
  
  // --------------------------------------------------
  // LISTAR ASISTENCIAS
  // --------------------------------------------------
  /**
  import axios from "axios";

  // Base para la gestión de ASISTENCIAS
  const API_URL = "/api/asistencias"; 

  export const asistenciasService = {
  
    // --------------------------------------------------
    // LISTAR ASISTENCIAS
    // --------------------------------------------------
    /**
     * Listar asistencias de un ensayo con filtros opcionales.
     * GET /api/asistencias/ensayo/{idEnsayo}?cuerdaId=...&nombre=...
     */
    listPorEnsayo: async (idEnsayo, { cuerdaId = null, nombre = null } = {}) => {
      try {
        const res = await axios.get(`${API_URL}/ensayo/${idEnsayo}`, {
          params: { ...(cuerdaId != null ? { cuerdaId } : {}), ...(nombre ? { nombre } : {}) },
          withCredentials: true,
        });
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
     */
    registrarAsistencia: async (idEnsayo, body) => {
      try {
        const res = await axios.post(`${API_URL}/ensayo/${idEnsayo}`, body, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        return res.data; 
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
     * Body: { registradoPor: string, asistencias: Array<{ miembro: { id: { tipoDocumento, nroDocumento } }, estado }>
     */
    registrarAsistenciasMasivas: async (idEnsayo, payload) => {
      try {
        const res = await axios.post(`${API_URL}/ensayo/${idEnsayo}/masivo`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        return res.data; 
      } catch (err) {
        console.error("Error registrando asistencias masivas:", err?.response || err);
        throw err;
      }
    },

    // --------------------------------------------------
    // CERRAR / REABRIR
    // --------------------------------------------------
    /** Cerrar la asistencia de un ensayo. */
    cerrarAsistencia: async (idEnsayo) => {
      try {
        const res = await axios.patch(`${API_URL}/ensayo/${idEnsayo}/cerrar`, null, {
          withCredentials: true,
        });
        return res.data; 
      } catch (err) {
        console.error("Error cerrando asistencia:", err?.response || err);
        throw err;
      }
    },

    /** Reabrir la asistencia de un ensayo. */
    reabrirAsistencia: async (idEnsayo) => {
      try {
        const res = await axios.patch(`${API_URL}/ensayo/${idEnsayo}/abrir`, null, {
          withCredentials: true,
        });
        return res.data; 
      } catch (err) {
        console.error("Error reabriendo asistencia:", err?.response || err);
        throw err;
      }
    },

    // --------------------------------------------------
    // ELIMINACIONES
    // --------------------------------------------------
    /** Eliminar una asistencia individual. */
    eliminarAsistencia: async (idAsistencia) => {
      try {
        const res = await axios.delete(`${API_URL}/${idAsistencia}`, { withCredentials: true });
        return res.data;
      } catch (err) {
        console.error("Error eliminando asistencia:", err?.response || err);
        throw err;
      }
    },

    /** Eliminar todas las asistencias de un ensayo. */
    eliminarAsistenciasPorEnsayo: async (idEnsayo) => {
      try {
        const res = await axios.delete(`${API_URL}/ensayo/${idEnsayo}`, { withCredentials: true });
        return res.data;
      } catch (err) {
        console.error("Error eliminando asistencias por ensayo:", err?.response || err);
        throw err;
      }
    },
  };

  export default asistenciasService;