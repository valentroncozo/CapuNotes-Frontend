import { useState, useEffect } from 'react';
import '@/styles/abmc.css';

const PreguntaMultiOpcion = ({ pregunta, res = null, handleChange, disabled = false }) => {
  const [respuesta, setRespuesta] = useState({
    preguntaId: pregunta.id,
    valorTexto: '',
    opcionSeleccionadaId: null,
    opcionesSeleccionadasIds: Array.isArray(res?.opcionesSeleccionadasIds) ? res.opcionesSeleccionadasIds : []
  });

  useEffect(() => {
    setRespuesta({
      preguntaId: pregunta.id,
      valorTexto: '',
      opcionSeleccionadaId: null,
      opcionesSeleccionadasIds: Array.isArray(res?.opcionesSeleccionadasIds) ? res.opcionesSeleccionadasIds : []
    });
  }, [res, pregunta.id]);

  const onCheckboxChange = (opcionId, isChecked) => {
    if (disabled) return;
    const current = Array.isArray(respuesta.opcionesSeleccionadasIds) ? respuesta.opcionesSeleccionadasIds : [];
    const next = isChecked ? Array.from(new Set([...current, opcionId])) : current.filter(x => String(x) !== String(opcionId));
    const nuevo = { ...respuesta, opcionesSeleccionadasIds: next };
    setRespuesta(nuevo);
    handleChange && handleChange(pregunta.id, nuevo);
  };

  const selectedIds = (respuesta.opcionesSeleccionadasIds || []).map(String);

  return (
    <section className='form-group-c'>
      <label>{pregunta.valor}{pregunta.obligatoria && <span style={{color:'var(--accent)'}}>*</span>}</label>
      <div className='checkbox-group'>
        {(pregunta.opciones || []).map(op => {
          const id = op.id ?? op.valor ?? op.texto ?? String(op);
          const checked = selectedIds.includes(String(id));
          return (
            <div key={String(id)} className='checkbox-item'>
              <input
                type="checkbox"
                id={`opcion-${String(id)}`}
                value={String(id)}
                checked={checked}
                onChange={(e) => onCheckboxChange(isFinite(Number(id)) ? Number(id) : id, e.target.checked)}
                disabled={disabled}
                aria-readonly={disabled}
              />
              <label htmlFor={`opcion-${String(id)}`}>{op.texto ?? op.valor ?? String(op)}</label>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PreguntaMultiOpcion;