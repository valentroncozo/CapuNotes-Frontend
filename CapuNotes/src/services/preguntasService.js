import axios from 'axios';

const DEV_PROXY_BASE = '/api';
const resolvedBaseURL = import.meta.env.DEV ? DEV_PROXY_BASE : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
const api = axios.create({ 
  baseURL: resolvedBaseURL, 
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'Content-Type': 'application/json' } 
});

const mapPreguntaToPayload = (p) => ({
  valor: p.valor,
  tipo: p.tipo, // TEXTO | OPCION | MULTIOPCION
  obligatoria: Boolean(p.obligatoria),
  opciones: Array.isArray(p.opciones) ? p.opciones : [],
  activa: Boolean(p.activa),
});

const preguntasService = {
  list: async () => {
    const r = await api.get('/preguntas');
    return r.data;
  },

  create: async (pregunta) => {
    const r = await api.post('/preguntas', mapPreguntaToPayload(pregunta));
    return r.data;
  },

  update: async (id, pregunta) => {
    const r = await api.patch(`/preguntas/${encodeURIComponent(id)}`, mapPreguntaToPayload(pregunta));
    return r.data;
  },

  remove: async (id) => {
    await api.delete(`/preguntas/${encodeURIComponent(id)}`);
  },

  asignarA_Audicion: async (audicionId, preguntasIds) => {
    await api.post(`/preguntas/audicion/${encodeURIComponent(audicionId)}`, { preguntasIds });
  },

  getFormulario: async (audicionId) => {
    const r = await api.get(`/audiciones/${Number(audicionId)}/formulario`);
    return r.data;
  },

  quitarDeAudicion: async (audicionId, preguntaId) => {
    await api.delete(`/audiciones/${encodeURIComponent(audicionId)}/formulario/${encodeURIComponent(preguntaId)}`);
  },
};

export default preguntasService;

