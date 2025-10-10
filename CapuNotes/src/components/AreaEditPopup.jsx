// src/components/AreaEditPopup.jsx
import { useEffect, useState } from "react";
import Modal from "./Modal";
import "./popup.css";

/**
 * Props:
 * - isOpen: bool
 * - onClose: fn()
 * - member: { id, nombre, apellido, areaId }  // lo que tengas; solo se usa para mostrar
 * - areas: Array<{ id:string|number, nombre:string }>
 * - onSave: fn({ memberId, areaId })  // se llama al confirmar
 */
export default function AreaEditPopup({ isOpen, onClose, member, areas = [], onSave }) {
  const [selected, setSelected] = useState(member?.areaId ?? "");

  useEffect(() => {
    // cuando abre o cambia el member, actualizar selección
    setSelected(member?.areaId ?? "");
  }, [member, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onSave?.({ memberId: member?.id, areaId: selected });
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modificar área de miembro"
      actions={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="area-edit-form" className="btn btn-primary">
            Guardar
          </button>
        </>
      }
    >
      <form id="area-edit-form" onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label>Miembro</label>
          <input
            className="input"
            value={`${member?.nombre ?? ""} ${member?.apellido ?? ""}`.trim()}
            readOnly
          />
        </div>

        <div className="field">
          <label>Área</label>
          <div className="select-wrap">
            <select
              className="select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              required
            >
              <option value="" disabled>Seleccioná un área…</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Si querés permitir crear área al vuelo, dejá este bloque y manejalo arriba */}
        {/* <div className="field-row">
          <button type="button" className="icon-btn" title="Agregar nueva área" onClick={onAddArea}>＋</button>
        </div> */}
      </form>
    </Modal>
  );
}
