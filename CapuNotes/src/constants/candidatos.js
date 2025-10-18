// src/constants/candidatos.js

export const ESTADOS = [
  { value: "sin",       label: "Sin calificar" },
  { value: "aceptado",  label: "Aceptado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "ausente",   label: "Ausente" },
];

export const CUERDAS = [
  "Soprano", "Mezzosoprano", "Contralto", "Tenor", "Barítono", "Bajo"
];

export function estadoLabel(value) {
  return ESTADOS.find((e) => e.value === value)?.label ?? "Sin calificar";
}

export function estadoClass(value) {
  switch (value) {
    case "aceptado":  return "accepted";
    case "rechazado": return "rejected";
    case "ausente":   return "absent";
    default:          return "sin";
  }
}
