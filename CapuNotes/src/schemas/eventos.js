export const eventoSchema = [
  { key: 'nombre', label: 'Nombre', required: true, max: 100, type: 'text' },
  { key: 'lugar', label: 'Lugar', required: true, max: 100, type: 'text' },
  { key: 'descripcion', label: 'Descripción', max: 300, type: 'text' },
  { key: 'fecha', label: 'Fecha de inicio', required: true, type: 'date' },
  { key: 'hora', label: 'Hora', required: true, type: 'time' },
  {
    key: 'tipoEvento',
    label: 'Tipo de evento',
    required: true,
    type: 'select',
    options: [
      { value: 'ENSAYO', label: 'Ensayo' },
      { value: 'PRESENTACION', label: 'Presentación' },
    ],
  },
  { key: 'primary', label: 'Guardar', type: 'submit' },
];

export const eventoUniqueBy = 'nombre';
export const eventoEntityName = 'evento';
export const EVENTO_STORAGE_KEY = 'capunotes_eventos';
