import axios from "axios";

const base = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

const api = axios.create({
    baseURL: base,
    timeout: 10000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    withCredentials: true, // necesario para cookies/sesiones
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

function handleError(err) {
    if (err.response) {
        // error desde backend
        throw err.response.data || { message: err.response.statusText };
    }
    throw { message: err.message || "Error de red" };
}

const inscripcionService = {
    getEncuesta: async (audicionId) => {
        try {
            const res = await api.get(`/encuesta/audicion/${audicionId}`);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    enviarEncuesta: async (audicionId, inscripcionPayload) => {
        try {
            const res = await api.post(`/encuesta/audicion/${audicionId}`, inscripcionPayload);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    confirmarInscripcion: async (inscripcionId, updatePayload) => {
        try {
            const res = await api.patch(`/encuesta/audicion/inscripciones/${inscripcionId}`, updatePayload);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    // PATCH /encuesta/audicion/inscripciones/{id} -> actualizar solo la cuerda del candidato
    actualizarCuerda: async (inscripcionId, cuerdaName) => {
        try {
            const payload = { cuerda: { name: String(cuerdaName) } };
            const res = await api.patch(`/encuesta/audicion/inscripciones/${inscripcionId}`, payload);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    },

    getCandidatosPorAudicion: async (audicionId) => {
        try {
            const res = await api.get(`/encuesta/audicion/${audicionId}/candidatos`);
            return res.data;
        } catch (e) {
            handleError(e);
        }
    }
};

export default inscripcionService;