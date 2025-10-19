// src/components/pages/miembros/agregar.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema, miembroEntityName } from "@/schemas/miembros.js";
import MiembroForm from "@/components/miembros/MiembroForm.jsx";
import "@/styles/abmc.css";
import "@/styles/forms.css";
import { success, error } from "@/utils/alerts.js";

export default function MiembrosAgregarPage() {
  const navigate = useNavigate();
  const schema = useMemo(() => buildMiembroSchema(), []);
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      schema.filter((f) => f.type !== "button" && f.type !== "submit").map((f) => [f.key, ""])
    )
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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
    if (!validate() || saving) return;
    try {
      setSaving(true);
      await miembrosService.create(form);
      await success({
        title: "Creado correctamente",
        text: `${capitalize(miembroEntityName)} guardado.`,
      });
      navigate("/miembros");
    } catch (e) {
      await error({
        title: "Error al guardar",
        text: e?.message || "No se pudo guardar.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Agregar {capitalize(miembroEntityName)}</h1>
        </div>

        <MiembroForm
          schema={schema}
          value={form}
          onChange={handleChange}
          errors={errors}
          readOnly={false}
          gridCols="1fr 1fr"
          gap={16}
        />

        <div className="abmc-topbar" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => navigate("/miembros")}>
            Cancelar
          </button>
          <button
            className={`btn ${saving ? "btn-disabled" : "btn-primary"}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </main>
  );
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
