// src/schemas/ensayos.js

/**
 * Define el esquema de campos para la creación y edición de ensayos.
 * Se basa en la entidad Ensayo (que hereda de Evento).
 */
export const ensayoSchema = [
  // --- Campos heredados de Evento ---
  { key: "nombre", label: "Nombre", required: true, max: 100, type: "text" },
  { key: "descripcion", label: "Descripción", type: "textarea" },
  { key: "lugar", label: "Lugar", max: 100, type: "text" },
  
  // --- Campos específicos de Ensayo ---
  { key: "fechaInicio", label: "Fecha del Ensayo", required: true, type: "date" },
  { key: "hora", label: "Hora", required: true, type: "time" },
  
  // El estado de asistencia es PENDIENTE por defecto y suele ser manejado por el backend
  // Si quisieras que el usuario lo establezca, sería:
  /*
  { 
    key: "estadoAsistencia", 
    label: "Estado Inicial", 
    required: true, 
    type: "select", 
    options: [
        { value: "PENDIENTE", label: "Pendiente" },
        { value: "ABIERTA", label: "Abierta" },
        { value: "CERRADA", label: "Cerrada" },
    ]
  },
  */
  
  // --- Acciones ---
  { key: "primary", label: "Guardar Ensayo", type: "submit" },
];

/**
 * Clave utilizada para verificar unicidad (ej: nombre no repetido).
 * Se puede cambiar a un campo más apropiado si fuera necesario.
 */
export const ensayoUniqueBy = "nombre";

/**
 * Nombre de la entidad para el almacenamiento local o mensajes.
 */
export const ensayoEntityName = "ensayo";

/**
 * Clave de almacenamiento local, aunque se recomienda usar el backend (como estás haciendo).
 */
export const ENSAYO_STORAGE_KEY = "capunotes_ensayos";