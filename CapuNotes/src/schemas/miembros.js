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
    { key: "nombre",   label: "Nombre", required: true, max: 80 },
    { key: "apellido", label: "Apellido", required: true, max: 80 },
    { key: "cuerda",   label: "Cuerda", type: "select", options: cuerdaOptions },
    { key: "area",     label: "Área",   type: "select", options: areaOptions },
    { key: "estado",   label: "Estado", type: "select", options: estadoOptions },
  ];
}

export const miembroEntityName = "miembro";
export const MIEMBRO_STORAGE_KEY = "capunotes_miembros";
