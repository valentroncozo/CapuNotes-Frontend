// src/services/miembrosService.js
import { localStorageApi } from "@/services/localStorageApi.js";
import { http, USE_MOCK } from "@/services/apiClient.js";

// Endpoints y claves de storage
const API_URL = "/miembros";
const MIEMBRO_STORAGE_KEY = "miembros";

// ===== Implementación LocalStorage con validación =====
const miembrosServiceLocal = localStorageApi(MIEMBRO_STORAGE_KEY, {
  uniqueBy: ["nombre", "apellido"],
  messages: {
    createDuplicate: "Ya existe un miembro con ese Nombre y Apellido.",
    updateDuplicate: "Ya existe otro miembro con ese Nombre y Apellido."
  }
});

// ===== Implementación API (Axios) =====
// Incluye remove(...) tolerante a distintas firmas para compatibilidad con hooks genéricos.
const miembrosServiceApi = {
  async list() {
    const { data } = await http.get(API_URL);
    return Array.isArray(data) ? data : [];
  },

  async getById(nroDocumento, tipoDocumento) {
    const { data } = await http.get(`${API_URL}/${tipoDocumento}/${nroDocumento}`);
    return data;
  },

  async create(payload) {
    const { data } = await http.post(API_URL, payload);
    return data;
  },

  async update(payload) {
    const { data } = await http.put(API_URL, payload);
    return data;
  },

  /**
   * remove admite:
   *  - (nroDocumento, tipoDocumento)
   *  - ({ nroDocumento, tipoDocumento })
   *  - (id)  -> si tu backend soporta ID único, ajustalo; si no, lanza error claro
   */
  async remove(arg1, arg2) {
    // Caso objeto { nroDocumento, tipoDocumento }
    if (arg1 && typeof arg1 === "object" && (arg1.nroDocumento || arg1.documento)) {
      const nro = String(arg1.nroDocumento ?? arg1.documento);
      const tipo = String(arg1.tipoDocumento ?? arg1.tipo ?? "").toUpperCase();
      await http.delete(`${API_URL}/${tipo}/${nro}`);
      return { ok: true };
    }

    // Caso (nroDocumento, tipoDocumento)
    if (arg1 && arg2) {
      const nro = String(arg1);
      const tipo = String(arg2).toUpperCase();
      await http.delete(`${API_URL}/${tipo}/${nro}`);
      return { ok: true };
    }

    // Caso (id) simple no soportado por el backend -> error explícito
    throw new Error(
      "remove(id) no soportado en API real. Pasá (nroDocumento, tipoDocumento) o un objeto { nroDocumento, tipoDocumento }."
    );
  }
};

export const miembrosService = USE_MOCK ? miembrosServiceLocal : miembrosServiceApi;
export { miembrosServiceApi, miembrosServiceLocal };
