// src/services/audicionesHistorialService.js
import { localStorageApi } from "@/services/localStorageApi";
import { HISTORIAL_AUDICIONES_STORAGE_KEY } from "@/schemas/audicionesHistorial";

// CRUD uniforme sobre LocalStorage
export const audicionesHistorialService = localStorageApi(HISTORIAL_AUDICIONES_STORAGE_KEY);
