// src/services/cuerdasService.js
import { localStorageApi } from "@/services/localStorageApi";
import { CUERDA_STORAGE_KEY } from "@/schemas/cuerdas";
// import { apiClient } from "@/services/apiClient";

export const cuerdasService = localStorageApi(CUERDA_STORAGE_KEY);

// Futuro backend:
// export const cuerdasService = {
//   list: () => apiClient.get('/cuerdas'),
//   create: (payload) => apiClient.post('/cuerdas', { body: payload }),
//   update: (payload) => apiClient.put(`/cuerdas/${payload.id}`, { body: payload }),
//   remove: (id) => apiClient.delete(`/cuerdas/${id}`),
// };
