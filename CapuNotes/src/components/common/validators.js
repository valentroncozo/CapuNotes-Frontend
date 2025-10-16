// src/utils/validators.js

// Helpers
export const isEmpty = (v) => (v ?? '').toString().trim().length === 0;
export const len = (v) => (v ?? '').toString().trim().length;

// Reglas
export const required = (fieldLabel) => (v) =>
  isEmpty(v) ? `* El campo ${fieldLabel.toLowerCase()} no puede estar vacío.` : null;

export const maxLength = (fieldLabel, max) => (v) =>
  len(v) > max ? `* ${fieldLabel} no puede superar los ${max} caracteres.` : null;

// Ejecuta reglas para un valor
export function validateValue(value, rules = []) {
  for (const rule of rules) {
    const msg = rule?.(value);
    if (msg) return msg;
  }
  return null;
}

// ===== Formularios =====

// ÁREAS: { nombre, descripcion }
export function validateAreaFields(values) {
  return {
    nombre: validateValue(values?.nombre, [
      required('Nombre'),
      maxLength('Nombre', 80),
    ]),
    descripcion: validateValue(values?.descripcion, [
      maxLength('Descripción', 300),
    ]),
  };
}

// LOGIN: { username, password }
export function validateLoginFields(values) {
  return {
    usuario: validateValue(values?.username, [required('Usuario')]),
    contraseña: validateValue(values?.password, [required('Contraseña')]),
  };
}

// ¿Hay algún error?
export function hasErrors(errorsObj = {}) {
  return Object.values(errorsObj).some(Boolean);
}
