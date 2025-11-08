/**
 * ================================================================
 * 📋 Schema: Asistencia de Ensayo
 * ---------------------------------------------------------------
 * Define los campos mostrados en la tabla de asistencia.
 * Coincide con el modelo del backend (Miembro, Cuerda, Estado).
 * ================================================================
 */

export const asistenciaSchema = [
  {
    key: "miembro",
    label: "Miembro",
    type: "text",
    getValue: (row) =>
      row.miembro
        ? `${row.miembro.nombre} ${row.miembro.apellido}`.trim()
        : "—",
    width: "30%",
  },
  {
    key: "cuerda",
    label: "Cuerda",
    type: "text",
    getValue: (row) =>
      row.miembro?.cuerda?.name ? row.miembro.cuerda.name : "—",
    width: "20%",
  },
  {
    key: "estado",
    label: "Estado",
    type: "select",
    options: [
      { value: "PRESENTE", label: "Presente" },
      { value: "MEDIA_FALTA", label: "Media falta" },
      { value: "AUSENTE", label: "Ausente" },
    ],
    editable: true,
    width: "25%",
  },
  {
    key: "acciones",
    label: "Acciones",
    type: "actions",
    actions: [
      {
        label: "Guardar",
        variant: "primary",
        onClick: "handleGuardar", // será manejado desde el componente
      },
    ],
    width: "25%",
  },
];

/**
 * 🔑 Clave única: cada registro se identifica por el ID del miembro.
 */
export const asistenciaUniqueBy = "miembro.id";

/**
 * 🏷️ Nombre de la entidad (para logs o mensajes genéricos)
 */
export const asistenciaEntityName = "asistencia";

/**
 * 💾 Clave local (para almacenamiento temporal si se usa cache)
 */
export const ASISTENCIA_STORAGE_KEY = "capunotes_asistencias";
