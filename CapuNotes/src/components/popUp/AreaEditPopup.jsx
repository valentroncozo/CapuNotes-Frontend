import { useEffect, useState } from "react";
import Modal from "../utils/Modal";
import "../../styles/popup.css";

/**
 * Pop-up para editar un Área del sistema (nombre y descripción).
 *
 * Props:
 * - isOpen: boolean
 * - onClose: fn()
 * - area: { id: string|number, nombre: string, descripcion?: string } | null
 * - onSave: fn({ id, nombre, descripcion })
 */
export default function AreaEditPopup({ isOpen, onClose, area, onSave }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setNombre(area?.nombre ?? "");
    setDescripcion(area?.descripcion ?? "");
    setError("");
  }, [isOpen, area]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombreTrim = (nombre || "").trim();
    const descTrim = (descripcion || "").trim();

    if (!nombreTrim) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (nombreTrim.length > 80) {
      setError("El nombre no puede superar los 80 caracteres.");
      return;
    }
    if (descTrim.length > 300) {
      setError("La descripción no puede superar los 300 caracteres.");
      return;
    }

    onSave?.({
      id: area?.id,
      nombre: nombreTrim,
      descripcion: descTrim,
    });
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar área"
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
          <label htmlFor="area-nombre">Nombre del área</label>
          <input
            id="area-nombre"
            className="input"
            placeholder="Ej: Comunicación"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            maxLength={80}
          />
        </div>

        <div className="field">
          <label htmlFor="area-descripcion">Descripción</label>
          <textarea
            id="area-descripcion"
            className="input"
            placeholder="Breve descripción del área…"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            maxLength={300}
          />
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255,193,7,.12)",
              border: "1px solid rgba(255,193,7,.35)",
              color: "var(--text-light)",
              borderRadius: "var(--radius)",
              padding: "10px 12px",
              fontSize: ".9rem",
            }}
          >
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}
