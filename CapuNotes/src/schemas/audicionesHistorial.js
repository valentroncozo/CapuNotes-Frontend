// src/schemas/audicionesHistorial.js

// Storage key para historial
export const HISTORIAL_AUDICIONES_STORAGE_KEY = "capunotes_historial_audiciones";

// Pequeño formateador por si las fechas vienen como "2024-04"
export function fmtAudicionLabel(audicionLabel) {
  // Si ya viene como "Abril 2024", devolver tal cual
  if (!audicionLabel) return "";
  return String(audicionLabel);
}
