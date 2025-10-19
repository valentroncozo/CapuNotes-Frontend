// src/services/areasService.js
import axios from "axios";
import localStorageApi from "./localStorageApi.js";

// 👉 Flag para elegir backend real o LocalStorage (por defecto: LocalStorage)
const USE_API = import.meta?.env?.VITE_USE_API === "true";

// Endpoints y claves de storage
const API_URL = "/api/areas";
const AREA_STORAGE_KEY = "areas";

// ===== Implementación API (axios) =====
const areasServiceApi = {
  // Obtener todas las áreas
  list: async () => {
    const res = await axios.get(API_URL);
    // Normalizamos a tu shape {id, nombre, descripcion}
    return res.data.map((a) => ({
      id: a.id,
      nombre: a.name,
      descripcion: a.description,
    }));
  },

  // Crear nueva área
  create: async (data) => {
    const payload = {
      name: data.nombre,
      description: data.descripcion,
    };
    const res = await axios.post(API_URL, payload);
    return {
      id: res.data.id,
      nombre: res.data.name,
      descripcion: res.data.description,
    };
  },

  // Editar área existente
  update: async (data) => {
    const payload = {
      name: data.nombre,
      description: data.descripcion,
    };
    const res = await axios.patch(`${API_URL}/${data.id}`, payload);
    return {
      id: res.data.id,
      nombre: res.data.name,
      descripcion: res.data.description,
    };
  },

  // Eliminar área
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

// ===== Implementación LocalStorage (con validación de duplicados) =====
const areasServiceLocal = localStorageApi(AREA_STORAGE_KEY, {
  uniqueBy: "nombre",
  messages: {
    createDuplicate: "Ya existe un área con ese nombre.",
    updateDuplicate: "Ya existe otra área con ese nombre.",
  },
});

// ===== Export único =====
export const areasService = USE_API ? areasServiceApi : areasServiceLocal;

// (Opcional, por si querés referenciarlos explícitamente en algún refactor futuro)
export { areasServiceApi, areasServiceLocal };
