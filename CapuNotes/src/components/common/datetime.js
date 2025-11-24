export const pad2 = (n) => String(n).padStart(2, '0');
export const formatHHmm = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;


/**
 * Utilidades para manejo de fechas y horas
 */

/**
 * Convierte una hora en formato "HH:mm" a minutos
 * @param {string} hora - Hora en formato "HH:mm"
 * @returns {number} Minutos desde medianoche
 */
export function horaToMinutes(hora) {
  if (!hora) return 0;
  const [h, m] = String(hora).split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Convierte minutos a formato "HH:mm"
 * @param {number} minutes - Minutos desde medianoche
 * @returns {string} Hora en formato "HH:mm"
 */
export function minutesToHora(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Formatea una fecha en formato ISO a formato local
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-AR');
}

/**
 * Formatea una fecha y hora en formato ISO a formato local
 * @param {string} isoDateTime - Fecha y hora en formato ISO
 * @returns {string} Fecha y hora formateadas
 */
export function formatDateTime(isoDateTime) {
  if (!isoDateTime) return '';
  const date = new Date(isoDateTime);
  return date.toLocaleString('es-AR');
}

/**
 * Obtiene el año de una fecha en formato string
 * @param {string} dateStr - Fecha en formato string
 * @returns {string} Año extraído
 */
export function getYear(dateStr) {
  const match = String(dateStr || '').match(/\b(20\d{2}|19\d{2})\b/);
  return match ? match[1] : '';
}

export function formatearFechaDdMmAIso(ddMMyyyy) {
  if (!ddMMyyyy) return "";

  // Si ya viene en ISO → convertirlo a dd/mm/yyyy primero
  if (ddMMyyyy.includes("-")) {
    const [yyyy, mm, dd] = ddMMyyyy.split("-");
    if (yyyy && mm && dd) {
      ddMMyyyy = `${dd}/${mm}/${yyyy}`;
    } else {
      return "";
    }
  }

  // Ahora debería estar en dd/mm/yyyy
  const partes = ddMMyyyy.split("/");
  if (partes.length !== 3) return "";

  const [dia, mes, anio] = partes;

  if (!dia || !mes || !anio) return "";

  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

export function isoToDdMmYyyy(iso) {
  if (!iso) return "";

  // iso = "yyyy-mm-dd"
  const [yyyy, mm, dd] = iso.split("-");

  if (!yyyy || !mm || !dd) return "";

  return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
}
