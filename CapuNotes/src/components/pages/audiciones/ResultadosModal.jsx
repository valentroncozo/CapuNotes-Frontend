// src/components/pages/candidatos/ResultadosModal.jsx
import { useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import { ESTADOS } from "@/constants/candidatos.js";
import "@/styles/popup.css";
import "@/styles/forms.css";

export default function ResultadosModal({ row, onClose, onSave }) {
  const [estado, setEstado] = useState(row?.resultado?.estado ?? "sin");
  const [obs, setObs] = useState(row?.resultado?.obs ?? "");

  return (
    <Modal isOpen onClose={onClose}>
      <div className="modal-body">
        <h3 className="pop-title" style={{ marginBottom: 14 }}>Resultados</h3>

        <div className="grid-2">
          <div className="form-field">
            <label>Estado *</label>
            <select className="input" value={estado} onChange={(e) => setEstado(e.target.value)}>
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Observaciones</label>
          <textarea
            className="input"
            rows={4}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Comentarios del evaluador…"
          />
        </div>

        <div className="pop-footer" style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave(estado, obs)}>Guardar</button>
        </div>
      </div>
    </Modal>
  );
}
