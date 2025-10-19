// src/services/audicionesHistorialService.js
import { localStorageApi } from "@/services/localStorageApi.js";
import { HISTORIAL_AUDICIONES_STORAGE_KEY } from "@/schemas/audicionesHistorial.js";

// CRUD uniforme sobre LocalStorage
export const audicionesHistorialService = localStorageApi(HISTORIAL_AUDICIONES_STORAGE_KEY);
