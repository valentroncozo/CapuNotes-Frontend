// src/schemas/reporteParticipacionSchema.js

export const reporteParticipacion = [
  {
    key: "documento",
    label: "Documento",
    type: "text",
    visible: true,
    align: "left",
    formatter: (_, row) => `${row.tipoDocumento} ${row.nroDocumento}`,
  },
  {
    key: "nombreCompleto",
    label: "Nombre y Apellido",
    type: "text",
    visible: true,
    align: "left",
    formatter: (_, row) => `${row.apellido}, ${row.nombre}`,
  },
  {
    key: "cuerda",
    label: "Cuerda",
    type: "text",
    visible: true,
    align: "center",
  },
  {
    key: "area",
    label: "Área",
    type: "text",
    visible: true,
    align: "center",
  },
  {
    key: "activo",
    label: "Estado",
    type: "badge",
    visible: true,
    align: "center",
    formatter: (value) => (value ? "Activo" : "Inactivo"),
  },
  {
    key: "porcentaje",
    label: "% Asistencia",
    type: "number",
    visible: true,
    align: "center",
    formatter: (value) => `${value}%`,
  },
  {
    key: "ausentesExactos",
    label: "Ausentes",
    type: "number",
    visible: true,
    align: "center",
    formatter: (value) => value.toFixed(1),
  },
  {
    key: "presentes",
    label: "Presentes",
    type: "number",
    visible: false,
  },
  {
    key: "mediasFaltas",
    label: "½ Faltas",
    type: "number",
    visible: false,
  },
];

export const reporteParticipacionUniqueBy = "documento";
export const reporteParticipacionEntityName = "reporteParticipacion";
export const REPORTE_PARTICIPACION_STORAGE_KEY = "capunotes_reporte_participacion";
