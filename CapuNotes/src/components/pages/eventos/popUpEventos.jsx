import React, { useState } from 'react';
import '@/styles/popup.css';
import '@/styles/globals.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PopUpEventos = ({
  modo = 'crear',
  eventoSeleccionado,
  onClose,
  onSave,
}) => {
  const isViewMode = modo === 'ver';
  const [selectedDate, setSelectedDate] = useState(
    eventoSeleccionado?.fechaInicio
      ? new Date(eventoSeleccionado.fechaInicio)
      : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nuevoEvento = {
      nombre: formData.get('nombre'),
      tipoEvento: formData.get('tipoEvento'),
      fechaInicio: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      hora: formData.get('hora'),
      lugar: formData.get('lugar'),
    };

    onSave(nuevoEvento);
  };

  return (
    <div
      className="pop-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div
          className="popup-container"
          style={{ overflow: 'auto', maxHeight: '95vh' }}
        >
          <header className="pop-header">
            <div className="pop-title">
              <h1>
                {modo === 'crear'
                  ? 'Crear Evento'
                  : modo === 'editar'
                  ? 'Modificar Evento'
                  : 'Visualizar Evento'}
              </h1>
            </div>
          </header>
          <hr className="divisor-amarillo-eventos" />

          <form className="popup-form" onSubmit={handleSubmit}>
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
                <label>Tipo de evento</label>
                <select
                  name="tipoEvento"
                  defaultValue={eventoSeleccionado?.tipoEvento || ''}
                  disabled={isViewMode}
                >
                  <option value="">Seleccionar</option>
                  <option value="ENSAYO">Ensayo</option>
                  <option value="PRESENTACION">Presentación</option>
                </select>
              </div>

              <div className="field-inline">
                <div className="field">
                  <label>Fecha</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/aaaa"
                    showPopperArrow={false}
                    disabled={isViewMode}
                  />
                </div>

                <div className="field">
                  <label>Hora</label>
                  <input
                    type="time"
                    name="hora"
                    step="60" /* Limita el input a horas y minutos */
                    defaultValue={eventoSeleccionado?.hora?.slice(0, 5) || ''}
                    disabled={isViewMode}
                  />
                </div>
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
            </div>

            <div className="popup-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              {!isViewMode && (
                <button type="submit" className="btn-primary">
                  Agregar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUpEventos;
