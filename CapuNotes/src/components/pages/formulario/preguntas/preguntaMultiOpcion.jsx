import { useState } from 'react';
import '@/styles/abmc.css'


const PreguntaMultiOpcion = ({ pregunta, handleChange }) => {

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
        </section>
    );
}

export default PreguntaMultiOpcion;