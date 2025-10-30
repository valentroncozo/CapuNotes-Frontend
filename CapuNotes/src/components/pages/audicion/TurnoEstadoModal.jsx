import { useState } from "react";
import "@/styles/popup.css";

export default function TurnoEstadoModal({ row, onClose, onSave }) {
  const [sel, setSel] = useState((row?.turnoEstado || row?.turno?.estado || "").toLowerCase());

  const handleSave = () => {
    if (!sel) return;
    onSave?.(sel);
  };

  return (
    <div className="pop-backdrop" onMouseDown={onClose}>
      <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="pop-header">
          <h3 className="pop-title">Editar estado del turno</h3>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
        </div>
        <div className="pop-body">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ minWidth: 90 }}>Estado</label>
            <select className="abmc-input" value={sel} onChange={(e) => setSel(e.target.value)}>
              <option value="">-</option>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        <div className="pop-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} style={{ marginLeft: 8 }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
