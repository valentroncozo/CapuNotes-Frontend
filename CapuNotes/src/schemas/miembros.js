// src/schemas/miembros.js
import { AREA_STORAGE_KEY } from "./areas";
import { CUERDA_STORAGE_KEY } from "./cuerdas";

export const MIEMBRO_STORAGE_KEY = "capunotes_miembros";
export const miembroEntityName = "miembro";

// Evita duplicados por Nombre + Apellido
export const miembroUniqueBy = ["nombre", "apellido"];

/* Helpers para cargar opciones desde LocalStorage */
function optionsFromLS(key, field = "nombre") {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    return (arr || []).map((x) => x?.[field]).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Schema completo
 * - table === false: campo solo en formulario/modal info (no aparece en la tabla)
 * - Corrección: "Tipo DNI / Nro DNI" -> "Tipo de documento / Nro de documento"
 */
export function buildMiembroSchema() {
  const cuerdaOptions = optionsFromLS(CUERDA_STORAGE_KEY);
  const areaOptions = optionsFromLS(AREA_STORAGE_KEY);
  const estadoOptions = ["Activo", "Inactivo"];
  const tipoDocOptions = ["DNI", "LE", "LC", "Pasaporte", "CI"];

  return [
    // columnas principales (tabla)
    { key: "nombre", label: "Nombre", type: "text", required: true, max: 80 },
    { key: "apellido", label: "Apellido", type: "text", required: true, max: 80 },
    { key: "cuerda", label: "Cuerda", type: "select", required: true, options: cuerdaOptions },
    { key: "estado", label: "Estado", type: "select", required: true, options: estadoOptions },

    // solo formulario / info
    { key: "correo", label: "Email", type: "email", required: false, max: 120, table: false },
    { key: "telefono", label: "Teléfono", type: "text", required: false, max: 40, table: false },
    { key: "tipoDocumento", label: "Tipo de documento", type: "select", required: false, options: tipoDocOptions, table: false },
    { key: "nroDocumento", label: "Nro de documento", type: "text", required: false, max: 20, table: false },
    { key: "fechaNac", label: "Fecha de nacimiento", type: "date", required: false, table: false },
    { key: "provincia", label: "Provincia", type: "text", required: false, max: 60, table: false },
    { key: "pais", label: "País", type: "text", required: false, max: 60, table: false },
    { key: "profesion", label: "Profesión/Carrera", type: "text", required: false, max: 120, table: false },
    { key: "area", label: "Área", type: "select", required: false, options: areaOptions, table: false },

    // Botón legacy (ignorado por ABMC)
    { key: "primary", label: "Agregar", type: "button" },
  ];
}
