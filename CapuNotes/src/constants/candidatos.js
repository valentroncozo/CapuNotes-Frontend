/**
 * Constantes relacionadas con candidatos de audiciones
 */

export const ESTADOS_RESULTADO = {
  ACEPTADO: 'aceptado',
  RECHAZADO: 'rechazado',
  AUSENTE: 'ausente',
  SIN_RESULTADO: 'sin'
};

/**
 * Obtiene la etiqueta legible de un estado de resultado
 * @param {string} estado - Estado del resultado
 * @returns {string} Etiqueta del estado
 */
export function estadoLabel(estado) {
  const e = String(estado || 'sin').toLowerCase();
  
  if (e === 'aceptado' || e === 'aceptada' || e === 'ok') {
    return 'Aceptado';
  }
  if (e === 'rechazado' || e === 'rechazada' || e === 'bad') {
    return 'Rechazado';
  }
  if (e === 'ausente' || e === 'pend') {
    return 'Ausente';
  }
  return 'Sin resultado';
}

/**
 * Obtiene la clase CSS para un estado de resultado
 * @param {string} estado - Estado del resultado
 * @returns {string} Clase CSS
 */
export function estadoClass(estado) {
  const e = String(estado || 'sin').toLowerCase();
  
  if (e === 'aceptado' || e === 'aceptada' || e === 'ok') {
    return 'estado-aceptado';
  }
  if (e === 'rechazado' || e === 'rechazada' || e === 'bad') {
    return 'estado-rechazado';
  }
  if (e === 'ausente' || e === 'pend') {
    return 'estado-ausente';
  }
  return 'estado-sin';
}

/**
 * Estados válidos de turno para la vista de coordinador
 */
export const TURNO_ESTADOS = ["disponible", "reservado", "cancelado"];
