// src/schemas/cuerdas.js
export const cuerdaSchema = [
  { key: "name", label: "Nombre", required: true, max: 100, type: "text" },
  { key: "primary", label: "Agregar", type: "submit" },
];

export const cuerdaUniqueBy = "name";
export const cuerdaEntityName = "cuerda";
export const CUERDA_STORAGE_KEY = "capunotes_cuerdas";
