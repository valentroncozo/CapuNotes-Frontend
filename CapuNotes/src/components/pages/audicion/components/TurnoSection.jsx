import { useEffect, useState } from 'react';
import DayTitle from './DayTittle';
import Swal from 'sweetalert2';
import HorarioInputs from './HorarioInputs';
import '@/styles/turnos.css';

const crearFranjaVacia = (overrides = {}) => ({
    horaDesde: '',
    horaHasta: '',
    duracion: '',
    esOriginal: false,
    ...overrides,
});


const TurnoSection = ({ index, day, dias, setDias, data = { dias: {} }, setData, esPublicada = false }) => {
    const key = day;
    const franjas = (data.dias && data.dias[key]) ? data.dias[key] : [crearFranjaVacia()];

    const setFranjas = (nextFranjas) => {
        if (typeof setData === 'function') {
            setData(prev => {
                const prevObj = prev || { ubicacion: '', fechaDesde: '', fechaHasta: '', dias: {} };
                const prevDias = { ...(prevObj.dias || {}) };

                if (!nextFranjas || nextFranjas.length === 0) {
                    if (prevDias.hasOwnProperty(key)) delete prevDias[key];
                } else {
                    prevDias[key] = nextFranjas;
                }

                return {
                    ...prevObj,
                    dias: prevDias
                };
            });
        }
    };

    const agregarFranja = () => {
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
        setFranjas([...(franjas || []), crearFranjaVacia()]);
    };

    const eliminarFranja = (franjaIndex) => {
        const franjaObjetivo = franjas[franjaIndex];
        const esFranjaOriginal = Boolean(franjaObjetivo?.esOriginal);

        if (esPublicada && esFranjaOriginal) {
            Swal.fire({
                icon: 'info',
                title: 'Audición publicada',
                text: 'No podés eliminar franjas originales cuando la audición ya está publicada.',
                background: '#11103a',
                color: '#E8EAED'
            });
            return;
        }

        const nextFranjas = franjas.filter((_, i) => i !== franjaIndex);
        setFranjas(nextFranjas);

        if (nextFranjas.length === 0 && typeof setDias === 'function' && Array.isArray(dias)) {
            setDias(prevDias => prevDias.filter((_, diaIdx) => diaIdx !== index));
        }
    };

    const actualizarFranja = (franjaIndex, nuevoValor) => {
        setFranjas(franjas.map((f, i) => (i === franjaIndex ? { ...f, ...nuevoValor } : f)));
    };

    return (
        <div className="turno-input">
            <div className="content-horarios">
                <DayTitle title={day} />
            </div>

            <form className="content-horarios">
                {franjas.map((f, i) => (
                    <HorarioInputs
                        key={i}
                        index={i}
                        value={f}
                        onChange={actualizarFranja}
                        onRemove={eliminarFranja}
                        allowRemove={!esPublicada || !Boolean(f?.esOriginal)}
                    />
                ))}

                <button type="button" className="abmc-btn btn-primary" onClick={agregarFranja}>
                    Agregar franja Horaria
                </button>
            </form>
        </div>
    );
};

export default TurnoSection;