// src/components/popUp/AreaEditPopup.jsx
import { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal.jsx";
import "../../styles/popup.css";

// ✅ validador centralizado
import { validateAreaFields, hasErrors } from "../common/validators.js";

export default function AreaEditPopup({ isOpen, onClose, area, onSave }) {
  const initial = useMemo(
    () => ({
      id: area?.id ?? null,
      nombre: area?.nombre ?? "",
      descripcion: area?.descripcion ?? "",
    }),
    [area]
  );

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({ nombre: null, descripcion: null });

  useEffect(() => {
    setForm(initial);
    setErrors(validateAreaFields(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, isOpen]);

  const runValidation = (next) => {
    const nextErrors = validateAreaFields(next);
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const draft = { ...form, [name]: value };
    setForm(draft);
    runValidation(draft); // validación en vivo
  };

  const handleSave = () => {
    if (!runValidation(form)) return;
    onSave?.({
      id: form.id,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
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
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={hasErrors(errors)}
          >
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor="area-nombre">Nombre</label>
          <input
            id="area-nombre"
            name="nombre"
            className="input"
            type="text"
            value={form.nombre}
            onChange={onChange}
            maxLength={80}
            placeholder="Nombre del área"
            aria-invalid={!!errors.nombre}
            aria-describedby="err-nombre"
            autoFocus
          />
          {errors.nombre && (
            <small id="err-nombre" style={{ color: "#ffc107" }}>
              {errors.nombre}
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="area-desc">Descripción</label>
          <textarea
            id="area-desc"
            name="descripcion"
            className="input"
            value={form.descripcion}
            onChange={onChange}
            maxLength={300}
            placeholder="Descripción (opcional)"
            rows={3}
            aria-invalid={!!errors.descripcion}
            aria-describedby="err-desc"
          />
          {errors.descripcion && (
            <small id="err-desc" style={{ color: "#ffc107" }}>
              {errors.descripcion}
            </small>
          )}
        </div>
      </div>
    </Modal>
  );
}
