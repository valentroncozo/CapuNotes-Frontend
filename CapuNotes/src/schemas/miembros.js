import { AREA_STORAGE_KEY } from "./areas";
import { CUERDA_STORAGE_KEY } from "./cuerdas";

function optionsFromLS(key, field = "nombre") {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    return (arr || []).map((x) => x?.[field]).filter(Boolean);
  } catch { return []; }
}

export function buildMiembroSchema() {
  const cuerdaOptions = optionsFromLS(CUERDA_STORAGE_KEY);
  const areaOptions   = optionsFromLS(AREA_STORAGE_KEY);
  const estadoOptions = ["Activo", "Inactivo"];

  return [
    { key: "nombre",   label: "Nombre",  type: "text", required: true, max: 80 },
    { key: "apellido", label: "Apellido", type: "text", required: true, max: 80 },
    { key: "cuerda",   label: "Cuerda",  type: "select", required: true, options: cuerdaOptions },
    { key: "area",     label: "Área",     type: "select", required: false, options: areaOptions },
    { key: "estado",   label: "Estado",   type: "select", required: true, options: estadoOptions },
    { key: "primary",  label: "Agregar",  type: "button" },
  ];
}

export const miembroEntityName = "miembro";
export const MIEMBRO_STORAGE_KEY = "capunotes_miembros";
