// src/services/candidatosService.js
// Runtime toggle: MOCK por defecto; poner VITE_USE_MOCK="false" para usar backend.
// list(), updateResultado(id, payload), updateInscripcionCuerda(id, cuerda), updateTurnoEstado(id, estado)

import { apiClient } from "@/services/apiClient";
import { buildMockInscripcion } from "./candidatosServiceHelpers.js";

const STORAGE_KEY = "capunotes_candidatos";

function safeReadJson(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function writeAll(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }

const seedRows = [
  {
    id: 1,
    hora: "17.00 hs",
    nombre: "Begliardo, Francisco",
    cancion: "Ya me enteré, Reik",
    resultado: { estado: "sin", obs: "" },
    turnoEstado: "reservado",
    inscripcion: buildMockInscripcion({ nombreCompleto: "Francisco Begliardo", cuerda: "Tenor", diaAudicion: "Viernes 14", horaAudicion: "17.00 hs", aceptaTerminos: true }),
  },
  {
    id: 2,
    hora: "17.15 hs",
    nombre: "Alejandro, Peréz",
    cancion: "Aleluya",
    resultado: { estado: "rechazado", obs: "Fuera de tono" },
    turnoEstado: "cancelado",
    inscripcion: buildMockInscripcion({ nombreCompleto: "Alejandro Peréz", cuerda: "Barítono", diaAudicion: "Viernes 14", horaAudicion: "17.15 hs", aceptaTerminos: true }),
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
  async list() { await new Promise((r) => setTimeout(r, 80)); return ensureSeed(); },
  async updateResultado(id, resultado) {
    const list = ensureSeed(); const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null; const next = [...list];
    next[idx] = { ...next[idx], resultado: { ...resultado } };
    writeAll(STORAGE_KEY, next); return next[idx];
  },
  async updateInscripcionCuerda(id, cuerda) {
    const list = ensureSeed(); const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null; const row = list[idx];
    const updated = { ...row, inscripcion: { ...row.inscripcion, cuerda: cuerda ?? "" } };
    const next = [...list]; next[idx] = updated; writeAll(STORAGE_KEY, next); return updated;
  },
  async updateTurnoEstado(id, estado) {
    const list = ensureSeed(); const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null; const next = [...list];
    next[idx] = { ...next[idx], turnoEstado: String(estado || "").toLowerCase() };
    writeAll(STORAGE_KEY, next); return next[idx];
  },
};

// ========= REAL API =========
const apiService = {
  async list(audicionId) {
    const data = await apiClient.get("/candidatos", { params: audicionId ? { audicionId } : undefined });
    return (Array.isArray(data) ? data : []).map((r) => ({
      id: r.id,
      hora: r.horaLabel || r.hora || "",
      nombre: r.nombre || r.nombreLabel || "",
      cancion: r.cancion || "",
      resultado: r.resultado || { estado: "sin", obs: "" },
      turnoEstado: (r.turno && r.turno.estado) ? String(r.turno.estado).toLowerCase() : (r.turnoEstado || "").toLowerCase(),
      inscripcion: r.inscripcion || buildMockInscripcion(),
    }));
  },
  async updateResultado(id, { estado, obs }) {
    const updated = await apiClient.put(`/candidatos/${id}/resultado`, { body: { estado, obs } });
    return {
      id: updated.id ?? id,
      hora: updated.horaLabel || updated.hora || "",
      nombre: updated.nombre || updated.nombreLabel || "",
      cancion: updated.cancion || "",
      resultado: updated.resultado || { estado, obs },
      turnoEstado: (updated.turno && updated.turno.estado) ? String(updated.turno.estado).toLowerCase() : (updated.turnoEstado || "").toLowerCase(),
      inscripcion: updated.inscripcion || buildMockInscripcion(),
    };
  },
  async updateInscripcionCuerda(id, cuerda) {
    const updated = await apiClient.patch(`/candidatos/${id}/inscripcion/cuerda`, { body: { cuerda } });
    return {
      id: updated.id ?? id,
      hora: updated.horaLabel || updated.hora || "",
      nombre: updated.nombre || updated.nombreLabel || "",
      cancion: updated.cancion || "",
      resultado: updated.resultado || { estado: "sin", obs: "" },
      turnoEstado: (updated.turno && updated.turno.estado) ? String(updated.turno.estado).toLowerCase() : (updated.turnoEstado || "").toLowerCase(),
      inscripcion: { ...buildMockInscripcion(), ...(updated.inscripcion || {}) },
    };
  },
  async updateTurnoEstado(id, estado) {
    const updated = await apiClient.put(`/candidatos/${id}/turno`, { body: { estado } });
    return {
      id: updated.id ?? id,
      hora: updated.horaLabel || updated.hora || "",
      nombre: updated.nombre || updated.nombreLabel || "",
      cancion: updated.cancion || "",
      resultado: updated.resultado || { estado: "sin", obs: "" },
      turnoEstado: (updated.turno && updated.turno.estado) ? String(updated.turno.estado).toLowerCase() : (updated.turnoEstado || String(estado)).toLowerCase(),
      inscripcion: updated.inscripcion || buildMockInscripcion(),
    };
  },
};

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") !== "false";
export const candidatosService = USE_MOCK ? mockService : apiService;
