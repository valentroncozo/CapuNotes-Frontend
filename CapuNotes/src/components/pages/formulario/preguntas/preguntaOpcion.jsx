import { useState } from 'react';
import '@/styles/abmc.css'

const PreguntaOpcion = ({ pregunta, respuestas, handleChange }) => {

    const [respuesta, setRespuesta] = useState({
        "preguntaId": pregunta.id,
        "valorTexto": '',
        "opcionSeleccionadaId": null,
        "opcionesSeleccionadasIds": []
    });

    const onInputChange = (e) => {
        const nuevoValor = e.target.value;

        setRespuesta(prev => ({ ...prev, valorTexto: nuevoValor }));
        // notificar al padre con (preguntaId, valor)
        handleChange(pregunta.id, nuevoValor);
    }

    return (
        <section className='form-group-miembro'>
            <label>{pregunta.valor}</label>
            <select
                className='abmc-select'
                value={respuesta.opcionSeleccionadaId || ''}
                onChange={onInputChange}
                required={!!pregunta.obligatoria}
            >
                <option value="">Seleccione una opción</option>
                {pregunta.opciones.map(opcion => (
                    <option key={opcion.id} value={opcion.id}>
                        {opcion.valor}
                    </option>
                ))}
            </select>
            
        </section>
    );
}

export default PreguntaTexto;