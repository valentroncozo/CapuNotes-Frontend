import React from "react";
import Swal from "sweetalert2";
import "@/styles/globals.css";
import "@/styles/popup.css";
import { eventoService } from "@/services/eventoService.js";

const ConfirmDeletePopup = ({ evento, onClose, onDeleted }) => {
  React.useEffect(() => {
    if (!evento) {
      onClose?.();
      return;
    }

    let mounted = true;

    const doConfirm = async () => {
      const res = await Swal.fire({
        title: `¿Cancelar evento "${evento.nombre || 'sin nombre'}"?`,
        text: "Esta acción cancelará el evento y no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DE9205",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        background: "#11103a",
        color: "#E8EAED",
      });

      if (!mounted) return;

      // 🔹 Si el usuario canceló
      if (!res.isConfirmed) {
        onClose?.();
        return;
      }

      try {
        // 🔹 Validación final
        if (!evento.tipoEvento) {
          throw new Error("El tipo de evento es obligatorio para eliminar.");
        }

        await eventoService.remove(evento.id, evento.tipoEvento);

        await Swal.fire({
          icon: "success",
          title: "Evento cancelado",
          text: `El evento "${evento.nombre}" fue cancelado correctamente.`,
          timer: 1400,
          showConfirmButton: false,
          background: "#11103a",
          color: "#E8EAED",

        });

        // Avisamos al index que lo borre de la lista
        onDeleted?.(evento.id);

      } catch (error) {
        console.error("❌ Error al cancelar evento:", error);

        const backendMsg =
          error?.response?.data?.mensaje ||
          error?.response?.data?.error ||
          error?.response?.data ||
          "No se pudo cancelar el evento.";


        await Swal.fire({
          icon: "error",
          title: backendMsg,
          text: error?.response?.data || "No se pudo cancelar el evento.",
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#DE9205",
          confirmButtonText: "Aceptar",

        });
      }

      onClose?.();
    };

    doConfirm();

    return () => {
      mounted = false;
    };
  }, [evento, onClose, onDeleted]);

  return null; // SweetAlert maneja toda la UI
};

export default ConfirmDeletePopup;
