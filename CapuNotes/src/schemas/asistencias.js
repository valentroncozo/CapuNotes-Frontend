/**
 * ================================================================
 * Schema: Asistencia de Ensayo (VERSION ACTUALIZADA)
 * ---------------------------------------------------------------
 * Compatible con el DTO del backend:
 * {
 *   id,
 *   estado,
 *   fechaRegistro,
 *   ultimaModificacion,
 *   nombreMiembro,
 *   apellidoMiembro,
 *   cuerdaNombre,
 *   cuerdaId,
 *   area
 * }
 * ================================================================
 */

export const asistenciaSchema = [
  {
    key: "miembro",
    label: "Miembro",
    type: "text",
    getValue: (row) =>
      `${row.nombreMiembro ?? ""} ${row.apellidoMiembro ?? ""}`.trim(),
    width: "30%",
  },
  {
    key: "cuerda",
    label: "Cuerda",
    type: "text",
    getValue: (row) => row.cuerdaNombre ?? "—",
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
        onClick: "handleGuardar", // manejado desde el componente padre
      },
    ],
    width: "25%",
  },
];

/**
 * ================================================================
 * Clave única por fila
 * ---------------------------------------------------------------
 * Antes: miembro.id  (ya NO existe en el DTO modernizado)
 * Ahora: usamos directamente el id de Asistencia.
 * Si es null (AUSENTE por defecto), igualmente sirve como key para edición.
 * ================================================================
 */
export const asistenciaUniqueBy = "id";

/**
 * Nombre de la entidad (logs o helpers)
 */
export const asistenciaEntityName = "asistencia";

/**
 * Clave de storage local (si se desea guardar modificaciones temporales)
 */
export const ASISTENCIA_STORAGE_KEY = "capunotes_asistencias";
