// src/components/pages/audiciones/components/HorarioInputs.jsx
import InputHorario from './InputHorario.jsx';
import InputDuracionTurno from './InputDuracionTurno.jsx';
import '@/styles/horarios.css';

export default function HorarioInputs({ index, value = {}, onChange, onRemove }) {
  const handleChange = (field) => (newVal) => {
    onChange?.(index, { ...value, [field]: newVal });
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onRemove?.(index);
  };

  return (
    <div className='horarios-inputs'>
      <InputHorario name='Hora Desde' value={value.horaDesde || ''} onChange={handleChange('horaDesde')} />
      <InputHorario name='Hora Hasta' value={value.horaHasta || ''} onChange={handleChange('horaHasta')} />
      <InputDuracionTurno name='Duración del turno' value={value.duracion || ''} onChange={handleChange('duracion')} />
      <div className='container-eliminar-turno'>
        <button className="abmc-btn btn-secondary" onClick={handleRemove}>Eliminar</button>
      </div>
    </div>
  );
}
