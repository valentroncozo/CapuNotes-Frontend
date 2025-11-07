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
      <form className="popup-form">
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
            {' '}
            <label>Tipo de evento</label>{' '}
            <select
              name="tipoEvento"
              defaultValue={eventoSeleccionado?.tipoEvento || ''}
              disabled={isViewMode}
            >
              <option value="">Seleccionar</option>
              <option value="presentacion">PRESENTACIÓN</option>
              <option value="ensayo">ENSAYO</option>
            </select>{' '}
          </div>{' '}
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
            <button
              type="submit"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault(); // Evita el comportamiento predeterminado del formulario
                onSave(); // Llama a la función onSave
              }}
            >
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
