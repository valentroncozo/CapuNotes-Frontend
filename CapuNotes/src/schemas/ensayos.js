/**
 * ================================================================
 * 📋 Schema: Ensayo
 * ---------------------------------------------------------------
 * Estructura base para listar y manejar los ensayos en el frontend.
 * Coincide con los datos que devuelve el endpoint GET /ensayos.
 * ================================================================
 */

export const ensayoSchema = [
  { key: "nombre", label: "Nombre", type: "text" },
  { key: "descripcion", label: "Descripción", type: "text", truncate: true },
  { key: "fechaInicio", label: "Fecha", type: "date" },
  { key: "hora", label: "Hora", type: "time", optional: true },
  { key: "lugar", label: "Lugar", type: "text" },
  { key: "tipoEvento", label: "Tipo", type: "text" },
  {
    key: "estadoAsistencia",
    label: "Estado asistencia",
    type: "badge",
    map: {
      PENDIENTE: { color: "secondary", text: "Pendiente" },
      ABIERTA: { color: "warning", text: "Abierta" },
      CERRADA: { color: "success", text: "Cerrada" },
    },
  },
  {
    key: "porcentajeAsistencia",
    label: "% Asistencia",
    type: "progress",
  },
  {
    key: "acciones",
    label: "Acciones",
    type: "actions",
    actions: [
      { label: "Ver", icon: "eye", variant: "info", action: "view" },
      { label: "Eliminar", icon: "trash", variant: "danger", action: "delete" },
    ],
  },
];

