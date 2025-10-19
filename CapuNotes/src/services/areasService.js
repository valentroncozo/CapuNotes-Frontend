// src/services/areasService.js
import { localStorageApi } from "@/services/localStorageApi.js";
import { http, USE_MOCK } from "@/services/apiClient.js";

// Endpoints y claves de storage
const API_URL = "/areas";
const AREA_STORAGE_KEY = "areas";

// ===== Implementación API (Axios) =====
const areasServiceApi = {
  async list() {
    const { data } = await http.get(API_URL);
    return (Array.isArray(data) ? data : []).map((a) => ({
      id: a.id,
      nombre: a.nombre ?? a.name ?? "",
      descripcion: a.descripcion ?? a.description ?? ""
    }));
  },

  async create(payload) {
    const body = { name: payload.nombre, description: payload.descripcion };
    const { data } = await http.post(API_URL, body);
    return {
      id: data.id,
      nombre: data.nombre ?? data.name ?? body.name,
      descripcion: data.descripcion ?? data.description ?? body.description
    };
  },

  async update(payload) {
    const body = { name: payload.nombre, description: payload.descripcion };
    const { data } = await http.patch(`${API_URL}/${payload.id}`, body);
    return {
      id: data.id,
      nombre: data.nombre ?? data.name ?? body.name,
      descripcion: data.descripcion ?? data.description ?? body.description
    };
  },

  async remove(id) {
    await http.delete(`${API_URL}/${id}`);
    return { ok: true };
  }
};

// ===== Implementación LocalStorage (con validación de duplicados) =====
const areasServiceLocal = localStorageApi(AREA_STORAGE_KEY, {
  uniqueBy: "nombre",
  messages: {
    createDuplicate: "Ya existe un área con ese nombre.",
    updateDuplicate: "Ya existe otra área con ese nombre."
  }
});

export const areasService = USE_MOCK ? areasServiceLocal : areasServiceApi;
export { areasServiceApi, areasServiceLocal };
