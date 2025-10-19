import ChoiceModal from "@/components/common/ChoiceModal.jsx";
import "@/styles/popup.css";
import "@/styles/forms.css";
import "@/styles/icons.css";

import CanceladoIcon from "@/assets/icons/turno/CanceladoIcon.jsx";
import ReservadoIcon from "@/assets/icons/turno/ReservadoIcon.jsx";
import DisponibleIcon from "@/assets/icons/turno/DisponibleIcon.jsx";

import { TURNO_ESTADOS, estadoLabel } from "@/constants/candidatos.js";

const TURNO_OPTS = [
  { value: "disponible", label: estadoLabel("disponible") },
  { value: "reservado", label: estadoLabel("reservado") },
  { value: "cancelado", label: estadoLabel("cancelado") },
];

function previewTurnoIcon(value) {
  const v = String(value || "disponible").toLowerCase();
  if (v === "cancelado")
    return (
      <span className="icon-estado icon-turno--cancel icon-md" title="Cancelado">
        <CanceladoIcon />
      </span>
    );
  if (v === "reservado")
    return (
      <span className="icon-estado icon-turno--res icon-md" title="Reservado">
        <ReservadoIcon />
      </span>
    );
  return (
    <span className="icon-estado icon-turno--disp icon-md" title="Disponible">
      <DisponibleIcon />
    </span>
  );
}

export default function TurnoEstadoModal({ row, onClose, onSave }) {
  // detectar valor inicial igual que antes
  const explicit = String(row?.turnoEstado ?? row?.turno?.estado ?? "").toLowerCase();
  const initialValue = TURNO_ESTADOS.includes(explicit)
    ? explicit
    : row?.resultado?.estado === "cancelado" || row?.resultado?.estado === "cancelada"
      ? "cancelado"
      : row?.inscripcion || row?.nombre || row?.apellido
        ? "reservado"
        : "disponible";

  return (
    <ChoiceModal
      isOpen={true}
      onClose={onClose}
      title="Editar estado"
      options={TURNO_OPTS}
      initialValue={initialValue}
      withTextarea={false}
      renderPreview={previewTurnoIcon}
      onSave={(estado) => onSave?.(estado)}
    />
  );
}
