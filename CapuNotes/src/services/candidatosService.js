// src/services/candidatosService.js
import { localStorageApi } from "@/services/localStorageApi";
import { CANDIDATO_STORAGE_KEY } from "@/schemas/candidatos";

// CRUD sobre LocalStorage (misma interfaz que Áreas/Cuerdas/Miembros)
export const candidatosService = localStorageApi(CANDIDATO_STORAGE_KEY);
