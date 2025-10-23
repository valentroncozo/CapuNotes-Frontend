export const fraternidadSchema = [
  { key: "nombre", label: "Nombre", required: true, max: 100, type: "text" },
  { key: "primary", label: "Agregar", type: "submit" },
];

export const fraternidadUniqueBy = "nombre";
export const fraternidadEntityName = "fraternidad";
export const FRATERNIDAD_STORAGE_KEY = "capunotes_fraternidades";

