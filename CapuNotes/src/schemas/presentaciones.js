// src/schemas/presentacion.js
import { eventoSchema } from "./evento.js";

export const presentacionSchema = [
  ...eventoSchema,
  // más adelante podrás agregar campos específicos como repertorio, duración, etc.
];

export const presentacionUniqueBy = "nombre";
export const presentacionEntityName = "presentacion";
export const PRESENTACION_STORAGE_KEY = "capunotes_presentaciones";
