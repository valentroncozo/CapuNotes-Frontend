// src/components/common/InscripcionView.jsx
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import "@/styles/popup.css";
import "@/styles/forms.css";
import { cuerdasService } from "@/services/cuerdasService.js";
import AudicionService from "@/services/audicionService.js";
import preguntasService from "@/services/preguntasService.js";

export default function InscripcionView({
  data = {},
  open,
  onClose,
  editable = false,
  onSaveCuerda,
}) {
  const [cuerdas, setCuerdas] = useState([]);
  const [formulario, setFormulario] = useState([]);
  const [selCuerda, setSelCuerda] = useState(String(data.cuerda ?? ""));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    // carga cuerdas + preguntas del formulario de la audición actual
    (async () => {
      try {
        const [cuerdasData, audicion] = await Promise.all([
          cuerdasService.list(),
          AudicionService.getActual(),
        ]);
        setCuerdas(Array.isArray(cuerdasData) ? cuerdasData : []);
        if (audicion?.id) {
          const preguntas = await preguntasService.getFormulario(audicion.id);
          setFormulario(Array.isArray(preguntas) ? preguntas : []);
        } else {
          setFormulario([]);
        }
      } catch (e) {
        console.error("Error cargando datos de inscripción:", e);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (open) setSelCuerda(String(data.cuerda ?? ""));
    setSaving(false);
  }, [open, data.cuerda]);

  const opcionesCuerdas = useMemo(() => {
    const lista = Array.isArray(cuerdas) ? cuerdas : [];
    const nombres = lista.map((c) => String(c?.name ?? c?.nombre ?? "").trim()).filter(Boolean);
    const extra = String(data.cuerda ?? "").trim();
    return Array.from(new Set(extra ? [extra, ...nombres] : nombres));
  }, [cuerdas, data.cuerda]);

  const dirty = editable && String(selCuerda || "") !== String(data.cuerda || "");

  const handleGuardar = async () => {
    if (!dirty || saving) return;
    try {
      setSaving(true);
      await onSaveCuerda?.(selCuerda);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Formulario de Inscripción"
      showHeaderClose={true}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          {editable && (
            <button
              className={`btn ${dirty && !saving ? "btn-primary" : "btn-disabled"}`}
              onClick={handleGuardar}
              disabled={!dirty || saving}
              aria-disabled={!dirty || saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          )}
        </>
      }
    >
      <div>
        <hr className="divisor-amarillo" />
        <h4 style={{ margin: "0 0 12px" }}>Datos personales:</h4>

        <div className="form-grid">
          <div className="field">
            <label>Nombre y apellido</label>
            <input className="input" value={data?.nombreApellido || ""} readOnly />
          </div>

          <div className="field" style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label>Tipo Dni</label>
              <input className="input" value={data?.tipoDni || ""} readOnly />
            </div>
            <div style={{ flex: 1 }}>
              <label>Nro dni</label>
              <input className="input" value={data?.nroDni || ""} readOnly />
            </div>
          </div>

          <div className="field">
            <label>Fecha de nacimiento</label>
            <input className="input" value={data?.fechaNacimiento || ""} readOnly />
          </div>

          <div className="field">
            <label>Correo</label>
            <input className="input" value={data?.correo || ""} readOnly />
          </div>

          <div className="field">
            <label>Teléfono</label>
            <input className="input" value={data?.telefono || ""} readOnly />
          </div>

          <div className="field">
            <label>Provincia</label>
            <input className="input" value={data?.provincia || ""} readOnly />
          </div>

          <div className="field">
            <label>País</label>
            <input className="input" value={data?.pais || ""} readOnly />
          </div>

          <div className="field">
            <label>Profesión/Carrera</label>
            <input className="input" value={data?.profesion || ""} readOnly />
          </div>

          <div className="field">
            <label>Cuerda</label>
            {editable ? (
              <select
                className="abmc-input"
                value={selCuerda}
                onChange={(e) => setSelCuerda(e.target.value)}
              >
                <option value="">— Seleccionar —</option>
                {opcionesCuerdas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input className="input" value={data?.cuerda || ""} readOnly />
            )}
          </div>
        </div>

        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Subí una foto tuya para que podamos reconocerte</label>
          <input className="input" value={data?.fotoNombre || ""} readOnly />
        </div>

        <h4 style={{ marginTop: "1.5rem" }}>Ahora, queremos saber más de vos:</h4>
        <div className="form-grid">
          {formulario.map((p) => (
            <div className="field" key={p.id}>
              <label>{p.valor}</label>
              <input className="input" value={""} readOnly />
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: "1.5rem" }}>Elegí el horario para tu audición:</h4>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label>Día</label>
            <input className="input" value={data?.dia || ""} readOnly />
          </div>
          <div className="field">
            <label>Horarios disponibles</label>
            <input className="input" value={data?.horario || ""} readOnly />
          </div>
        </div>

        <ul style={{ marginTop: "1rem", fontSize: ".9rem", opacity: 0.9 }}>
          <li>La audición es individual y consiste en preparar una canción, la que más te guste.</li>
          <li>Cantar la canción y después se toma el registro vocal.</li>
          <li>No es necesario tener conocimiento en teoría musical, solo tus ganas de desarrollar el don Musical y el Compromiso.</li>
        </ul>

        <div style={{ marginTop: "1rem" }}>
          <label>
            <input type="checkbox" checked readOnly style={{ marginRight: "6px" }} />
            ¿Estás de acuerdo con todo lo anterior?
          </label>
        </div>
      </div>
    </Modal>
  );
}

