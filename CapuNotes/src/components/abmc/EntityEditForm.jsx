// src/components/abmc/EntityEditForm.jsx
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { required, maxLength, hasErrors } from "../common/validators";

export default function EntityEditForm({ isOpen, onClose, entityName, schema, entity, onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(entity || {});
    setErrors({});
  }, [entity, isOpen]);

  const validateField = (field, value) => {
    const rules = [];
    if (field.required) rules.push(required(field.label));
    if (field.max) rules.push(maxLength(field.label, field.max));
    for (const rule of rules) {
      const msg = rule(value);
      if (msg) return msg;
    }
    return null;
  };

  const validateAll = () => {
    const nextErrors = {};
    schema.forEach(f => {
      nextErrors[f.key] = validateField(f, formData[f.key]);
    });
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!validateAll()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar ${entityName}`}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
        </>
      }
    >
      <div className="form-grid">
        {schema.map(f => (
          <div className="field" key={f.key}>
            <label>{f.label}</label>
            {f.type === "select" ? (
              <select
                name={f.key}
                value={formData[f.key] || ""}
                onChange={handleChange}
                className="input"
              >
                <option value="">Seleccionar</option>
                {(f.options || []).map(opt => {
                  const value = opt.value ?? opt;
                  const label = opt.label ?? opt;
                  return <option key={value} value={value}>{label}</option>;
                })}
              </select>
            ) : (
              <input
                type={f.type || "text"}
                name={f.key}
                value={formData[f.key] || ""}
                onChange={handleChange}
                className="input"
              />
            )}
            {errors[f.key] && <small style={{ color: "#ffc107" }}>{errors[f.key]}</small>}
          </div>
        ))}
      </div>
    </Modal>
  );
}
