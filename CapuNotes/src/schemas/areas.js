export const areaSchema = [
  { key: "nombre", label: "Nombre", required: true, max: 80, type: "text" },
  { key: "descripcion", label: "Descripción", max: 300, type: "text" },
  { key: "primary", label: "Agregar", type: "submit" },

];

export const areaUniqueBy = "nombre";
export const areaEntityName = "área";
export const AREA_STORAGE_KEY = "capunotes_areas";
