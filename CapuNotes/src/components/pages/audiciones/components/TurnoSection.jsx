// src/components/pages/audiciones/components/TurnoSection.jsx
import { useEffect, useState } from 'react';
import DayTitle from './DayTittle.jsx';
import HorarioInputs from './HorarioInputs.jsx';
import '@/styles/turnos.css';

export default function TurnoSection({ index, day, dias, setDias, onChange }) {
  const [franjas, setFranjas] = useState(() => ({ [day]: [{ horaDesde: '', horaHasta: '', duracion: '' }] }));

  useEffect(() => {
    setFranjas((prev) => (prev[day] ? prev : { ...prev, [day]: [{ horaDesde: '', horaHasta: '', duracion: '' }] }));
  }, [day]);

  const agregarFranja = () => {
    setFranjas((prev) => {
      const dayList = prev[day] || [];
      const nextDayList = [...dayList, { horaDesde: '', horaHasta: '', duracion: '' }];
      const next = { ...prev, [day]: nextDayList };
      onChange?.(index, next);
      return next;
    });
  };

  const eliminarFranja = (franjaIndex) => {
    setFranjas((prev) => {
      const dayList = prev[day] || [];
      const nextDayList = dayList.filter((_, i) => i !== franjaIndex);
      const next = { ...prev, [day]: nextDayList };
      onChange?.(index, next);

      if (nextDayList.length === 0 && typeof setDias === 'function' && Array.isArray(dias)) {
        setDias((prevDias) => prevDias.filter((_, diaIdx) => diaIdx !== index));
      }
      return next;
    });
  };

  const actualizarFranja = (franjaIndex, nuevoValor) => {
    setFranjas((prev) => {
      const dayList = prev[day] || [];
      const nextDayList = dayList.map((f, i) => (i === franjaIndex ? { ...f, ...nuevoValor } : f));
      const next = { ...prev, [day]: nextDayList };
      onChange?.(index, next);
      return next;
    });
  };

  const lista = franjas[day] || [];

  return (
    <div className="turno-input">
      <div className="content-horarios">
        <DayTitle title={day} />
      </div>

      <div className="content-horarios">
        {lista.map((f, i) => (
          <HorarioInputs key={i} index={i} value={f} onChange={actualizarFranja} onRemove={eliminarFranja} />
        ))}

        <button type="button" className="abmc-btn btn-primary" onClick={agregarFranja}>
          Agregar franja Horaria
        </button>
      </div>
    </div>
  );
}
