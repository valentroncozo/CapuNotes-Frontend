// src/services/areasService.js
// Interfaz estable para consumir Áreas.
// HOY usa localStorage. Mañana, cambiás a apiClient y listo.

import { localStorageApi } from "@/services/localStorageApi";
import { AREA_STORAGE_KEY } from "@/schemas/areas";
// import { apiClient } from "@/services/apiClient"; // para backend real

// ===== Implementación actual (LocalStorage) con validación de duplicados =====
export const areasService = localStorageApi(AREA_STORAGE_KEY, {
  uniqueBy: "nombre",
  messages: {
    createDuplicate: "Ya existe un área con ese nombre.",
    updateDuplicate: "Ya existe otra área con ese nombre.",
  },
});

// ===== Implementación futura (Backend) =====
// export const areasService = {
//   list: () => apiClient.get('/areas'),
//   create: (payload) => apiClient.post('/areas', { body: payload }),
//   update: (payload) => apiClient.put(`/areas/${payload.id}`, { body: payload }),
//   remove: (id) => apiClient.delete(`/areas/${id}`),
// };
