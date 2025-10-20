import { useEffect, useState } from 'react';
import DayTitle from './DayTittle';
import HorarioInputs from './HorarioInputs';
import '@/styles/turnos.css';

const TurnoSection = ({ index, day, dias, setDias, data = { dias: {} }, setData }) => {
    const key = day;
    const initial = (data.dias && data.dias[key]) ? data.dias[key] : [{ horaDesde: '', horaHasta: '', duracion: '' }];

    const [franjas, setFranjas] = useState(initial);

    // Sincronizar con cambios externos en data
    useEffect(() => {   
        const external = (data.dias && data.dias[key]) ? data.dias[key] : [];
        if (external.length > 0) {
            setFranjas(external);
        }
    }, [data, key]);

    // Cuando cambia el state local, actualizar data.dias en el padre
    useEffect(() => {
        if (typeof setData === 'function') {
            setData(prev => {
                const prevObj = prev || { ubicacion: '', fechaDesde: '', fechaHasta: '', dias: {} };
                return {
                    ...prevObj,
                    dias: {
                        ...(prevObj.dias || {}),
                        [key]: franjas
                    }
                };
            });
        }
    }, [franjas, key, setData]);

    const agregarFranja = () => {
        setFranjas(prev => [...prev, { horaDesde: '', horaHasta: '', duracion: '' }]);
    };

    const eliminarFranja = (franjaIndex) => {
        const nextFranjas = franjas.filter((_, i) => i !== franjaIndex);
        setFranjas(nextFranjas);

        // Si no quedan franjas, eliminar el día
        if (nextFranjas.length === 0 && typeof setDias === 'function' && Array.isArray(dias)) {
            setDias(prevDias => prevDias.filter((_, diaIdx) => diaIdx !== index));
        }
    };

    const actualizarFranja = (franjaIndex, nuevoValor) => {
        setFranjas(prev => prev.map((f, i) => (i === franjaIndex ? { ...f, ...nuevoValor } : f)));
    };

    return (
        <div className="turno-input">
            <div className="content-horarios">
                <DayTitle title={day} />
            </div>

            <div className="content-horarios">
                {franjas.map((f, i) => (
                    <HorarioInputs key={i} index={i} value={f} onChange={actualizarFranja} onRemove={eliminarFranja} />
                ))}

                <button type="button" className="abmc-btn btn-primary" onClick={agregarFranja}>
                    Agregar franja Horaria
                </button>
            </div>
        </div>
    );
};

export default TurnoSection;