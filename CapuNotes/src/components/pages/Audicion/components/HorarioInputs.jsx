import InputHorario from './InputHorario';
import InputDuracionTurno from './InputDuracionTurno';
import '@/styles/horarios.css';

// HorarioInputs ahora es un componente controlado
// Props:
// - index: número de la franja
// - value: { horaDesde, horaHasta, duracion }
// - onChange: function(index, newValue)
// - onRemove: function(index)
const HorarioInputs = ({ index, value = {}, onChange, onRemove }) => {
    
    const handleChange = (field) => (newVal) => {
        if (typeof onChange === 'function') {
            onChange(index, { ...value, [field]: newVal });
        }
    };

    const handleRemove = (e) => {
        e.preventDefault();
        if (typeof onRemove === 'function') onRemove(index);
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
};

export default HorarioInputs;