// src/components/pages/miembros/editar.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "@/components/common/BackButton.jsx";
import { miembrosService } from "@/services/miembrosService.js";
import { buildMiembroSchema, miembroEntityName } from "@/schemas/miembros.js";
import MiembroForm from "@/components/miembros/MiembroForm.jsx";
import "@/styles/abmc.css";
import "@/styles/forms.css";
import { success, error } from "@/utils/alerts.js";

export default function MiembrosEditarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const idQS = sp.get("id");

  const schema = useMemo(() => buildMiembroSchema(), []);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Carga flexible: si viene por estado, usarlo; si no, buscar por id en querystring
  useEffect(() => {
    (async () => {
      try {
        // 1) Si viene por state (navegación programática) lo usamos directo
        const viaState = location.state && location.state.miembro;
        if (viaState) {
          setForm(viaState);
          return;
        }

        // 2) Si no, tratamos de buscar por el id de la URL
        if (idQS != null) {
          const list = await miembrosService.list();
          // Aceptamos que el id pueda ser string/number simple o un objeto serializado
          const found =
            list.find((m) => String(m.id) === String(idQS)) ||
            list.find((m) => String(m.id?.nroDocumento) === String(idQS)) ||
            list.find((m) => String(m.id?.tipoDocumento) === String(idQS));
          if (found) {
            setForm(found);
            return;
          }
        }

        // 3) Fallback si no se encontró nada
        setForm({});
      } catch (e) {
        await error({
          title: "Error al cargar",
          text: e?.message || "No se pudo cargar el miembro.",
        });
      }
    })();
  }, [idQS, location.state]);

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

  if (form == null) return null;

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

        <div className="abmc-topbar" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => navigate("/miembros")}>
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
