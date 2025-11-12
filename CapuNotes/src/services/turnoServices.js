import apiClient from './apiClient';

const TurnoService = {
  listarPorAudicion: async (audicionId) => {
    try {
  const data = await apiClient.get(`/turnos/audicion/${encodeURIComponent(audicionId)}`);
      console.log('Turnos obtenidos:', data);
      return data;
    } catch (e) {
      throw e;
    }
  },

  listarDisponibles: async (audicionId) => {
    try {
  return await apiClient.get(`/turnos/audicion/${encodeURIComponent(audicionId)}/disponibles`);
    } catch (e) {
      throw e;
    }
  },

  listarResumenPorDia: async (audicionId) => {
    try {
  return await apiClient.get(`/turnos/audicion/${encodeURIComponent(audicionId)}/resumen-diario`);
    } catch (e) {
      throw e;
    }
  },
  
  listarFranjasHorarias: async (audicionId) => {
    try {
  return await apiClient.get(`/turnos/audicion/${encodeURIComponent(audicionId)}/generacion-requests`);
    } catch (e) {
      throw e;
    }
  },

  generarTurnos: async (audicionId, generarTurnosRequest) => {
    try {
  return await apiClient.post(`/turnos/audicion/${encodeURIComponent(audicionId)}`, { body: generarTurnosRequest });
    } catch (e) {
      throw e;
    }
  },

  actualizarEstado: async (turnoId, nuevoEstado) => {
    try {
      // body expected: { estado: "DISPONIBLE" | "RESERVADO" | "CANCELADO" }
  return await apiClient.patch(`/turnos/${encodeURIComponent(turnoId)}/estado`, { body: { estado: nuevoEstado } });
    } catch (e) {
      throw e;
    }
  },

  eliminar: async (turnoId) => {
    try {
  await apiClient.delete(`/turnos/${encodeURIComponent(turnoId)}`);
      return true;
    } catch (e) {
      throw e;
    }
  },

  eliminarTurnosPorAudicion: async (audicionId) => {
    try {
  await apiClient.delete(`/turnos/audicion/${encodeURIComponent(audicionId)}`);
      return true;
    } catch (e) {
      throw e;
    }
  }
};

export default TurnoService;
