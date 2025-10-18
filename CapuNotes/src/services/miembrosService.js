// src/services/miembrosService.js
import { localStorageApi } from "@/services/localStorageApi";
import { MIEMBRO_STORAGE_KEY } from "@/schemas/miembros";
// import { apiClient } from "@/services/apiClient"; // para backend futuro

// Implementación actual: LocalStorage con validación de duplicados por Nombre + Apellido
export const miembrosService = localStorageApi(MIEMBRO_STORAGE_KEY, {
  uniqueBy: ["nombre", "apellido"],
  messages: {
    createDuplicate: "Ya existe un miembro con ese Nombre y Apellido.",
    updateDuplicate: "Ya existe otro miembro con ese Nombre y Apellido.",
  },
});

// Implementación futura (cuando conectes backend):
// export const miembrosService = {
//   list: () => apiClient.get('/miembros'),
//   create: (payload) => apiClient.post('/miembros', { body: payload }),
//   update: (payload) => apiClient.put(`/miembros/${payload.id}`, { body: payload }),
//   remove: (id) => apiClient.delete(`/miembros/${id}`),
// };
