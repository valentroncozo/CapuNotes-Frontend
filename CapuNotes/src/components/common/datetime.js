// src/components/common/datetime.js

/** Convierte "HH.mm hs" o "HH:mm" a minutos desde 00:00 */
export function horaToMinutes(horaStr = "") {
  const clean = String(horaStr).trim().replace(/\s*hs\s*$/i, "");
  const [h, m] = clean.includes(".") ? clean.split(".") : clean.split(":");
  const hh = parseInt(h || "0", 10);
  const mm = parseInt(m || "0", 10);
  return hh * 60 + mm;
}
