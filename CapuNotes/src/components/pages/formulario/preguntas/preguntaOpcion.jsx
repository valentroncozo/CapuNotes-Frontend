import { useState } from 'react';
import '@/styles/abmc.css'

const PreguntaOpcion = ({ pregunta, respuestas, handleChange }) => {

    const [respuesta, setRespuesta] = useState({
        "preguntaId": pregunta.id,
        "valorTexto": '',
        "opcionSeleccionadaId": null,
        "opcionesSeleccionadasIds": []
    });

    // onInputChange
    const onInputChange = (e) => {
        const value = e.target.value;                          
        const opcionId = value === '' ? null : Number(value); 

        const newRespuesta = {
            ...respuesta,
            opcionSeleccionadaId: opcionId,
        };

        setRespuesta(newRespuesta);
        handleChange(pregunta.id, newRespuesta); 
    };
    
    return (
        <section className='form-group-miembro'>
            <label>{pregunta.valor}</label>
            <select
                className='abmc-select'
                value={respuesta.opcionSeleccionadaId != null ? String(respuesta.opcionSeleccionadaId) : ''}
                onChange={onInputChange}
                required={!!pregunta.obligatoria}
            >
                <option value="">Seleccione una opción</option>
                {pregunta.opciones.map(opcion => (
                    <option key={opcion.id} value={String(opcion.id)}>
                        {opcion.texto}
                    </option>
                ))}
            </select>
            
        </section>
    );
}

export default PreguntaOpcion;