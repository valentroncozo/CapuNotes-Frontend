export const reporteAsistenciaMiembroAnual = [
  {
    key: "miembroId",
    label: "Documento",
    type: "text",
    visible: true,
    align: "left",
  },
  {
    key: "nombreCompleto",
    label: "Nombre y Apellido",
    type: "text",
    visible: true,
    align: "left",
  },
  {
    key: "cuerda",
    label: "Cuerda",
    type: "text",
    visible: true,
    align: "center",
  },
  {
    key: "presentes",
    label: "Presentes",
    type: "number",
    visible: false, // solo para el detalle
  },
  {
    key: "mediasFaltas",
    label: "½ Faltas",
    type: "number",
    visible: false,
  },
  {
    key: "ausentes",
    label: "Ausentes",
    type: "number",
    visible: false,
  },
  {
    key: "porcentajeAsistencia",
    label: "% Asistencia",
    type: "number",
    visible: true,
    align: "center",
    formatter: (value) => `${value.toFixed(1)}%`,
  },
  {
    key: "porcentajeAusencia",
    label: "% Ausencia",
    type: "number",
    visible: true,
    align: "center",
    formatter: (value) => `${value.toFixed(1)}%`,
  },
  {
    key: "maximaContinuidad",
    label: "Máx. continuidad",
    type: "number",
    visible: true,
    align: "center",
  },
];

export const reporteAsistenciaMiembroUniqueBy = "miembroId";
export const reporteAsistenciaMiembroEntityName = "reporteAsistenciaMiembro";
export const REPORTE_ASISTENCIA_MIEMBRO_STORAGE_KEY = "capunotes_reporte_asistencia_miembro";
