// src/schemas/candidatos.js
export const CANDIDATO_STORAGE_KEY = "capunotes_candidatos";

export const candidatoEstados = ["Reservado", "Cancelado", "—"];
export const candidatoResultados = ["✔", "✖", "—"];

// Helper: formato Hora "HH.mm hs"
export function fmtHora(hora) {
  return (hora || "").replace(":", ".") + " hs";
}
