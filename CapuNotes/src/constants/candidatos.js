export const TURNO_ESTADOS = ['disponible', 'reservado', 'cancelado'];

export const estadoLabel = (v) => {
  const e = String(v || 'sin').toLowerCase();
  if (e === 'aceptado' || e === 'aceptada' || e === 'ok') return 'Aceptado';
  if (e === 'rechazado' || e === 'rechazada' || e === 'bad') return 'Rechazado';
  if (e === 'ausente' || e === 'pend') return 'Ausente';
  return 'Sin resultado';
};

