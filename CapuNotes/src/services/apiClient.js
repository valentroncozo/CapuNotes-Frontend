// src/services/apiClient.js
import axios from "axios";

/**
 * BASE_URL:
 * - Si VITE_API_BASE_URL está definido (p.ej. http://localhost:8080), se usa eso.
 * - Si no, fallback a "/api" para funcionar con el proxy de Vite.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/+$/, "");

/**
 * Modo API/MOCK unificado:
 * - VITE_USE_API=true => prioriza API real (MOCK por defecto false)
 * - Si VITE_USE_API!=true, entonces MOCK por defecto true
 * - Cualquiera puede forzarse con VITE_USE_MOCK
 */
export const USE_API = String(import.meta.env.VITE_USE_API ?? "true") === "true";
export const USE_MOCK = String(
  import.meta.env.VITE_USE_MOCK ?? (USE_API ? "false" : "true")
) === "true";

/**
 * withCredentials:
 * - Si usás cookies/sesión de backend, dejalo true (default).
 * - Para JWT puro (Authorization: Bearer), podés poner false y setear header en interceptor.
 */
const WITH_CREDENTIALS = String(import.meta.env.VITE_USE_COOKIES ?? "true") !== "false";

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: WITH_CREDENTIALS,
  headers: { Accept: "application/json" }
});

// ===== Helpers de normalización de error =====
export class ApiError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message || "Error desconocido");
    this.name = "ApiError";
    this.status = status ?? null;
    this.code = code ?? null;
    this.data = data;
  }
}

function normalizeAxiosError(error) {
  if (error instanceof ApiError) return error;

  if (error.code === "ECONNABORTED") {
    return new ApiError("Request timeout", { code: "TIMEOUT" });
  }
  if (error.response) {
    const { status, data } = error.response;
    const msg =
      (data && (data.message || data.error || data.title)) ||
      `Request failed (${status})`;
    return new ApiError(msg, { status, data });
  }
  if (error.request) {
    return new ApiError("No se recibió respuesta del servidor.", { code: "NO_RESPONSE" });
  }
  return new ApiError(error?.message || "Error desconocido");
}

// ===== Interceptores (token / logging / errores) =====
http.interceptors.request.use(
  (config) => {
    // Si usás JWT, descomentá:
    // const token = localStorage.getItem("capunotes_token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(normalizeAxiosError(error))
);

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeAxiosError(error))
);

// Export utilidades por si son útiles en UI/hooks:
export const errors = { ApiError, normalizeAxiosError };
