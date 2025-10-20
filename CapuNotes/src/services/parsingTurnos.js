// Helpers
function capitalize(s){ return s ? s[0].toUpperCase() + s.slice(1) : s; }

function parseToDateLocalOrIso(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const s = String(value);

  // detecta zona/offset (Z o +hh:mm / -hh:mm)
  const hasZone = /[zZ]$|[+-]\d{2}:\d{2}$/.test(s);

  if (hasZone) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  // formato LocalDateTime: 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss'
  const [datePart = '', timePart = '00:00:00'] = s.split('T');
  const [y, m, d] = (datePart || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  const [hh = 0, mm = 0, ss = 0] = (timePart || '').split(':').map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0, ss || 0);
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function labelFromDate(date) {
  const nombreDia = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
  return `${capitalize(nombreDia)} ${date.getDate()}`;
}

/**
 * Agrega turnos por día (usa fechaHoraInicio como fecha representativa).
 * @param {Array} turnos - cada turno tiene fechaHoraInicio, fechaHoraFin, estado
 * @returns {Array} [{ fecha: 'YYYY-MM-DD', dia: 'Lunes 12', cantidadTurnos: N, turnosDisponibles: M }, ...]
 */
function aggregateTurnosByDaySimple(turnos = []) {
  const groups = new Map();

  for (const t of turnos) {
    const raw = t.fechaHoraInicio || t.fechaHoraFin || t.fecha; // soporta variantes
    const dt = parseToDateLocalOrIso(raw);
    if (!dt) continue;

    const key = dateKey(dt);
    if (!groups.has(key)) {
      groups.set(key, { date: dt, total: 0, disponibles: 0 });
    }
    const g = groups.get(key);
    g.total += 1;

    const status = (t.estado || t.status || '').toString().toUpperCase();
    if (status === 'DISPONIBLE' || status === 'AVAILABLE') g.disponibles += 1;
  }

  return Array.from(groups.values())
    .sort((a, b) => a.date - b.date)
    .map(g => ({
      fecha: dateKey(g.date),
      dia: labelFromDate(g.date),           // 'Lunes 12'
      cantidadTurnos: g.total,
      turnosDisponibles: g.disponibles
    }));
}

export default aggregateTurnosByDaySimple;