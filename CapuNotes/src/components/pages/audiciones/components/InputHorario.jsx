// src/components/pages/audiciones/components/InputHorario.jsx
import ClockIcon from "@/assets/ClockIcon.jsx";
import '@/styles/input-horario.css';

export default function InputHorario({ name, value = '', onChange }) {
  return (
    <div className="input-horario">
      <label htmlFor={name}>{name}</label>

      <div className="input-with-icon">
        <ClockIcon className="clock-icon" />
        <input
          type="time"
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
