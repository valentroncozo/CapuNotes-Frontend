import { useState, useEffect } from 'react';
import '@/styles/abmc.css';

const PreguntaTexto = ({ pregunta, res = null, handleChange, disabled = false }) => {
  const [respuesta, setRespuesta] = useState({
    preguntaId: pregunta.id,
    valorTexto: res?.valorTexto ?? '',
    opcionSeleccionadaId: res?.opcionSeleccionadaId ?? null,
    opcionesSeleccionadasIds: Array.isArray(res?.opcionesSeleccionadasIds) ? res.opcionesSeleccionadasIds : []
  });

  // sincronizar si res cambia (modo consulta / carga inicial)
  useEffect(() => {
    setRespuesta({
      preguntaId: pregunta.id,
      valorTexto: res?.valorTexto ?? '',
      opcionSeleccionadaId: res?.opcionSeleccionadaId ?? null,
      opcionesSeleccionadasIds: Array.isArray(res?.opcionesSeleccionadasIds) ? res.opcionesSeleccionadasIds : []
    });
  }, [res, pregunta.id]);

  const onChange = (e) => {
    if (disabled) return;
    const nuevo = { ...respuesta, valorTexto: e.target.value };
    setRespuesta(nuevo);
    handleChange && handleChange(pregunta.id, nuevo);
  };

  return (
    <section className='form-group-miembro'>
      <label>{pregunta.valor}{pregunta.obligatoria && <span style={{color:'var(--accent)'}}>*</span>}</label>
      <input
        type="text"
        className='abmc-input'
        value={respuesta.valorTexto ?? ''}
        onChange={onChange}
        disabled={disabled}
        readOnly={disabled}
      />
    </section>
  );
};

export default PreguntaTexto;