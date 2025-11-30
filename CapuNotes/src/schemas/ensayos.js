// src/schemas/ensayo.js
import { eventoSchema } from "./evento.js";

export const ensayoSchema = [
  ...eventoSchema,
  {
    key: "estadoAsistencia",
    label: "Estado de asistencia",
    type: "select",
    required: false,
    options: [
      { value: "PENDIENTE", label: "Pendiente" },
      { value: "ABIERTA", label: "Abierta" },
      { value: "CERRADA", label: "Cerrada" },
    ],
  },
];

export const ensayoUniqueBy = "nombre";
export const ensayoEntityName = "ensayo";
export const ENSAYO_STORAGE_KEY = "capunotes_ensayos";
