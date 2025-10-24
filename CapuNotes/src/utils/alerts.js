/**
 * Utilidades para alertas y notificaciones
 */

/**
 * Muestra una alerta de éxito
 * @param {Object} options - Opciones de la alerta
 * @param {string} options.title - Título de la alerta
 * @param {string} options.message - Mensaje opcional
 * @returns {Promise<void>}
 */
export async function success({ title, message }) {
  // Por ahora usamos alert simple, pero puedes reemplazar con una librería
  // como SweetAlert2, React-Toastify, etc.
  if (message) {
    alert(`${title}\n${message}`);
  } else {
    alert(title);
  }
}

/**
 * Muestra una alerta de error
 * @param {Object} options - Opciones de la alerta
 * @param {string} options.title - Título de la alerta
 * @param {string} options.message - Mensaje opcional
 * @returns {Promise<void>}
 */
export async function error({ title, message }) {
  if (message) {
    alert(`Error: ${title}\n${message}`);
  } else {
    alert(`Error: ${title}`);
  }
}

/**
 * Muestra una alerta de advertencia
 * @param {Object} options - Opciones de la alerta
 * @param {string} options.title - Título de la alerta
 * @param {string} options.message - Mensaje opcional
 * @returns {Promise<void>}
 */
export async function warning({ title, message }) {
  if (message) {
    alert(`Advertencia: ${title}\n${message}`);
  } else {
    alert(`Advertencia: ${title}`);
  }
}

/**
 * Muestra una alerta informativa
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.message
 */
export async function info({ title, message }) {
  if (message) {
    alert(`${title}\n${message}`);
  } else {
    alert(title);
  }
}

/**
 * Muestra un diálogo de confirmación
 * @param {Object} options - Opciones del diálogo
 * @param {string} options.title - Título del diálogo
 * @param {string} options.message - Mensaje del diálogo
 * @returns {Promise<boolean>} true si el usuario confirmó
 */
export async function confirm({ title, message }) {
  const text = message ? `${title}\n${message}` : title;
  return window.confirm(text);
}
