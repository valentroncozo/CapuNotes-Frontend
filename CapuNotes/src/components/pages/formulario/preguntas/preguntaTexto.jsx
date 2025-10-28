import { useState } from 'react';
import '@/styles/abmc.css'

const PreguntaTexto = ({ pregunta, handleChange }) => {

    const [respuesta, setRespuesta] = useState({
        "preguntaId": pregunta.id,
        "valorTexto": '',
        "opcionSeleccionadaId": null,
        "opcionesSeleccionadasIds": []
    });

    const AgregarRespuesta = (e) => {
        const nuevoValor = e.target.value;

        setRespuesta(prev => ({ ...prev, valorTexto: nuevoValor }));
        // notificar al padre con (preguntaId, valor)
        handleChange(pregunta.id, nuevoValor);
    }

    return (
        <section className='form-group-miembro'>
            <label>{pregunta.valor}</label>
            <input
                type="text"
                className='abmc-input'
                value={respuesta.valorTexto || ''}
                onChange={AgregarRespuesta}
                required={!!pregunta.obligatoria}
            />
        </section>
    );
}

export default PreguntaTexto;