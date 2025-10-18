// src/components/pages/audiciones/ResultadosModal.jsx
import { useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import "@/styles/forms.css";
import "@/styles/popup.css";

import {
  RESULTADO_ESTADOS,
  estadoLabel,
  estadoClass,
} from "@/constants/candidatos.js";

export default function ResultadosModal({ row, onClose, onSave }) {
  const [estado, setEstado] = useState(row?.resultado?.estado || "sin");
  const [observaciones, setObservaciones] = useState(row?.resultado?.obs || "");

  const handleSave = () => {
    onSave?.(estado, observaciones);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Editar resultado">
      <div className="form-grid" style={{ gap: 12 }}>
        <p>
          <strong>Candidato:</strong>{" "}
          {[
            (row?.apellido ?? "").trim(),
            (row?.nombre ?? "").trim(),
          ].filter(Boolean).join(", ") || "—"}
        </p>

        <p>
          <strong>Canción:</strong> {row?.cancion || "—"}
        </p>

        <div className="field">
          <label htmlFor="estado">Resultado</label>
          <select
            id="estado"
            className="input"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            {RESULTADO_ESTADOS.map((e) => (
              <option key={e} value={e}>
                {estadoLabel(e)}
              </option>
            ))}
          </select>
          {/* Badge vista previa del estado seleccionado */}
          <div style={{ marginTop: 8 }}>
            <span className={`badge-estado ${estadoClass(estado)}`}>
              {estadoLabel(estado)}
            </span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            className="input"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <div className="pop-footer" style={{ padding: 0, marginTop: 6 }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
