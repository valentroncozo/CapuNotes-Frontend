export const cuerdaSchema = [
  { key: "nombre", label: "Nombre", required: true, max: 80, type: "text" },
  { key: "primary", label: "Agregar", type: "submit" },
];

export const cuerdaUniqueBy = "nombre";
export const cuerdaEntityName = "cuerda";
export const CUERDA_STORAGE_KEY = "capunotes_cuerdas";
