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
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Detectar si estamos editando o creando
  const isEditing = Boolean(entity && (entity.id || Object.keys(entity).length > 0));

  useEffect(() => {
    setForm(entity || {});
    setErrorMsg("");
  }, [entity, isOpen]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // limpiar mensaje de error al modificar campos
    if (errorMsg) setErrorMsg("");
  };

  const missingRequiredLabels = () => {
    const labels = [];
    for (const f of schema) {
      if (f.required && !String(form[f.key] ?? "").trim()) labels.push(f.label);
    }
    return labels;
  };

  const handleSave = async () => {
    // Validación inline: campos obligatorios
    const missing = missingRequiredLabels();
    if (missing.length) {
      setErrorMsg(`Completá los campos requeridos: ${missing.join(', ')}`);
      return;
    }

    // Validación inline específica: nombre de cuerda no puede ser solo números
    if (String(entityName).toLowerCase() === "cuerda") {
      const nameVal = String(form.name ?? form.nombre ?? "").trim();
      if (nameVal && /^\d+$/.test(nameVal)) {
        setErrorMsg("El nombre de la cuerda no puede estar formado únicamente por números.");
        return;
      }
    }

    // Validación inline específica: si la entidad es 'área' debe tener descripción
    if (String(entityName).toLowerCase() === "área") {
      const desc = String(form.descripcion ?? "").trim();
      if (!desc) {
        setErrorMsg("Debés ingresar una descripción para el área.");
        return;
      }
    }

    try {
      console.log('GenericEditPopup: calling onSave with form', form);
      const res = await onSave?.(form);
      console.log('GenericEditPopup: onSave returned', res);
      // Si onSave devuelve explícitamente false, consideramos que hubo un bloqueo/validación
      // y no cerramos el popup. Cualquier otro valor (incluido undefined) cerrará si no hay error.
      if (res === false) return;
      if (res && typeof res === "object" && res.errorMessage) {
        setErrorMsg(res.errorMessage);
        return;
      }
      onClose?.();
    } catch (err) {
      console.error('Error en onSave:', err);
      setErrorMsg("No pudimos guardar el registro. Intentá nuevamente.");
      // No cerramos el popup para que el usuario pueda corregir
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar ${entityName}` : `Agregar ${entityName}`}
      actions={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            {isEditing ? "Guardar cambios" : "Agregar"}
          </button>
        </>
      }
    >
      {errorMsg && (
        <div style={{ padding: '0 18px', marginBottom: 8 }}>
          <p style={{ color: '#DE9205', fontSize: '0.95rem', margin: 0 }}>{errorMsg}</p>
        </div>
      )}
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
