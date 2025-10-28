import { useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import "@/styles/popup.css";
import "@/styles/forms.css";

const RESULT_OPTS = [
  { value: "sin", label: "Sin resultado" },
  { value: "aceptado", label: "Aceptado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "ausente", label: "Ausente" },
];

function normalizeEstado(value) {
  const v = String(value || "").trim().toLowerCase();
  if (["aprobado", "aceptado", "ok"].includes(v)) return "aceptado";
  if (["rechazado", "no", "fail"].includes(v)) return "rechazado";
  if (["ausente"].includes(v)) return "ausente";
  return "sin";
}

export default function ResultadosModal({ mode = "edit", row, onSave, onClose }) {
  const initialEstado = normalizeEstado(row?.resultado?.estado);
  const initialObs = row?.resultado?.obs || "";

  const [estado, setEstado] = useState(initialEstado);
  const [obs, setObs] = useState(initialObs);

  const isReadOnly = mode === "view";
  const title =
    mode === "view"
      ? "Resultado de la audición"
      : mode === "create"
      ? "Nuevo resultado"
      : "Editar resultado";

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            {isReadOnly ? "Cerrar" : "Cancelar"}
          </button>
          {!isReadOnly && (
            <button
              className="btn btn-primary"
              onClick={() => onSave?.(estado, obs)}
            >
              Guardar
            </button>
          )}
        </>
      }
    >
      <div className="field" style={{ marginBottom: "1rem" }}>
        <label>Estado</label>
        <select
          className="input"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          disabled={isReadOnly}
        >
          {RESULT_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Observaciones</label>
        <textarea
          className="input"
          rows={4}
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          placeholder="Escriba una observación..."
          readOnly={isReadOnly}
        />
      </div>
    </Modal>
  );
}
