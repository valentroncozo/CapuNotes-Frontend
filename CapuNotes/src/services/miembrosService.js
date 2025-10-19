// src/services/miembrosService.js
import axios from "axios";
import localStorageApi from "./localStorageApi.js";

// 👉 Flag para elegir backend real o LocalStorage (por defecto: LocalStorage)
const USE_API = import.meta?.env?.VITE_USE_API === "true";

// Endpoints y claves de storage
const API_URL = "/api/miembros";
const MIEMBRO_STORAGE_KEY = "miembros";

// ===== Implementación LocalStorage con validación =====
const miembrosServiceLocal = localStorageApi(MIEMBRO_STORAGE_KEY, {
  uniqueBy: ["nombre", "apellido"],
  messages: {
    createDuplicate: "Ya existe un miembro con ese Nombre y Apellido.",
    updateDuplicate: "Ya existe otro miembro con ese Nombre y Apellido.",
  },
});

// ===== Implementación API (axios) =====
const miembrosServiceApi = {
  // Obtener todos los miembros
  list: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  // Obtener miembro por ID compuesto (nroDocumento + tipoDocumento)
  getById: async (nroDocumento, tipoDocumento) => {
    const res = await axios.get(`${API_URL}/${tipoDocumento}/${nroDocumento}`);
    return res.data;
  },

  // Crear nuevo miembro
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  // Actualizar miembro existente
  update: async (data) => {
    const res = await axios.put(API_URL, data);
    return res.data;
  },

  // Eliminar miembro
  remove: async (nroDocumento, tipoDocumento) => {
    await axios.delete(`${API_URL}/${tipoDocumento}/${nroDocumento}`);
  },
};

// ===== Export único =====
export const miembrosService = USE_API ? miembrosServiceApi : miembrosServiceLocal;

// (Opcional, por si querés referenciarlos explícitamente en algún refactor futuro)
export { miembrosServiceApi, miembrosServiceLocal };
