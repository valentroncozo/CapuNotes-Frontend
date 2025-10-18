// src/services/cuerdasService.js
import { localStorageApi } from "@/services/localStorageApi";
import { CUERDA_STORAGE_KEY } from "@/schemas/cuerdas";
// import { apiClient } from "@/services/apiClient";

export const cuerdasService = localStorageApi(CUERDA_STORAGE_KEY, {
  uniqueBy: "nombre",
  messages: {
    createDuplicate: "Ya existe una cuerda con ese nombre.",
    updateDuplicate: "Ya existe otra cuerda con ese nombre.",
  },
});

// Futuro backend:
// export const cuerdasService = {
//   list: () => apiClient.get('/cuerdas'),
//   create: (payload) => apiClient.post('/cuerdas', { body: payload }),
//   update: (payload) => apiClient.put(`/cuerdas/${payload.id}`, { body: payload }),
//   remove: (id) => apiClient.delete(`/cuerdas/${id}`),
// };
