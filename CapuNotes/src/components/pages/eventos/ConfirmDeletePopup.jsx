import React from 'react';
import '@/styles/globals.css';
import '@/styles/eventos.css';

const ConfirmDeletePopup = ({ onClose, onConfirm }) => {
  return (
    <div className="popup-container">
      <header className="abmc-header">
        <div className="abmc-title">
          <h1>¿Estás seguro de eliminar este evento?</h1>
        </div>
      </header>
      <hr className="divisor-amarillo" />

      <div className="popup-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn-submit" onClick={onConfirm}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
