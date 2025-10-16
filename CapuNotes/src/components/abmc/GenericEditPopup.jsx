// src/components/abmc/GenericEditPopup.jsx
import { useEffect, useState } from "react";
import Modal from "../utils/Modal";
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
      title={`Editar ${entityName}`}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="form-grid">
        {schema.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={`field-${f.key}`}>{f.label}</label>

            {f.type === "select" ? (
              <select
                id={`field-${f.key}`}
                name={f.key}
                className="input"
                value={form[f.key] || ""}
                onChange={onChange}
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
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
