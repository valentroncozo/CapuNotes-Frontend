// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar un campo específico
  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  };

  // Validar todos los campos
  const validate = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field];
      const value = values[field];

      // Validación requerido
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] =
          rule.message || `${rule.label || field} es requerido`;
        return;
      }

      // Si el campo está vacío y no es requerido, no validar más
      if (!value || value.toString().trim() === '') {
        return;
      }

      // Validación de patrón (email, teléfono, etc.)
      if (rule.pattern && !rule.pattern.test(value)) {
        newErrors[field] =
          rule.patternMessage || `${rule.label || field} no es válido`;
        return;
      }

      // Validación de longitud mínima
      if (rule.minLength && value.length < rule.minLength) {
        newErrors[field] =
          rule.minLengthMessage ||
          `${rule.label || field} debe tener al menos ${
            rule.minLength
          } caracteres`;
        return;
      }

      // Validación de longitud máxima
      if (rule.maxLength && value.length > rule.maxLength) {
        newErrors[field] =
          rule.maxLengthMessage ||
          `${rule.label || field} no puede tener más de ${
            rule.maxLength
          } caracteres`;
        return;
      }

      // Validación personalizada
      if (rule.validate && typeof rule.validate === 'function') {
        const customError = rule.validate(value, values);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resetear formulario
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  // Establecer errores manualmente
  const setFieldError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    setValue,
    validate,
    reset,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
};
