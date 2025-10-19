// src/components/miembros/MiembroForm.jsx
import "@/styles/forms.css";

/**
 * Formulario reutilizable para Miembros.
 *
 * Props:
 * - schema: array de campos [{ key, label, type, required, max, options? }]
 * - value: object con valores actuales
 * - onChange: (key, value) => void
 * - errors: object { [key]: "mensaje" }
 * - readOnly: boolean (deshabilita inputs)
 * - gridCols: string CSS para columnas del grid (por defecto 1fr 1fr)
 */
export default function MiembroForm({
  schema = [],
  value = {},
  onChange,
  errors = {},
  readOnly = false,
  gridCols = "1fr 1fr",
  gap = 16,
}) {
  const handle = (key) => (e) => onChange?.(key, e.target.value);

  return (
    <div className="form-grid" style={{ gridTemplateColumns: gridCols, gap }}>
      {schema
        .filter((f) => f.type !== "button" && f.type !== "submit")
        .map((f) => (
          <div className="field" key={f.key} style={{ gridColumn: "span 1" }}>
            <label htmlFor={`miem-${f.key}`}>
              {f.label}
              {f.required ? " *" : ""}
            </label>

            {f.type === "select" ? (
              <select
                id={`miem-${f.key}`}
                className="input"
                value={value[f.key] ?? ""}
                onChange={handle(f.key)}
                disabled={readOnly}
              >
                <option value="">...</option>
                {(f.options || []).map((opt) => {
                  const val =
                    opt && typeof opt === "object" ? opt.value ?? opt.label : opt;
                  const lab =
                    opt && typeof opt === "object" ? opt.label ?? opt.value : opt;
                  return (
                    <option key={String(val)} value={val}>
                      {lab}
                    </option>
                  );
                })}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                id={`miem-${f.key}`}
                rows={3}
                className="input"
                value={value[f.key] ?? ""}
                onChange={handle(f.key)}
                maxLength={f.max || undefined}
                readOnly={readOnly}
                disabled={readOnly}
              />
            ) : (
              <input
                id={`miem-${f.key}`}
                className="input"
                type={f.type || "text"}
                value={value[f.key] ?? ""}
                onChange={handle(f.key)}
                maxLength={f.max || undefined}
                readOnly={readOnly}
                disabled={readOnly}
              />
            )}

            {errors[f.key] && <small style={{ color: "#ffc107" }}>{errors[f.key]}</small>}
          </div>
        ))}
    </div>
  );
}
