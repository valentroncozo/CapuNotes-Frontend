import '@/styles/audicion.css';
import '@/styles/audicion-agregar.css';
import getDateRangeDates, { formatDDMMYYYY } from './components/utils/obtenerDias.js';
import BackButton from '../../common/BackButton';
import TurnoSection from './components/TurnoSection';
import { useState } from 'react';

const AudicionAgregar = ({title="Agregar Audición"}) => {
    const [diaDesde,setDiaDesde]= useState ('');
    const [diaHasta,setDiaHasta]= useState ('');
    const [descripcion,setDescripcion]= useState ('');
    const [nombre,setNombre]= useState ('');
    const [ubicacion,setUbicacion]= useState ('');
    const [dias, setDias]= useState ([]);

    // Estado 'data' con estructura: { ubicacion, fechaDesde, fechaHasta, dias: { "DD/MM/YYYY": [ { horaDesde, horaHasta, duracion } ] } }
    const [data, setData]= useState ({ ubicacion: '', fechaDesde: '', fechaHasta: '', dias: {} });

    
    const handlerCancelar = () => {
        setDiaDesde('');
        setDiaHasta('');
        setUbicacion('');
        setDias([]);
        setData({ ubicacion: '', fechaDesde: '', fechaHasta: '', dias: {} });
    };


    const handlerObtenerDias = (e) => {
        e.preventDefault();
        setDias([]);
        const diasObtenidos = getDateRangeDates(diaDesde, diaHasta);
        setDias(diasObtenidos);
        
        // Sincronizar fechas en data
        setData(prev => ({
            ...prev,
            fechaDesde: diaDesde ? formatDDMMYYYY(new Date(diaDesde)) : '',
            fechaHasta: diaHasta ? formatDDMMYYYY(new Date(diaHasta)) : ''
        }));
    };


    const handleAgregarDia = () => {
        if (!dias || dias.length === 0) {
            if (!diaDesde) {
                alert('No hay días en la lista. Generá fechas o completá "Fecha Desde" primero.');
                return;
            }
            const [y, m, d] = diaDesde.split('-');
            const first = new Date(Number(y), Number(m) - 1, Number(d));
            setDias([first]);
            if (!diaHasta) {
                const yy = first.getFullYear();
                const mm = String(first.getMonth() + 1).padStart(2, '0');
                const dd = String(first.getDate()).padStart(2, '0');
                setDiaHasta(`${yy}-${mm}-${dd}`);
                setData(prev => ({ 
                    ...prev, 
                    fechaDesde: formatDDMMYYYY(first), 
                    fechaHasta: formatDDMMYYYY(first) 
                }));
            }
            return;
        }

        const ultimo = dias[dias.length - 1];
        const siguiente = new Date(ultimo.getTime());
        siguiente.setDate(siguiente.getDate() + 1);

        if (diaHasta) {
            const [y2, m2, d2] = diaHasta.split('-');
            const limite = new Date(Number(y2), Number(m2) - 1, Number(d2));
            if (siguiente.getTime() > limite.getTime()) {
                const yy = siguiente.getFullYear();
                const mm = String(siguiente.getMonth() + 1).padStart(2, '0');
                const dd = String(siguiente.getDate()).padStart(2, '0');
                setDiaHasta(`${yy}-${mm}-${dd}`);
                setData(prev => ({ 
                    ...prev, 
                    fechaHasta: formatDDMMYYYY(siguiente) 
                }));
            }
        } else {
            const yy = siguiente.getFullYear();
            const mm = String(siguiente.getMonth() + 1).padStart(2, '0');
            const dd = String(siguiente.getDate()).padStart(2, '0');
            setDiaHasta(`${yy}-${mm}-${dd}`);
            setData(prev => ({ 
                ...prev, 
                fechaHasta: formatDDMMYYYY(siguiente) 
            }));
        }

        const existe = dias.some((dt) => dt.getTime() === siguiente.getTime());
        if (existe) {
            alert('La fecha ya existe en la lista.');
            return;
        }

        setDias((prev) => [...prev, siguiente]);
    };

    const handleGuardarBorrador = () => {
        console.log('Datos guardados en estado data:', data);
        alert('Datos guardados en el estado');
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
                    <input type="text" 
                    id="lugar" 
                    name="lugar" 
                    className='abmc-input' 
                    value={ubicacion}
                    onChange={(e) => { 
                        setUbicacion(e.target.value); 
                        setData(prev => ({ ...prev, ubicacion: e.target.value })); 
                    }}
                    required />
                </div>
                <div className='content-inputs-date-audicion'>
                    <div className="form-group-miembro">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" 
                        id="nombre" 
                        name="nombre" 
                        className='abmc-input' 
                        value={nombre}
                        onChange={(e) => { 
                            setNombre(e.target.value);
                            setData(prev => ({ ...prev, nombre: e.target.value })); 
                        }}
                        required />
                    </div>
                    <div className="form-group-miembro">
                        <label htmlFor="descripcion">Descripción</label>
                        <input 
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            className='abmc-input'
                            value={descripcion}
                            onChange={(e) => {
                                setDescripcion(e.target.value);
                                setData(prev => ({ ...prev, descripcion: e.target.value }));
                            }}
                            required
                        />
                    </div>




                </div>



                <div className="content-inputs-date-audicion">
                    <div className='inputs-date-audicion'> 
                        <label htmlFor="fechaDesde">Fecha Desde</label>
                        <input
                            value={diaDesde}
                            onChange={(e) => { 
                                setDiaDesde(e.target.value); 
                                setData(prev => ({ 
                                    ...prev, 
                                    fechaDesde: e.target.value ? formatDDMMYYYY(new Date(e.target.value)) : '' 
                                })); 
                            }}
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
                            onChange={(e) => { 
                                setDiaHasta(e.target.value); 
                                setData(prev => ({ 
                                    ...prev, 
                                    fechaHasta: e.target.value ? formatDDMMYYYY(new Date(e.target.value)) : '' 
                                })); 
                            }}
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
                            index={index}
                            day={formatDDMMYYYY(dia)}
                            dias={dias}
                            setDias={setDias}
                            data={data}
                            setData={setData}
                        />
                    ))
                ) : (
                    <p>No hay días seleccionados.</p>
                )}
                
        <button type="button" className="abmc-btn btn-primary btn-dias" onClick={handleAgregarDia}>
            Agregar día
        </button>
            </section>

            <section className='abmc-topbar'>
                <button type="button" className="abmc-btn btn-secondary btn-dias" onClick={handlerCancelar}>
                    Cancelar
                </button>
                <button type="button" className="abmc-btn btn-primary btn-dias" onClick={handleGuardarBorrador}>
                    Guardar Borrador
                </button>

            </section>
            
        </section>


        </div>

    </main>
    
    );
}
export default AudicionAgregar;