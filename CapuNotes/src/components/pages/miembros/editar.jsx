// src/components/pages/miembros/editar.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema, miembroEntityName } from "@/schemas/miembros.js";
import "@/styles/abmc.css";
import "@/styles/forms.css";

export default function MiembrosEditarPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const id = sp.get("id");

  const schema = useMemo(() => buildMiembroSchema(), []);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const list = await miembrosService.list();
      const current = list.find((m) => String(m.id) === String(id));
      setForm(current || {});
    })();
  }, [id]);

  const validate = () => {
    const e = {};
    schema.forEach((f) => {
      const v = String(form?.[f.key] ?? "").trim();
      if (f.required && !v) e[f.key] = "Obligatorio";
      if (f.max && v.length > f.max) e[f.key] = `Máx. ${f.max} caracteres`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!validate()) return;
    await miembrosService.update(form);
    navigate("/miembros");
  };

  if (!form) return null;

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Editar {capitalize(miembroEntityName)}</h1>
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {schema
            .filter((f) => f.type !== "button" && f.type !== "submit")
            .map((f) => (
              <div className="field" key={f.key} style={{ gridColumn: "span 1" }}>
                <label htmlFor={`inp-${f.key}`}>{f.label}{f.required ? " *" : ""}</label>

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
                    rows={3}
                    className="input"
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

        <div className="abmc-topbar" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => navigate("/miembros")}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Guardar cambios</button>
        </div>
      </div>
    </main>
  );
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ""; }
