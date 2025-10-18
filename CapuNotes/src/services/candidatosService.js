// src/services/candidatosService.js
// Servicio con persistencia en localStorage para candidatos (mock).

import { buildMockInscripcion } from "./candidatosServiceHelpers.js";
import { CANDIDATO_STORAGE_KEY } from "@/schemas/candidatos.js";

function safeReadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeAll(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

// Seed inicial (si no hay nada guardado)
const seedRows = [
  {
    id: 1,
    hora: "17.00 hs",
    nombre: "Begliardo, Francisco",
    cancion: "Ya me enteré, Reik",
    resultado: { estado: "sin", obs: "" },
    inscripcion: buildMockInscripcion({
      nombreCompleto: "Francisco Begliardo",
      tipoDoc: "DNI",
      nroDoc: "38.123.456",
      fechaNac: "1997-06-21",
      correo: "fran@example.com",
      telefono: "+54 351 555-0101",
      provincia: "Córdoba",
      pais: "Argentina",
      profesion: "Estudiante",
      cuerda: "Tenor",
      contanosDeVos: "Me gusta cantar desde chico.",
      motivacion: "Quiero crecer en la fe y la música.",
      cantoAntes: "Coro parroquial de mi barrio.",
      conoceMisa: "Sí, misa de 21hs de Capuchinos.",
      participaGrupo: "Grupo de jóvenes.",
      instrumentos: "Guitarra básica.",
      otrosTalentos: "Actuación.",
      comoTeEnteraste: "Instagram del coro.",
      queBuscas: "Comunidad y aprendizaje.",
      queCancion: "Ya me enteré (Reik).",
      diaAudicion: "Viernes 14",
      horaAudicion: "17.00 hs",
      aceptaTerminos: true,
    }),
  },
  {
    id: 2,
    hora: "17.15 hs",
    nombre: "Alejandro, Peréz",
    cancion: "Aleluya",
    resultado: { estado: "rechazado", obs: "Fuera de tono" },
    inscripcion: buildMockInscripcion({
      nombreCompleto: "Alejandro Peréz",
      tipoDoc: "DNI",
      nroDoc: "39.777.111",
      fechaNac: "1995-01-12",
      correo: "ale@example.com",
      telefono: "+54 351 555-0202",
      provincia: "Córdoba",
      pais: "Argentina",
      profesion: "Programador",
      cuerda: "Barítono",
      contanosDeVos: "Autodidacta.",
      motivacion: "Servir con la música.",
      cantoAntes: "No.",
      conoceMisa: "La conozco hace años.",
      participaGrupo: "No.",
      instrumentos: "Ninguno.",
      otrosTalentos: "Ilustración.",
      comoTeEnteraste: "Un amigo.",
      queBuscas: "Sumarme a un coro.",
      queCancion: "Aleluya.",
      diaAudicion: "Viernes 14",
      horaAudicion: "17.15 hs",
      aceptaTerminos: true,
    }),
  },
];

function ensureSeed() {
  const current = safeReadJson(CANDIDATO_STORAGE_KEY);
  if (!Array.isArray(current) || current.length === 0) {
    writeAll(CANDIDATO_STORAGE_KEY, seedRows);
    return seedRows;
  }
  return current;
}

export const candidatosService = {
  async list() {
    await new Promise((r) => setTimeout(r, 80)); // pequeña latencia
    return ensureSeed();
  },

  async updateResultado(id, resultado) {
    const list = ensureSeed();
    const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null;
    const next = [...list];
    next[idx] = { ...next[idx], resultado: { ...resultado } };
    writeAll(CANDIDATO_STORAGE_KEY, next);
    return next[idx];
  },

  async updateInscripcionCuerda(id, cuerda) {
    const list = ensureSeed();
    const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null;
    const row = list[idx];
    const updated = {
      ...row,
      inscripcion: { ...row.inscripcion, cuerda: cuerda ?? "" },
    };
    const next = [...list];
    next[idx] = updated;
    writeAll(CANDIDATO_STORAGE_KEY, next);
    return updated;
  },
};
