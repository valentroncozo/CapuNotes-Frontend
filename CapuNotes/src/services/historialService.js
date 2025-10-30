import axios from "axios";

const base = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
    baseURL: base,
    timeout: 10000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    withCredentials: true
});

function handleError(err) {
    if (err.response) {
        throw err.response.data || { message: err.response.statusText };
    }
    throw { message: err.message || "Error de red" };
}

export const historialService = {
    /**
     * Obtener historial de audiciones
     * @returns {Promise<Array>} Lista de inscripciones históricas
     */
    list: async () => {
        try {
            const res = await api.get('/audiciones/historial');
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    /**
     * Obtener historial por candidato
     * @param {string} tipoDocumento - Tipo de documento del candidato
     * @param {string} nroDocumento - Número de documento del candidato
     * @returns {Promise<Array>} Lista de audiciones del candidato
     */
    getByCandidato: async (tipoDocumento, nroDocumento) => {
        try {
            const res = await api.get(`/audiciones/candidato/${encodeURIComponent(tipoDocumento)}/${encodeURIComponent(nroDocumento)}`);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    /**
     * Obtener detalle de una inscripción específica
     * @param {number} inscripcionId - ID de la inscripción
     * @returns {Promise<Object>} Detalle de la inscripción
     */
    getInscripcion: async (inscripcionId) => {
        try {
            const res = await api.get(`/encuesta/${inscripcionId}`);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    }
};

export default historialService;
