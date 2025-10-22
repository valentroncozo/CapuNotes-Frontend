import { useEffect, useState } from 'react';
import DayTitle from './DayTittle';
import Swal from 'sweetalert2';
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
                const prevDias = { ...(prevObj.dias || {}) };

                if (!franjas || franjas.length === 0) {
                    // eliminar la clave del día si no quedan franjas
                    if (prevDias.hasOwnProperty(key)) delete prevDias[key];
                } else {
                    prevDias[key] = franjas;
                }

                return {
                    ...prevObj,
                    dias: prevDias
                };
            });
        }
    }, [franjas, key, setData]);

    const agregarFranja = () => {
        // validar que no haya franjas incompletas antes de agregar
        const incomplete = (franjas || []).some(f => !f || !f.horaDesde || !f.horaHasta || !f.duracion);
        if (incomplete) {
             Swal.fire({
                      icon: "error",
                      title: "Error al cargar datos",
                      text: "Completá todos los campos de la franja actual antes de agregar otra.",
                      background: "#11103a",
                      color: "#E8EAED",
                    });
            return;
        }

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

            <form className="content-horarios">
                {franjas.map((f, i) => (
                    <HorarioInputs key={i} index={i} value={f} onChange={actualizarFranja} onRemove={eliminarFranja} />
                ))}

                <button type="button" className="abmc-btn btn-primary" onClick={agregarFranja}>
                    Agregar franja Horaria
                </button>
            </form>
        </div>
    );
};

export default TurnoSection;