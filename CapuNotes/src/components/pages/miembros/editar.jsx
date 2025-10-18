// src/components/pages/miembros/editar.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema, miembroEntityName } from "@/schemas/miembros.js";
import MiembroForm from "@/components/miembros/MiembroForm.jsx";
import "@/styles/abmc.css";
import "@/styles/forms.css";
import { success, error } from "@/utils/alerts.js";

export default function MiembrosEditarPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const id = sp.get("id");

  const schema = useMemo(() => buildMiembroSchema(), []);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await miembrosService.list();
        const current = list.find((m) => String(m.id) === String(id));
        setForm(current || {});
      } catch (e) {
        await error({
          title: "Error al cargar",
          text: e?.message || "No se pudo cargar el miembro.",
        });
      }
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

  const handleChange = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!validate() || saving) return;
    try {
      setSaving(true);
      await miembrosService.update(form);
      await success({
        title: "Actualizado correctamente",
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

  if (!form) return null;

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Editar {capitalize(miembroEntityName)}</h1>
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

        <div
          className="abmc-topbar"
          style={{ justifyContent: "flex-end", marginTop: 16 }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/miembros")}
          >
            Cancelar
          </button>
          <button
            className={`btn ${saving ? "btn-disabled" : "btn-primary"}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </main>
  );
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
