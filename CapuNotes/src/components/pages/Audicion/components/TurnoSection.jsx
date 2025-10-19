
import { useEffect, useState } from 'react';
import DayTitle from './DayTittle';
import HorarioInputs from './HorarioInputs';
import '@/styles/turnos.css';

// franjas será un objeto con claves por día: { [day]: [ {horaDesde, horaHasta, duracion}, ... ] }
const TurnoSection = ({ index, day, dias, setDias, onChange }) => {

    const [franjas, setFranjas] = useState(() => ({ [day]: [{ horaDesde: '', horaHasta: '', duracion: '' }] }));

    // si cambia la prop `day`, aseguramos que exista la clave correspondiente en el estado
    useEffect(() => {
        setFranjas((prev) => (prev[day] ? prev : { ...prev, [day]: [{ horaDesde: '', horaHasta: '', duracion: '' }] }));
    }, [day]);

    const agregarFranja = () => {
        setFranjas((prev) => {
            const dayList = prev[day] || [];
            const nextDayList = [...dayList, { horaDesde: '', horaHasta: '', duracion: '' }];
            const next = { ...prev, [day]: nextDayList };
            if (typeof onChange === 'function') onChange(index, next);
            return next;
        });
    };

    const eliminarFranja = (franjaIndex) => {
        setFranjas((prev) => {
            const dayList = prev[day] || [];
            const nextDayList = dayList.filter((_, i) => i !== franjaIndex);
            const next = { ...prev, [day]: nextDayList };
            if (typeof onChange === 'function') onChange(index, next);

            // si no quedan franjas y el padre provee setDias, eliminamos el día correspondiente
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
            if (typeof onChange === 'function') onChange(index, next);
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

                <button type="button" className="abmc-btn btn-primary " onClick={agregarFranja}>
                    Agregar franja Horaria
                </button>
            </div>
        </div>
    );
};

export default TurnoSection;