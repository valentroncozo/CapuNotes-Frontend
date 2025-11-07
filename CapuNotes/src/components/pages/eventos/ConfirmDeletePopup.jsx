import React from 'react';
import Swal from 'sweetalert2';
import '@/styles/globals.css';
import '@/styles/popup.css';
import { eventosService } from '@/services/eventosService.js';

const ConfirmDeletePopup = ({ evento, onClose, onDeleted }) => {
  // 🔹 Manejar eliminación
  const handleConfirm = async () => {
    console.log('🧩 Evento recibido en popup:', evento);
    try {
      await eventosService.eliminarEvento(evento.id, evento.tipoEvento);

      Swal.fire({
        icon: 'success',
        title: 'Evento cancelado',
        text: `El evento "${
          evento.nombre || evento.titulo || 'sin nombre'
        }" fue cancelado correctamente.`,
        timer: 1600,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });

      onDeleted?.(evento.id); // 🔸 callback para actualizar la lista
      onClose(); // 🔸 cerrar popup
    } catch (error) {
      console.error('❌ Error al cancelar evento:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar el evento.',
        background: '#11103a',
        color: '#E8EAED',
      });
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <header className="abmc-header">
          <div className="abmc-title">
            <h1>¿Estás seguro de cancelar este evento?</h1>
          </div>
        </header>
        <hr className="divisor-amarillo" />

        <div className="popup-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={handleConfirm}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
