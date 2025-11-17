import React, { useState } from 'react';
import Modal from '@/components/common/Modal.jsx';
import '@/styles/globals.css';
import '@/styles/popup.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PopUpEventos = ({
  modo = 'crear',
  eventoSeleccionado,
  onClose,
  onSave,
  isOpen = true,
}) => {
  const isViewMode = modo === 'ver';
  const [selectedDate, setSelectedDate] = useState(
    eventoSeleccionado?.fechaInicio
      ? new Date(eventoSeleccionado.fechaInicio)
      : null
  );
  const formId = 'evento-modal-form';

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

    // Normalizar hora (añadir :00 si falta)
    if (nuevoEvento.hora?.length === 5) {
      nuevoEvento.hora += ':00';
    }

    onSave(nuevoEvento);
  };

  const modalTitle =
    modo === 'crear'
      ? 'Crear Evento'
      : modo === 'editar'
      ? 'Modificar Evento'
      : 'Visualizar Evento';

  const modalActions = isViewMode ? (
    <button type="button" className="btn btn-primary" onClick={onClose}>
      Cerrar
    </button>
  ) : (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancelar
      </button>
      <button type="submit" form={formId} className="btn btn-primary">
        Aceptar
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      actions={modalActions}
      className="evento-abmc-modal"
    >
      <form id={formId} className="evento-modal-form" onSubmit={handleSubmit}>
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
                defaultValue={eventoSeleccionado?.hora || ''}
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
      </form>
    </Modal>
  );
};

export default PopUpEventos;
