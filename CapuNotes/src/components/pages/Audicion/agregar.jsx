
import '@/styles/audicion.css';
import '@/styles/audicion-agregar.css';
import getDateRangeDates, { formatDDMMYYYY } from './components/utils/obtenerDias.js';
import BackButton from '../../common/BackButton';
import TurnoSection from './components/TurnoSection';
import { useState } from 'react';

const AudicionAgregar = ({title="Agregar Audición"}) => {
    const [diaDesde,setDiaDesde]= useState ('');
    const [diaHasta,setDiaHasta]= useState ('');
    const [dias, setDias]= useState ([]);

    const handlerObtenerDias = (e) => {
        e.preventDefault();
        setDias([]);
        // Lógica para obtener los días entre diaDesde y diaHasta
        // y actualizar el estado 'dias'
        const diasObtenidos = getDateRangeDates(diaDesde, diaHasta);
        setDias(diasObtenidos);
    };


    const handleAgregarDia = () => {
        // si no hay días, intentar tomar diaDesde si está definido
        if (!dias || dias.length === 0) {
            if (!diaDesde) {
                alert('No hay días en la lista. Generá fechas o completá "Fecha Desde" primero.');
                return;
            }
            const [y, m, d] = diaDesde.split('-');
            const first = new Date(Number(y), Number(m) - 1, Number(d));
            setDias([first]);
            // si diaHasta está vacío, sincronizamos diaHasta
            if (!diaHasta) {
                const yy = first.getFullYear();
                const mm = String(first.getMonth() + 1).padStart(2, '0');
                const dd = String(first.getDate()).padStart(2, '0');
                setDiaHasta(`${yy}-${mm}-${dd}`);
            }
            return;
        }

        // calcular el día siguiente al último
        const ultimo = dias[dias.length - 1];
        const siguiente = new Date(ultimo.getTime());
        siguiente.setDate(siguiente.getDate() + 1);

        // si hay diaHasta definido y el siguiente es mayor, actualizamos diaHasta
        if (diaHasta) {
            const [y2, m2, d2] = diaHasta.split('-');
            const limite = new Date(Number(y2), Number(m2) - 1, Number(d2));
            if (siguiente.getTime() > limite.getTime()) {
                const yy = siguiente.getFullYear();
                const mm = String(siguiente.getMonth() + 1).padStart(2, '0');
                const dd = String(siguiente.getDate()).padStart(2, '0');
                setDiaHasta(`${yy}-${mm}-${dd}`);
            }
        } else {
            const yy = siguiente.getFullYear();
            const mm = String(siguiente.getMonth() + 1).padStart(2, '0');
            const dd = String(siguiente.getDate()).padStart(2, '0');
            setDiaHasta(`${yy}-${mm}-${dd}`);
        }

        // evitar duplicados exactos por timestamp
        const existe = dias.some((dt) => dt.getTime() === siguiente.getTime());
        if (existe) {
            alert('La fecha ya existe en la lista.');
            return;
        }

        setDias((prev) => [...prev, siguiente]);
    };

  return (
    <main className='audicion-page'>
        
        <div className="abmc-card">
        <header className="abmc-header">
            <BackButton />
            <h1 className='abmc-title'>{title}</h1>
        </header>    

        <hr className='divider' />

        <section className="content-form-audicion">
            
            <form className="form-audicion" onSubmit={handlerObtenerDias}>
                <div className="form-group-miembro">
                    <label htmlFor="lugar">Lugar</label>
                    <input type="text" id="lugar" name="lugar" className='abmc-input' required />
                </div>

                <div className="content-inputs-date-audicion">
                    <div className='inputs-date-audicion'> 
                        <label htmlFor="fechaDesde">Fecha Desde</label>
                        <input
                            value={diaDesde}
                            onChange={(e) => setDiaDesde(e.target.value)}
                            type="date" 
                            id="fechaDesde" 
                            name="fechaDesde" 
                            className='abmc-input' 
                            required 
                        />
                    </div>
                    <div className='inputs-date-audicion'>
                        <label htmlFor="fechaHasta">Fecha Hasta</label>
                        <input 
                            value={diaHasta}
                            onChange={(e) => setDiaHasta(e.target.value)}
                            type="date" 
                            id="fechaHasta" 
                            name="fechaHasta" 
                            className='abmc-input' 
                            required 
                        />
                    </div>

                    <div className="button-date-audicion">
                        <button type="submit" 
                        className="abmc-btn btn-primary"
                        onClick={handlerObtenerDias}
                        >Agregar Fechas
                        </button>
                    </div>
                </div>
            </form>

            <hr className='divider'/>

            <section className="content-turno-input">    
                {   dias.length > 0 ? (
                    dias.map( (dia, index) => (
                        <TurnoSection 
                            key={index}
                            day={formatDDMMYYYY(dia)}
                            dias={dias}
                            setDias={setDias}
                        />
                    ))
                ) : (
                    <p>No hay días seleccionados.</p>
                )}
                
        <button type="button" className="abmc-btn btn-primary btn-dias" onClick={handleAgregarDia}>
            Agregar día
        </button>
            </section>
            
        </section>


        </div>

    </main>
    
    );
}
export default AudicionAgregar;