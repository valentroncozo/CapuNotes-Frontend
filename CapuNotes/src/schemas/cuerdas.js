// src/schemas/cuerdas.js
export const cuerdaSchema = [
  { key: "nombre", label: "Nombre", required: true, max: 100, type: "text" },
  { key: "primary", label: "Guardar", type: "submit" }
];

export const cuerdaUniqueBy = "nombre";
export const cuerdaEntityName = "cuerda";
export const CUERDA_STORAGE_KEY = "capunotes_cuerdas";
