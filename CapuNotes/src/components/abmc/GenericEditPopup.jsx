// src/components/abmc/GenericEditPopup.jsx
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import "../../styles/popup.css";
import Swal from "sweetalert2";

export default function GenericEditPopup({
  isOpen,
  onClose,
  entityName = "registro",
  schema = [],
  entity = {},
  onSave,
}) {
  const [form, setForm] = useState({});

  // 🔹 Detectar si estamos editando o creando
  const isEditing = Boolean(entity && (entity.id || Object.keys(entity).length > 0));

  useEffect(() => {
    setForm(entity || {});
  }, [entity, isOpen]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const missingRequiredLabels = () => {
    const labels = [];
    for (const f of schema) {
      if (f.required && !String(form[f.key] ?? "").trim()) labels.push(f.label);
    }
    return labels;
  };

  const handleSave = () => {
    const missing = missingRequiredLabels();
    if (missing.length) {
      const list = missing.map((l) => `<li>${l}</li>`).join("");
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        html: `<p>Completá los campos requeridos:</p><ul style="text-align:left;margin:0 auto;max-width:300px">${list}</ul>`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }
    onSave?.(form);
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar ${entityName}` : `Agregar ${entityName}`}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEditing ? "Guardar cambios" : "Agregar"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        {schema
          .filter((f) => !["submit", "button", "label"].includes(f.type))
          .map((f) => (
            <div className="field" key={f.key} style={{ gridColumn: "1 / -1" }}>
              <label htmlFor={`field-${f.key}`}>{f.label}</label>

              {f.type === "select" ? (
                <select
                  id={`field-${f.key}`}
                  name={f.key}
                  className="input"
                  value={form[f.key] || ""}
                  onChange={onChange}
                  style={{ width: "100%" }}
                >
                  <option value="">Seleccionar</option>
                  {(f.options || []).map((opt) => {
                    const value = opt.value ?? opt;
                    const label = opt.label ?? opt;
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              ) : f.type === "textarea" || f.key === "descripcion" ? (
                <textarea
                  id={`field-${f.key}`}
                  name={f.key}
                  className="input"
                  value={form[f.key] || ""}
                  onChange={onChange}
                  maxLength={f.max}
                  placeholder={f.label}
                  rows={5}
                  style={{ width: "100%", minHeight: 120, resize: "vertical" }}
                />
              ) : (
                <input
                  id={`field-${f.key}`}
                  type={f.type || "text"}
                  name={f.key}
                  className="input"
                  value={form[f.key] || ""}
                  onChange={onChange}
                  maxLength={f.max}
                  placeholder={f.label}
                  style={{ width: "100%" }}
                />
              )}
            </div>
          ))}
      </div>
    </Modal>
  );
}
