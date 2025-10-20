// src/components/pages/audiciones/components/InputDuracionTurno.jsx
import AvTimerIcon from '@/assets/AvTimerIcon.jsx';

export default function InputDuracionTurno({ name, value = '', onChange }) {
  return (
    <div className="input-horario">
      <label htmlFor={name}>{name}</label>

      <div className="input-with-icon">
        <AvTimerIcon className="clock-icon" />
        <input
          type="text"
          placeholder='Minutos'
          id={name}
          name={name}
          className='abmc-input'
          required
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
