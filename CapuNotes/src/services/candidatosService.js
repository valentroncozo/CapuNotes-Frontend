// src/services/candidatosService.js
// Runtime toggle: MOCK por defecto; poner VITE_USE_MOCK="false" para usar backend.
// Contrato público sin cambios: list(), updateResultado(id, payload), updateInscripcionCuerda(id, cuerda)

import { apiClient } from "@/services/apiClient";
import { buildMockInscripcion } from "./candidatosServiceHelpers.js";

// ================== MOCK (localStorage) ==================
const STORAGE_KEY = "capunotes_candidatos";

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

// Seed inicial
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
  const current = safeReadJson(STORAGE_KEY);
  if (!Array.isArray(current) || current.length === 0) {
    writeAll(STORAGE_KEY, seedRows);
    return seedRows;
  }
  return current;
}

const mockService = {
  async list() {
    await new Promise((r) => setTimeout(r, 80));
    return ensureSeed();
  },
  async updateResultado(id, resultado) {
    const list = ensureSeed();
    const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null;
    const next = [...list];
    next[idx] = { ...next[idx], resultado: { ...resultado } };
    writeAll(STORAGE_KEY, next);
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
    writeAll(STORAGE_KEY, next);
    return updated;
  },
};

// ================== REAL API ==================
// Ajustá paths a tu backend. Se mantiene el mismo shape que consume la UI.
const apiService = {
  // GET /candidatos?audicionId=...
  async list(audicionId) {
    const data = await apiClient.get("/candidatos", {
      params: audicionId ? { audicionId } : undefined,
    });
    // Aseguramos campos mínimos que espera la UI:
    return (Array.isArray(data) ? data : []).map((r) => ({
      id: r.id,
      hora: r.horaLabel || r.hora || "",        // admite "17.00 hs" o formateás en el back
      nombre: r.nombre || r.nombreLabel || "",  // "Apellido, Nombre" o similar
      cancion: r.cancion || "",
      resultado: r.resultado || { estado: "sin", obs: "" },
      inscripcion: r.inscripcion || buildMockInscripcion(),
    }));
  },

  // PUT /candidatos/:id/resultado  { estado, obs }
  async updateResultado(id, { estado, obs }) {
    const updated = await apiClient.put(`/candidatos/${id}/resultado`, {
      body: { estado, obs },
    });
    return {
      id: updated.id ?? id,
      hora: updated.horaLabel || updated.hora || "",
      nombre: updated.nombre || updated.nombreLabel || "",
      cancion: updated.cancion || "",
      resultado: updated.resultado || { estado, obs },
      inscripcion: updated.inscripcion || buildMockInscripcion(),
    };
  },

  // PATCH /candidatos/:id/inscripcion/cuerda  { cuerda }
  async updateInscripcionCuerda(id, cuerda) {
    const updated = await apiClient.patch(
      `/candidatos/${id}/inscripcion/cuerda`,
      { body: { cuerda } }
    );
    return {
      id: updated.id ?? id,
      hora: updated.horaLabel || updated.hora || "",
      nombre: updated.nombre || updated.nombreLabel || "",
      cancion: updated.cancion || "",
      resultado: updated.resultado || { estado: "sin", obs: "" },
      inscripcion: {
        ...buildMockInscripcion(),
        ...(updated.inscripcion || {}),
      },
    };
  },
};

// ================== SELECTOR ==================
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") !== "false";
export const candidatosService = USE_MOCK ? mockService : apiService;
