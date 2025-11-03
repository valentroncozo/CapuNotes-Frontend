import React from 'react';
import '@/styles/globals.css';
import '@/styles/eventos.css';

const PopUpEventos = ({
  modo = 'crear',
  eventoSeleccionado,
  onClose,
  onSave,
}) => {
  const isViewMode = modo === 'ver';

  return (
    <div
      className="popup-container"
      style={{ overflow: 'auto', maxHeight: '95vh' }}
    >
      <header className="abmc-header">
        <div className="abmc-title">
          <h1>
            {modo === 'crear'
              ? 'Crear Evento'
              : modo === 'editar'
              ? 'Modificar Evento'
              : 'Visualizar Evento'}
          </h1>
        </div>
      </header>
      <hr className="divisor-amarillo" />

      <form className="popup-form">
        <div className="popup-grid">
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              defaultValue={eventoSeleccionado?.nombre || ''}
              disabled={isViewMode}
            />
          </div>

          <div className="field">
            <label>Lugar</label>
            <input
              type="text"
              name="lugar"
              defaultValue={eventoSeleccionado?.lugar || ''}
              disabled={isViewMode}
            />
          </div>

          <div className="field">
            <label>Fecha</label>
            <select name="fecha" disabled={isViewMode}>
              <option value="">Elegir</option>
              {/* Opciones dinámicas */}
            </select>
          </div>

          <div className="field">
            <label>Hora</label>
            <select name="hora" disabled={isViewMode}>
              <option value="">--:--</option>
              {/* Opciones dinámicas */}
            </select>
          </div>

          <div className="field">
            <label>Tipo de evento</label>
            <select name="tipoEvento" disabled={isViewMode}>
              <option value="">Seleccionar</option>
              {/* Opciones dinámicas */}
            </select>
          </div>
        </div>

        <div className="popup-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          {!isViewMode && (
            <button type="submit" className="btn-submit" onClick={onSave}>
              Aceptar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PopUpEventos;
