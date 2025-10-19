// src/services/cuerdasService.js
import { localStorageApi } from "@/services/localStorageApi.js";
import { http, USE_MOCK } from "@/services/apiClient.js";
import { CUERDA_STORAGE_KEY } from "@/schemas/cuerdas.js";

// =========== MOCK localStorage =========== //
const mock = localStorageApi(CUERDA_STORAGE_KEY, {
  uniqueBy: "nombre",
  messages: {
    createDuplicate: "Ya existe una cuerda con ese nombre.",
    updateDuplicate: "Ya existe otra cuerda con ese nombre."
  }
});

// =========== REAL API (Axios) =========== //
const api = {
  async list() {
    const { data } = await http.get("/cuerdas");
    return Array.isArray(data) ? data : [];
  },
  async create(payload) {
    const { data } = await http.post("/cuerdas", payload);
    return data;
  },
  async update(payload) {
    const { data } = await http.put(`/cuerdas/${payload.id}`, payload);
    return data;
  },
  async remove(id) {
    await http.delete(`/cuerdas/${id}`);
    return { ok: true };
  }
};

export const cuerdasService = USE_MOCK ? mock : api;
