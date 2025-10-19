// src/components/common/ChoiceModal.jsx
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import "@/styles/forms.css";

/**
 * ChoiceModal — Modal genérico para elegir una opción y (opcional) escribir notas.
 *
 * Props:
 * - isOpen, onClose
 * - title
 * - options: Array<{ value: string, label: string }>
 * - initialValue: string
 * - withTextarea?: boolean (default: false)
 * - textareaLabel?: string
 * - textareaPlaceholder?: string
 * - initialNotes?: string
 * - renderPreview?: (value: string) => ReactNode  // para previsualizar icono/estado
 * - onSave: (value: string, notes?: string) => Promise|void
 */
export default function ChoiceModal({
  isOpen,
  onClose,
  title = "Editar",
  options = [],
  initialValue = "",
  withTextarea = false,
  textareaLabel = "Observaciones",
  textareaPlaceholder = "Notas opcionales…",
  initialNotes = "",
  renderPreview,
  onSave,
}) {
  const [value, setValue] = useState(initialValue || (options[0]?.value ?? ""));
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(initialValue || (options[0]?.value ?? ""));
    setNotes(initialNotes || "");
  }, [initialValue, initialNotes, isOpen, options]);

  const Preview = useMemo(() => {
    return renderPreview ? () => renderPreview(value) : () => null;
  }, [renderPreview, value]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (saving) return;
    setSaving(true);
    try {
      await onSave?.(value, withTextarea ? notes : undefined);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showHeaderClose={true} // ✅ ahora todas las ventanas tienen cruz
      actions={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className={`btn ${saving ? "btn-disabled" : "btn-primary"}`}
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="choice-select">Seleccionar</label>
            <select
              id="choice-select"
              className="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {renderPreview && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <Preview />
                <small style={{ opacity: 0.8 }}>Seleccionado</small>
              </div>
            )}
          </div>

          {withTextarea && (
            <div className="field">
              <label htmlFor="choice-notes">{textareaLabel}</label>
              <textarea
                id="choice-notes"
                className="input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={textareaPlaceholder}
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
