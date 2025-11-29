import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal.jsx';
import '@/styles/globals.css';
import '@/styles/popup.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// =======================================================
//   Helpers para manejar fechas sin romper el timezone
// =======================================================
function parseIsoDate(isoString) {
  if (!isoString) return null;
  const [y, m, d] = isoString.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function formatDateToIsoLocal(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


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
      ? parseIsoDate(eventoSeleccionado.fechaInicio)
      : null
  );

  const [errorMsg, setErrorMsg] = useState('');
  const formId = 'evento-modal-form';

  // =============================
  //   Sincronizar con edición
  // =============================
  useEffect(() => {
    if (eventoSeleccionado?.fechaInicio) {
      setSelectedDate(parseIsoDate(eventoSeleccionado.fechaInicio));
    }
    else {
      setSelectedDate(null);
    }
    setErrorMsg('');
  }, [eventoSeleccionado, modo, isOpen]);

  // =============================
  //   Submit del formulario
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nombre = formData.get('nombre')?.trim() || '';
    const tipoEvento = formData.get('tipoEvento') || '';
    const horaRaw = formData.get('hora') || '';
    const lugar = formData.get('lugar')?.trim() || '';

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

    // 🔹 Asegurar formato HH:mm
    let hora = horaRaw;
    if (hora.length > 5) {
      hora = hora.slice(0, 5);
    }

    const nuevoEvento = {
      nombre,
      tipoEvento,
      fechaInicio: formatDateToIsoLocal(selectedDate),
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

  // =============================
  //   TÍTULO DEL POPUP
  // =============================
  const modalTitle =
    modo === 'crear'
      ? 'Crear Evento'
      : modo === 'editar'
        ? 'Modificar Evento'
        : 'Visualizar Evento';

  // =============================
  //   ACCIONES DEL POPUP
  // =============================
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

  // =============================
  //   RENDER
  // =============================
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      actions={modalActions}
      className="evento-abmc-modal"
    >
      {errorMsg && (
        <div className="evento-modal-error">
          {errorMsg}
        </div>
      )}

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
