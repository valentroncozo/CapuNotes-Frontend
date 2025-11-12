import apiClient from './apiClient';

const mapPreguntaToPayload = (p) => ({
  valor: p.valor,
  tipo: p.tipo, // TEXTO | OPCION | MULTIOPCION
  obligatoria: Boolean(p.obligatoria),
  opciones: Array.isArray(p.opciones) ? p.opciones : [],
  activa: Boolean(p.activa),
});

const preguntasService = {
  list: async () => {
  return await apiClient.get('/preguntas');
  },

  create: async (pregunta) => {
  return await apiClient.post('/preguntas', { body: mapPreguntaToPayload(pregunta) });
  },

  update: async (id, pregunta) => {
  return await apiClient.patch(`/preguntas/${encodeURIComponent(id)}`, { body: mapPreguntaToPayload(pregunta) });
  },

  remove: async (id) => {
  await apiClient.delete(`/preguntas/${encodeURIComponent(id)}`);
  },

  asignarA_Audicion: async (audicionId, preguntasIds) => {
  await apiClient.post(`/preguntas/audicion/${encodeURIComponent(audicionId)}`, { body: { preguntasIds } });
  },

  getFormulario: async (audicionId) => {
  return await apiClient.get(`/audiciones/${Number(audicionId)}/formulario`);
  },

  quitarDeAudicion: async (audicionId, preguntaId) => {
  await apiClient.delete(`/audiciones/${encodeURIComponent(audicionId)}/formulario/${encodeURIComponent(preguntaId)}`);
  },
};

export default preguntasService;

