// src/components/abmc/EntityEditForm.jsx
import { useEffect, useMemo, useState } from "react";
import "@/styles/popup.css";

/**
 * Popup genérico de Alta/Edición para ABMC
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: fn()
 *  - entityName: string  (ej: "área", "cuerda")
 *  - schema: [{ key, label, type, required, max, options? }, ...]  (NO incluir submit/button)
 *  - entity: object|null  (null => Agregar; object => Editar)
 *  - onSave: fn(payload)  (debe manejar create/update según `entity`)
 */
export default function EntityEditForm({
  isOpen,
  onClose,
  entityName = "elemento",
  schema = [],
  entity = null,
  onSave,
}) {
  const initial = useMemo(() => {
    const base = {};
    schema.forEach((f) => (base[f.key] = entity?.[f.key] ?? ""));
    if (entity?.id) base.id = entity.id;
    return base;
  }, [schema, entity]);

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => { setForm(initial); setErrors({}); }, [initial, isOpen]);

  const isEdit = !!entity;
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
  const title = `${isEdit ? "Editar" : "Agregar"} ${cap(entityName)}`;

  const validate = () => {
    const next = {};
    schema.forEach((f) => {
      const v = (form[f.key] ?? "").toString().trim();
      if (f.required && !v) next[f.key] = "Obligatorio";
      if (f.max && v.length > f.max) next[f.key] = `Máx. ${f.max} caracteres`;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    await onSave?.(form);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="pop-backdrop" onMouseDown={onClose}>
      <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="pop-header">
          <h3 className="pop-title">{title}</h3>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
        </div>

        <div className="pop-body">
          <div className="form-grid">
            {schema.map((f) => (
              <div className="field" key={f.key}>
                <label htmlFor={`inp-${f.key}`}>
                  {f.label} {f.required ? "*" : ""}
                </label>

                {f.type === "select" ? (
                  <select
                    id={`inp-${f.key}`}
                    className="input"
                    value={form[f.key] ?? ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  >
                    <option value="">...</option>
                    {(f.options || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    id={`inp-${f.key}`}
                    className="input"
                    rows={3}
                    value={form[f.key] ?? ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    maxLength={f.max || undefined}
                  />
                ) : (
                  <input
                    id={`inp-${f.key}`}
                    className="input"
                    type={f.type || "text"}
                    value={form[f.key] ?? ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    maxLength={f.max || undefined}
                  />
                )}

                {errors[f.key] && (
                  <small style={{ color: "#ffc107" }}>{errors[f.key]}</small>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pop-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
