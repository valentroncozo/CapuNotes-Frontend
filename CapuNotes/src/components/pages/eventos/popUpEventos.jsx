import React from 'react';
import '@/styles/globals.css';
import '@/styles/popup.css';
const PopUpEventos = ({
  modo = 'crear',
  eventoSeleccionado,
  onClose,
  onSave,
  opcionesFecha = [],
  opcionesHora = [],
}) => {
  const isViewMode = modo === 'ver';

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que se recargue la página

    const formData = new FormData(e.target); // obtiene todos los valores del form
    const nuevoEvento = {
      nombre: formData.get('nombre'),
      tipoEvento: formData.get('tipoEvento'),
      fechaInicio: formData.get('fecha'),
      hora: formData.get('hora'),
      lugar: formData.get('lugar'),
    };

    onSave(nuevoEvento); // Llama al onSave con los datos del formulario
  };

  return (
    <div
      className="popup-container"
      style={{ overflow: 'auto', maxHeight: '95vh' }}
    >
      {' '}
      <header className="abmc-header">
        {' '}
        <div className="abmc-title">
          {' '}
          <h1>
            {' '}
            {modo === 'crear'
              ? 'Crear Evento'
              : modo === 'editar'
              ? 'Modificar Evento'
              : 'Visualizar Evento'}{' '}
          </h1>{' '}
        </div>{' '}
      </header>{' '}
      <hr className="divisor-amarillo" />{' '}
      <form className="popup-form" onSubmit={handleSubmit}>
        {' '}
        <div className="popup-grid">
          {' '}
          <div className="field">
            {' '}
            <label>Nombre</label>{' '}
            <input
              type="text"
              name="nombre"
              defaultValue={eventoSeleccionado?.nombre || ''}
              disabled={isViewMode}
            />{' '}
          </div>{' '}
          <div className="field">
            <label>Tipo de evento</label>
            <select
              name="tipoEvento"
              disabled={isViewMode}
              defaultValue={eventoSeleccionado?.tipoEvento || ''}
            >
              <option value="">Seleccionar</option>
              <option value="ENSAYO">Ensayo</option>
              <option value="PRESENTACION">Presentación</option>
            </select>
          </div>
          <div className="field-inline">
            {' '}
            <div className="field">
              {' '}
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                defaultValue={eventoSeleccionado?.fecha || ''}
                disabled={modo !== 'crear' && modo !== 'editar'}
              />
            </div>{' '}
            <div className="field">
              {' '}
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                defaultValue={eventoSeleccionado?.hora || ''}
                disabled={modo !== 'crear' && modo !== 'editar'}
              />
            </div>{' '}
          </div>{' '}
          <div className="field">
            {' '}
            <label>Lugar</label>{' '}
            <input
              type="text"
              name="lugar"
              defaultValue={eventoSeleccionado?.lugar || ''}
              disabled={isViewMode}
            />{' '}
          </div>{' '}
        </div>{' '}
        <div className="popup-actions">
          {' '}
          <button type="button" className="btn-primary" onClick={onClose}>
            {' '}
            Cancelar{' '}
          </button>{' '}
          {!isViewMode && (
            <button type="submit" className="btn-primary">
              {' '}
              Aceptar{' '}
            </button>
          )}{' '}
        </div>{' '}
      </form>{' '}
    </div>
  );
};

export default PopUpEventos;
