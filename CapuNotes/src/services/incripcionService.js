import apiClient from "./apiClient";

const inscripcionService = {
    getEncuesta: async (audicionId) => {
    return await apiClient.get(`/encuesta/audicion/${audicionId}`);
    },

    enviarEncuesta: async (audicionId, inscripcionPayload) => {
    return await apiClient.post(`/encuesta/audicion/${audicionId}`, { body: inscripcionPayload });
    },

    confirmarInscripcion: async (inscripcionId, updatePayload) => {
    return await apiClient.patch(`/encuesta/audicion/inscripciones/${inscripcionId}`, { body: updatePayload });
    },

    // PATCH /encuesta/audicion/inscripciones/{id} -> actualizar solo la cuerda del candidato
    actualizarCuerda: async (inscripcionId, cuerdaName) => {
        const payload = { cuerda: { name: String(cuerdaName) } };
    return await apiClient.patch(`/encuesta/audicion/inscripciones/${inscripcionId}`, { body: payload });
    },

    getCandidatosPorAudicion: async (audicionId) => {
    return await apiClient.get(`/encuesta/audicion/${audicionId}/candidatos`);
    }
};

export default inscripcionService;