// src/components/pages/audiciones/ResultadosModal.jsx
import { useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import "@/styles/popup.css";
import "@/styles/forms.css";
import "@/styles/icons.css";

/* Íconos de resultado */
import AceptadoIcon from "@/assets/icons/resultado/AceptadoIcon.jsx";
import RechazadoIcon from "@/assets/icons/resultado/RechazadoIcon.jsx";
import AusenteIcon from "@/assets/icons/resultado/AusenteIcon.jsx";
import SinResultadoIcon from "@/assets/icons/resultado/SinResultadoIcon.jsx";

const RESULT_OPTS = [
  { value: "pendiente", label: "PENDIENTE" },
  { value: "aprobado",  label: "APROBADO" },
  { value: "rechazado", label: "RECHAZADO" },
  { value: "cancelada",   label: "CANCELADA" },
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
  const [estado, setEstado] = useState(initialEstado);
  const [obs, setObs] = useState(initialObs);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Editar resultado"
      actions={(
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onSave?.(estado, obs);
            }}
          >
            Guardar
          </button>
        </>
      )}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        {previewResultadoIcon(estado)}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Estado</label>
          <select className="input" value={estado} onChange={(e) => setEstado(e.target.value)}>
            {RESULT_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Observaciones</label>
        <textarea className="input" rows={4} value={obs} onChange={(e) => setObs(e.target.value)} />
      </div>
    </Modal>
  );
}