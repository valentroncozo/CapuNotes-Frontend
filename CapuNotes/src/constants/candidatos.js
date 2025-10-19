// src/constants/candidatos.js

// Storage (si lo necesitás en mocks/localStorage)
export const CANDIDATO_STORAGE_KEY = "capunotes_candidatos";

/**
 * Listado de cuerdas disponible para selección/edición de inscripción.
 * Ajustalo si tu backend usa otros nombres u orden.
 */
export const CUERDAS = ["Soprano", "Contralto", "Tenor", "Bajo"];

/**
 * Estados de turno (COORDINADORES)
 * - disponible | reservado | cancelado
 *
 * Estados/Resultados de evaluación (EVALUADORES)
 * - aceptado | rechazado | ausente | sin
 * - Compatibilidad: ok | bad | pend  => aceptado | rechazado | ausente
 */
export const TURNO_ESTADOS = ["disponible", "reservado", "cancelado"];
export const RESULTADO_ESTADOS = ["aceptado", "rechazado", "ausente", "sin"];

// Ayuda: formato "HH:mm" -> "HH.mm hs"
export function fmtHora(hora) {
  return (hora || "").replace(":", ".") + " hs";
}

/** Normaliza el estado a uno conocido para badge + label */
export function normalizeEstado(raw) {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();

  // Estados de turno (coordinadores)
  if (["disponible", "reservado", "cancelado"].includes(v)) return v;

  // Estados de resultado (evaluadores)
  if (["aceptado", "rechazado", "ausente", "sin"].includes(v)) return v;

  // Compatibilidad con legacy/antiguos
  if (v === "ok" || v === "✔" || v === "aprobado") return "aceptado";
  if (v === "bad" || v === "✖" || v === "rechazo" || v === "no") return "rechazado";
  if (v === "pend" || v === "ausente" || v === "n/a" || v === "na") return "ausente";
  if (!v || v === "-" || v === "—") return "sin";

  return v; // devolver lo que venga por si el backend define algo nuevo
}

/** Devuelve la clase de badge para estilos */
export function estadoClass(estado) {
  const v = normalizeEstado(estado);
  switch (v) {
    // Turnos (coordinadores)
    case "disponible":
      return "available";
    case "reservado":
      return "reserved";
    case "cancelado":
      return "cancelled";

    // Resultados (evaluadores)
    case "aceptado":
      return "accepted";
    case "rechazado":
      return "rejected";
    case "ausente":
      return "absent";
    case "sin":
      return "sin";

    default:
      return "sin";
  }
}

/** Texto legible para UI */
export function estadoLabel(estado) {
  const v = normalizeEstado(estado);
  switch (v) {
    // Turnos (coordinadores)
    case "disponible":
      return "Disponible";
    case "reservado":
      return "Reservado";
    case "cancelado":
      return "Cancelado";

    // Resultados (evaluadores)
    case "aceptado":
      return "Aceptado";
    case "rechazado":
      return "Rechazado";
    case "ausente":
      return "Ausente";
    case "sin":
      return "Sin resultado";

    default:
      return v ? v[0].toUpperCase() + v.slice(1) : "—";
  }
}

/** “Apellido, Nombre” robusto ante faltantes */
export function nombreApynom(row = {}) {
  const ape = String(row.apellido ?? "").trim();
  const nom = String(row.nombre ?? "").trim();
  if (ape && nom) return `${ape}, ${nom}`;
  return nom || ape || String(row.nombre ?? "") || "—";
}
