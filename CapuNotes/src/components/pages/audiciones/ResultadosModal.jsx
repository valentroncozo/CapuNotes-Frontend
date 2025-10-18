// src/components/pages/audiciones/ResultadosModal.jsx
import ChoiceModal from "@/components/common/ChoiceModal.jsx";
import "@/styles/popup.css";
import "@/styles/forms.css";
import "@/styles/icons.css";

/* Íconos de resultado */
import AceptadoIcon from "@/assets/icons/resultado/AceptadoIcon.jsx";
import RechazadoIcon from "@/assets/icons/resultado/RechazadoIcon.jsx";
import AusenteIcon from "@/assets/icons/resultado/AusenteIcon.jsx";
import SinResultadoIcon from "@/assets/icons/resultado/SinResultadoIcon.jsx";

const RESULT_OPTS = [
  { value: "sin",       label: "Sin resultado" },
  { value: "aceptado",  label: "Aceptado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "ausente",   label: "Ausente" },
];

function previewResultadoIcon(value) {
  const v = String(value || "sin").toLowerCase();
  if (v === "aceptado" || v === "aceptada" || v === "ok")
    return (
      <span className="icon-estado icon-estado--ok icon-md" title="Aceptado">
        <AceptadoIcon />
      </span>
    );
  if (v === "rechazado" || v === "rechazada" || v === "bad")
    return (
      <span className="icon-estado icon-estado--bad icon-md" title="Rechazado">
        <RechazadoIcon />
      </span>
    );
  if (v === "ausente" || v === "pend")
    return (
      <span className="icon-estado icon-estado--pend icon-md" title="Ausente">
        <AusenteIcon />
      </span>
    );
  return (
    <span className="icon-estado icon-estado--sin icon-md" title="Sin resultado">
      <SinResultadoIcon />
    </span>
  );
}

export default function ResultadosModal({ row, onClose, onSave }) {
  const initialEstado = String(row?.resultado?.estado || "sin").toLowerCase();
  const initialObs = row?.resultado?.obs || "";

  return (
    <ChoiceModal
      isOpen={true}
      onClose={onClose}
      title="Editar resultado"
      options={RESULT_OPTS}
      initialValue={initialEstado}
      withTextarea={true}
      textareaLabel="Observaciones"
      textareaPlaceholder="Notas opcionales…"
      initialNotes={initialObs}
      renderPreview={previewResultadoIcon}
      onSave={(estado, obs) => onSave?.(estado, obs)}
    />
  );
}
