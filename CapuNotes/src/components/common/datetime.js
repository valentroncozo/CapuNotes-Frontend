export const pad2 = (n) => String(n).padStart(2, '0');
export const formatHHmm = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
export const horaToMinutes = (hhmm) => {
  const [h, m] = String(hhmm || '0:0').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};


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
