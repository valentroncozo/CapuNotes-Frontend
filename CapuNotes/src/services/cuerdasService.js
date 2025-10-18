// src/services/cuerdasService.js
// Mantiene contrato actual (list/create/update/remove). Toggle por env.

import { localStorageApi } from "@/services/localStorageApi";
import { apiClient } from "@/services/apiClient";
import { CUERDA_STORAGE_KEY } from "@/schemas/cuerdas";

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") !== "false";

// =========== MOCK localStorage =========== //
const mock = localStorageApi(CUERDA_STORAGE_KEY, {
  uniqueBy: "nombre",
  messages: {
    createDuplicate: "Ya existe una cuerda con ese nombre.",
    updateDuplicate: "Ya existe otra cuerda con ese nombre.",
  },
});

// =========== REAL API =========== //
const api = {
  async list() {
    const data = await apiClient.get("/cuerdas");
    return Array.isArray(data) ? data : [];
  },
  async create(payload) {
    return await apiClient.post("/cuerdas", { body: payload });
  },
  async update(payload) {
    return await apiClient.put(`/cuerdas/${payload.id}`, { body: payload });
  },
  async remove(id) {
    await apiClient.delete(`/cuerdas/${id}`);
    return { ok: true };
  },
};

export const cuerdasService = USE_MOCK ? mock : api;
