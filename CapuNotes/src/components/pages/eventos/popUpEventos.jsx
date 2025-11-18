import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal.jsx';
import '@/styles/globals.css';
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
  const [errorMsg, setErrorMsg] = useState('');
  const formId = 'evento-modal-form';

  useEffect(() => {
    if (eventoSeleccionado?.fechaInicio) {
      setSelectedDate(new Date(eventoSeleccionado.fechaInicio));
    } else {
      setSelectedDate(null);
    }
    setErrorMsg('');
  }, [eventoSeleccionado, modo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nombre = formData.get('nombre')?.trim() || '';
    const tipoEvento = formData.get('tipoEvento') || '';
    const horaRaw = formData.get('hora') || '';
    const lugar = formData.get('lugar')?.trim() || '';

    onSave(nuevoEvento);
    const missing = [];
    if (!nombre) missing.push('Nombre');
    if (!tipoEvento) missing.push('Tipo de evento');
    if (!selectedDate) missing.push('Fecha');
    if (!horaRaw) missing.push('Hora');
    if (!lugar) missing.push('Lugar');

    if (missing.length) {
      setErrorMsg(`Completá los campos requeridos: ${missing.join(', ')}`);
      return;
    }

    if (Number.isNaN(selectedDate.getTime())) {
      setErrorMsg('Seleccioná una fecha válida.');
      return;
    }

    let hora = horaRaw;
    if (hora?.length === 5) {
      hora += ':00';
    }

    const nuevoEvento = {
      nombre,
      tipoEvento,
      fechaInicio: selectedDate.toISOString().split('T')[0],
      hora,
      lugar,
    };

    setErrorMsg('');
    try {
      const res = await onSave?.(nuevoEvento);
      if (res && res.errorMessage) {
        setErrorMsg(res.errorMessage);
      }
    } catch (error) {
      console.error('❌ Error al guardar evento desde popup:', error);
      setErrorMsg('No pudimos guardar el evento. Intentá nuevamente.');
    }
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
                  ? 'Agregar evento'
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
