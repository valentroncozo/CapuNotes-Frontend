import React, { useState, useEffect } from 'react';
import './formulario-inscripcion.css'; // Usa el mismo CSS del formulario

const PopUpEventos = ({
  modo = 'crear',
  eventoSeleccionado,
  onClose,
  onSave,
}) => {
  const [evento, setEvento] = useState({
    nombre: '',
    lugar: '',
    fecha: '',
    hora: '',
    tipoEvento: '',
  });

  // Si se pasa un evento (para editar o ver), cargamos los datos
  useEffect(() => {
    if (eventoSeleccionado) setEvento(eventoSeleccionado);
  }, [eventoSeleccionado]);

  // Si el modo es "ver", no se pueden editar los campos
  const soloLectura = modo === 'ver';

  // Cambia el título según el modo
  const titulo =
    modo === 'crear'
      ? 'Agregar evento'
      : modo === 'editar'
      ? 'Modificar evento'
      : 'Visualizar evento';

  const handleChange = (e) => {
    if (soloLectura) return; // No permitir cambios en modo visualización
    const { name, value } = e.target;
    setEvento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(evento, modo);
  };

  return (
    <div className="formulario-container">
      <div className="formulario popup-evento">
        {/* Título y línea divisora */}
        <h2 className="formulario-titulo">{titulo}</h2>
        <div className="linea-divisoria"></div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={evento.nombre}
                onChange={handleChange}
                required
                readOnly={soloLectura}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lugar">Lugar</label>
              <input
                type="text"
                id="lugar"
                name="lugar"
                value={evento.lugar}
                onChange={handleChange}
                required
                readOnly={soloLectura}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={evento.fecha}
                onChange={handleChange}
                required
                readOnly={soloLectura}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={evento.hora}
                onChange={handleChange}
                required
                readOnly={soloLectura}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoEvento">Tipo de evento</label>
              <select
                id="tipoEvento"
                name="tipoEvento"
                value={evento.tipoEvento}
                onChange={handleChange}
                disabled={soloLectura}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Audición">Audición</option>
                <option value="Concierto">Concierto</option>
                <option value="Ensayo">Ensayo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Botones al final */}
          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>

            {modo !== 'ver' && (
              <button type="submit" className="btn-guardar">
                Aceptar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUpEventos;
