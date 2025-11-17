import React from "react";
import Swal from "sweetalert2";
import "@/styles/globals.css";
import "@/styles/popup.css";
import { eventoService } from "@/services/eventoService.js"; // 👈 corregido

const ConfirmDeletePopup = ({ evento, onClose, onDeleted }) => {
  // Al montarse, mostramos SweetAlert en lugar de un popup manual
  React.useEffect(() => {
    let mounted = true;

    const doConfirm = async () => {
      const res = await Swal.fire({
        title: `¿Cancelar evento "${evento?.nombre || 'sin nombre'}"?`,
        text: 'Esta acción cancelará el evento y no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DE9205',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        background: '#11103a',
        color: '#E8EAED',
      });

      if (!mounted) return;

      if (!res.isConfirmed) {
        onClose?.();
        return;
      }

      try {
        await eventoService.remove(evento.id, evento.tipoEvento);

        await Swal.fire({
          icon: 'success',
          title: 'Evento cancelado',
          text: `El evento "${evento?.nombre || 'sin nombre'}" fue cancelado correctamente.`,
          timer: 1400,
          showConfirmButton: false,
          background: '#11103a',
          color: '#E8EAED',
        });

        onDeleted?.(evento.id);
        onClose?.();
      } catch (error) {
        console.error('❌ Error al cancelar evento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data || 'No se pudo cancelar el evento.',
          background: '#11103a',
          color: '#E8EAED',
        });
        onClose?.();
      }
    };

    doConfirm();

    return () => {
      mounted = false;
    };
  }, [evento, onClose, onDeleted]);

  // No renderizamos markup propio; SweetAlert se encarga del UI
  return null;
};

export default ConfirmDeletePopup;
