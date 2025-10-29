import { useState } from 'react';
import '@/styles/abmc.css'


const PreguntaMultiOpcion = ({ pregunta, handleChange }) => {

    // 1. Estado Local para las respuestas (Inicializa el array vacío)
    const [respuesta, setRespuesta] = useState({
        "preguntaId": pregunta.id,
        "valorTexto": '',
        "opcionSeleccionadaId": null,
        "opcionesSeleccionadasIds": [] // <-- Usaremos este array
    });

    // 2. Función para manejar el cambio en los checkboxes
    const onCheckboxChange = (opcionId, isChecked) => {
        let nuevasOpcionesSeleccionadas;
        
        // El array actual de IDs seleccionadas
        const currentSelections = respuesta.opcionesSeleccionadasIds;

        if (isChecked) {
            // Si se marca: Agregar la ID al array (si no existe)
            if (!currentSelections.includes(opcionId)) {
                nuevasOpcionesSeleccionadas = [...currentSelections, opcionId];
            } else {
                nuevasOpcionesSeleccionadas = currentSelections;
            }
        } else {
            // Si se desmarca: Eliminar la ID del array
            nuevasOpcionesSeleccionadas = currentSelections.filter(id => id !== opcionId);
        }

        const newRespuesta = {
            ...respuesta,
            opcionesSeleccionadasIds: nuevasOpcionesSeleccionadas,
        };

        // 3. Actualiza el estado local y notifica al padre
        setRespuesta(newRespuesta);
        handleChange(pregunta.id, newRespuesta); 
    };
    
    return (
        <section className='form-group-c'>
            <label>{pregunta.valor} {pregunta.obligatoria && <span style={{color: 'var(--accent)'}}>*</span>}</label>

            {/* 4. Mapeo de opciones para renderizar checkboxes */}
            <div className='checkbox-group'>
                {pregunta.opciones.map(opcion => {
                    // Verificar si esta opción está actualmente seleccionada
                    const isChecked = respuesta.opcionesSeleccionadasIds.includes(opcion.id);

                    return (
                        <div key={opcion.id} className='checkbox-item'>
                            <input
                                type="checkbox"
                                id={`opcion-${opcion.id}`}
                                value={opcion.id}
                                checked={isChecked} // <-- Prop checked conectada al estado
                                onChange={(e) => onCheckboxChange(opcion.id, e.target.checked)}
                            />
                            <label htmlFor={`opcion-${opcion.id}`}>
                                {opcion.texto}
                            </label>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default PreguntaMultiOpcion;