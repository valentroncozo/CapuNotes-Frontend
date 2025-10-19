// src/components/abmc/EntityEditForm.jsx
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import "@/styles/popup.css";

/**
 * Popup genérico de Alta/Edición para ABMC
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial);
    setErrors({});
    setSaving(false);
  }, [initial, isOpen]);

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

  const handleConfirm = async (e) => {
    e?.preventDefault?.();
    if (!validate() || saving) return;
    try {
      setSaving(true);
      await onSave?.(form);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showHeaderClose={true} // ✅ cruz visible
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className={`btn ${saving ? "btn-disabled" : "btn-primary"}`}
            onClick={handleConfirm}
            type="submit"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Confirmar"}
          </button>
        </>
      }
    >
      <form onSubmit={handleConfirm}>
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
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">...</option>
                  {(f.options || []).map((opt) => {
                    const value =
                      opt && typeof opt === "object" ? opt.value ?? opt.label : opt;
                    const label =
                      opt && typeof opt === "object" ? opt.label ?? opt.value : opt;
                    return (
                      <option key={String(value)} value={value}>
                        {label}
                      </option>
                    );
                  })}
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

              {errors[f.key] && <small style={{ color: "#ffc107" }}>{errors[f.key]}</small>}
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}
