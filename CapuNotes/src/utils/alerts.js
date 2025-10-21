// src/utils/alerts.js
import Swal from "sweetalert2";

/**
 * Tema unificado: mismo estilo que el cartel de eliminar cuerda
 * (fondo oscuro, texto claro, confirmar amarillo, cancelar gris).
 */
const THEME = {
  background: "#11103a",
  color: "#E8EAED",
  confirmButtonColor: "#ffc107",
  cancelButtonColor: "#6c757d",
};

function fire(opts) {
  return Swal.fire({
    ...THEME,
    ...opts,
  });
}

/** Confirm genérico */
export function confirmAction({
  title = "¿Confirmar?",
  text = "",
  confirmButtonText = "Confirmar",
  showCancelButton = true,
  icon = "question",
}) {
  return fire({
    icon,
    title,
    text,
    showCancelButton,
    confirmButtonText,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });
}

/** Confirm de eliminación */
export function confirmDelete({
  title = "¿Eliminar?",
  text = "",
  confirmButtonText = "Sí, eliminar",
}) {
  return confirmAction({
    title,
    text,
    confirmButtonText,
    icon: "warning",
  });
}

/** Toast de éxito */
export function success({
  title = "Operación exitosa",
  text = "",
  timer = 1400,
  showConfirmButton = false,
}) {
  return fire({
    icon: "success",
    title,
    text,
    timer,
    showConfirmButton,
  });
}

/** Modal de error */
export function error({
  title = "Error",
  text = "Ocurrió un error",
  confirmButtonText = "Aceptar",
}) {
  return fire({
    icon: "error",
    title,
    text,
    showConfirmButton: true,
    confirmButtonText,
  });
}

/** Info/aviso */
export function info({
  title = "Información",
  text = "",
  timer = 1400,
  showConfirmButton = false,
}) {
  return fire({
    icon: "info",
    title,
    text,
    timer,
    showConfirmButton,
  });
}
