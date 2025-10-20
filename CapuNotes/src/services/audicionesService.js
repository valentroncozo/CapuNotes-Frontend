// src/services/audicionesService.js
// Servicio mock para la "audición vigente" (una por año)

const _audicionActual = [
  { id: 1, dia: "Viernes 14",  cantidadTurnos: 10, turnosDisponibles: 5 },
  { id: 2, dia: "Sábado 15",   cantidadTurnos:  8, turnosDisponibles: 3 },
  { id: 3, dia: "Domingo 16",  cantidadTurnos: 12, turnosDisponibles: 7 },
];

// genera HH:MM cada 15' a partir de 18:00, por ejemplo
function _genHoras(cant) {
  const baseMin = 18 * 60; // 18:00
  const step = 15;
  return Array.from({ length: cant }, (_, i) => {
    const m = baseMin + i * step;
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  });
}

export const audicionesService = {
  async listAudiciones() {
    await new Promise((r) => setTimeout(r, 80));
    return _audicionActual;
  },

  async listDias() {
    const a = await this.listAudiciones();
    return a.map(x => x.dia);
  },

  // Turnos por día: por ahora solo “disponible”, sin inscripción; el back pondrá la hora real
  async listTurnos(dia) {
    await new Promise((r) => setTimeout(r, 80));
    const aud = _audicionActual.find(x => x.dia === dia);
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
  },
};
