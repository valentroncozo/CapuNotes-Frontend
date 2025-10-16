import { useEffect, useState } from "react";
import CloseIcon from "../ui/icons/CloseIcon.jsx";
import Button from "../ui/Button.jsx";
import TextField from "../ui/TextField.jsx";
import SelectField from "../ui/SelectField.jsx";
import "../../styles/popup.css";

export default function GenericEditPopup({
  entity,
  fields = [],
  open,
  onClose,
  initialValues = {},
  onSubmit,
}) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const v = {};
      fields.forEach(f => (v[f.key] = initialValues[f.key] ?? ""));
      setValues(v);
      setErrors({});
    }
  }, [open, fields, initialValues]);

  const handleChange = (key, value) =>
    setValues(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const e = {};
    fields.forEach(f => {
      if (f.required && !values[f.key]) e[f.key] = "Campo obligatorio";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  if (!open) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Editar {entity}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="popup-body">
            {fields.map(f => (
              <div key={f.key} className="popup-field">
                {f.type === "select" ? (
                  <SelectField
                    label={f.label}
                    required={f.required}
                    value={values[f.key]}
                    onChange={v => handleChange(f.key, v)}
                    options={f.options || []}
                    error={errors[f.key]}
                  />
                ) : (
                  <TextField
                    label={f.label}
                    required={f.required}
                    value={values[f.key]}
                    onChange={v => handleChange(f.key, v)}
                    error={errors[f.key]}
                    type={f.type || "text"}
                  />
                )}
              </div>
            ))}
            <p className="popup-hint">
              Los campos marcados con <b>*</b> son obligatorios.
            </p>
          </div>

        <div className="popup-footer">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
        </form>
      </div>
    </div>
  );
}
