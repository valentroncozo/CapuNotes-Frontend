// src/services/audicionesService.js
// Servicio mixto: intenta backend real; si no hay audición/turnos, usa mock seguro.

import AudicionService from "@/services/audicionService.js";
import TurnoService from "@/services/turnoServices.js";
import aggregateTurnosByDaySimple from "@/services/parsingTurnos.js";

/* =========================
 * Utilidades
 * =======================*/

// HH:mm desde Date o string parseable
function toTimeLabel(input) {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d)) return String(input);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// 'Viernes 14' desde Date
function dayLabelFromDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return "";
  const nombre = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(d);
  const dia = d.getDate();
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${dia}`;
}

// normaliza posible estructura de turno del backend
function mapBackendTurno(t) {
  // intentamos tomar hora desde fechaHoraInicio/fin o campos sueltos
  const hora =
    t.hora ||
    toTimeLabel(t.fechaHoraInicio) ||
    toTimeLabel(t.fechaHoraFin) ||
    "";

  // estado viene como 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO'
  const turnoEstado = String(t.estado || "").toLowerCase();

  // candidato (si hay)
  const ins = t.inscripcion || t.candidato || null;
  const nombre =
    ins?.apellido || ins?.nombre
      ? `${ins?.apellido ?? ""}${ins?.apellido ? ", " : ""}${ins?.nombre ?? ""}`.trim()
      : "-";

  return {
    id: t.id ?? `${hora}-${Math.random().toString(36).slice(2, 7)}`,
    hora,
    apellido: ins?.apellido || "-",
    nombre: ins?.nombre || "-",
    cancion: ins?.cancion || "—",
    turnoEstado,
    inscripcion: ins || null,
    // para filtrar por día, guardamos una fecha representativa
    _fechaRef: t.fechaHoraInicio || t.fecha || t.fechaHoraFin || null,
  };
}

/* =========================
 * Mock seguro si no hay datos reales
 * =======================*/

const _audicionActualMock = [
  { id: 1, dia: "Viernes 14", cantidadTurnos: 10, turnosDisponibles: 5 },
  { id: 2, dia: "Sábado 15", cantidadTurnos: 8, turnosDisponibles: 3 },
  { id: 3, dia: "Domingo 16", cantidadTurnos: 12, turnosDisponibles: 7 },
];

// genera HH:mm cada 15’ a partir de 18:00
function _genHoras(cant) {
  const baseMin = 18 * 60;
  const step = 15;
  return Array.from({ length: cant }, (_, i) => {
    const m = baseMin + i * step;
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  });
}

async function _mock_listDias() {
  return _audicionActualMock.map((x) => x.dia);
}
async function _mock_listTurnos(dia) {
  const aud = _audicionActualMock.find((x) => x.dia === dia);
  const cant = aud ? aud.cantidadTurnos : 8;
  const horas = _genHoras(cant);
  return horas.map((h, idx) => ({
    id: `${dia}-${idx + 1}`,
    hora: h,
    apellido: "-",
    nombre: "-",
    cancion: "—",
    turnoEstado: "disponible",
    inscripcion: null,
  }));
}

/* =========================
 * API pública
 * =======================*/

export const audicionesService = {
  /**
   * Devuelve etiquetas de días de la audición activa.
   * Si no hay audición/turnos, vuelve al mock.
   */
  async listDias() {
    try {
      const aud = await AudicionService.getActual();
      if (!aud?.id) return _mock_listDias();

      const turnos = await TurnoService.listarPorAudicion(aud.id);
      if (!Array.isArray(turnos) || turnos.length === 0) return _mock_listDias();

      const agregados = aggregateTurnosByDaySimple(turnos); // [{ fecha, dia, ... }]
      return agregados.map((g) => g.dia);
    } catch (e) {
      // fallback seguro
      return _mock_listDias();
    }
  },

  /**
   * Lista turnos del día indicado (etiqueta "Viernes 14").
   * Conecta al backend si hay audición activa; sino mock.
   */
  async listTurnos(diaLabel) {
    try {
      const aud = await AudicionService.getActual();
      if (!aud?.id) return _mock_listTurnos(diaLabel);

      const turnos = await TurnoService.listarPorAudicion(aud.id);
      if (!Array.isArray(turnos) || turnos.length === 0)
        return _mock_listTurnos(diaLabel);

      // Filtrar por día (comparamos contra label "Viernes 14")
      const filtrados = turnos
        .map(mapBackendTurno)
        .filter((t) => {
          const d = t._fechaRef ? new Date(t._fechaRef) : null;
          return d && dayLabelFromDate(d) === diaLabel;
        });

      // Si por algún motivo no coincide ninguna fecha, devolvemos mock para no romper UX
      if (filtrados.length === 0) return _mock_listTurnos(diaLabel);

      return filtrados;
    } catch {
      return _mock_listTurnos(diaLabel);
    }
  },

  /**
   * (Opcional) lista de días + totales para la tabla de Audición.
   * No lo usa candidatos directamente, pero queda por si lo necesitás.
   */
  async listAudicionesAggregated() {
    try {
      const aud = await AudicionService.getActual();
      if (!aud?.id) return _audicionActualMock;

      const turnos = await TurnoService.listarPorAudicion(aud.id);
      const agregados = aggregateTurnosByDaySimple(turnos);
      // normalizamos al mismo shape que usa la tabla de Audición
      return agregados.map((g, i) => ({
        id: i + 1,
        dia: g.dia,
        cantidadTurnos: g.cantidadTurnos,
        turnosDisponibles: g.turnosDisponibles,
      }));
    } catch {
      return _audicionActualMock;
    }
  },
};
