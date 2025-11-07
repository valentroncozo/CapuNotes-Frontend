import { useState, useEffect } from 'react';
import '@/styles/abmc.css';

const PreguntaOpcion = ({ pregunta, res = null, handleChange, disabled = false }) => {
  // estado local solo para modo edición
  const [respuesta, setRespuesta] = useState({
    preguntaId: pregunta.id,
    opcionSeleccionadaId: res?.opcionSeleccionadaId ?? null
  });

  // sincroniza solo si res viene definido (evita sobrescribir con null cuando la carga async aún no terminó)
  useEffect(() => {
    if (typeof res !== 'undefined' && res !== null) {
      setRespuesta({
        preguntaId: pregunta.id,
        opcionSeleccionadaId: res?.opcionSeleccionadaId ?? null
      });
    }
  }, [res, pregunta.id]);

  // si estamos en modo consulta, no usar estado local (evita parpadeos). Mostrar directamente res.
  const selectedForRender = disabled ? (res?.opcionSeleccionadaId ?? '') : (respuesta.opcionSeleccionadaId != null ? respuesta.opcionSeleccionadaId : '');

  const onChange = (e) => {
    if (disabled) return;
    const raw = e.target.value;
    const opcionId = raw === '' ? null : (isFinite(Number(raw)) ? Number(raw) : raw);
    const nuevo = { ...respuesta, opcionSeleccionadaId: opcionId };
    setRespuesta(nuevo);
    handleChange && handleChange(pregunta.id, nuevo);
  };

  return (
    <section className='form-group-miembro'>
      <label>{pregunta.valor}{pregunta.obligatoria && <span style={{color:'var(--accent)'}}>*</span>}</label>
      <select
        className='abmc-select'
        value={selectedForRender === null ? '' : String(selectedForRender)}
        onChange={onChange}
        disabled={disabled}
        aria-readonly={disabled}
      >
        <option value="">-</option>
        {(pregunta.opciones || []).map(op => {
          const id = op.id ?? op.valor ?? op.texto ?? String(op);
          return <option key={String(id)} value={String(id)}>{op.texto ?? op.valor ?? String(op)}</option>;
        })}
      </select>
    </section>
  );
};

export default PreguntaOpcion;