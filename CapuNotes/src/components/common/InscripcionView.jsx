// src/components/common/InscripcionView.jsx
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal.jsx";
import useCuerdas from "@/hooks/useCuerdas.js";
import "@/styles/popup.css";
import "@/styles/forms.css";

export default function InscripcionView({
  data = {},
  open,
  onClose,
  editable = false,
  onSaveCuerda,
}) {
  const { items: cuerdas } = useCuerdas();

  const opcionesCuerdas = useMemo(() => {
    const lista = Array.isArray(cuerdas) ? cuerdas : [];
    const nombres = lista.map((c) => String(c?.nombre ?? "").trim()).filter(Boolean);
    const extra = String(data.cuerda ?? "").trim();
    return Array.from(new Set(extra ? [extra, ...nombres] : nombres));
  }, [cuerdas, data.cuerda]);

  const [selCuerda, setSelCuerda] = useState(String(data.cuerda ?? ""));
  const [saving, setSaving] = useState(false);

  // 🔧 Reset controlado: solo cuando se abre el modal o cambia el valor de cuerda proveniente de data
  useEffect(() => {
    if (open) setSelCuerda(String(data.cuerda ?? ""));
    setSaving(false);
  }, [open, data.cuerda]);

  const dirty = editable && String(selCuerda || "") !== String(data.cuerda || "");

  const handleGuardar = async () => {
    if (!dirty || saving) return;
    try {
      setSaving(true);
      await onSaveCuerda?.(selCuerda);
      onClose?.(); // cerrar al guardar OK, como pediste
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Formulario de Inscripción">
      <div className="modal-body" style={{ maxHeight: "80vh", overflow: "auto" }}>
        <hr className="divisor-amarillo" />

        <section style={{ marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Datos personales:</h4>
        </section>

        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field" style={{ gridColumn: "1 / span 2" }}>
            <label>Nombre y apellido</label>
            <input className="input" value={data.nombreCompleto || ""} readOnly disabled />
          </div>

          <div className="field">
            <label>Tipo Documento</label>
            <input className="input" value={data.tipoDoc || ""} readOnly disabled />
          </div>
          <div className="field">
            <label>Nro Documento</label>
            <input className="input" value={data.nroDoc || ""} readOnly disabled />
          </div>

          <div className="field">
            <label>Fecha de nacimiento</label>
            <input className="input" value={data.fechaNac || ""} readOnly disabled />
          </div>
          <div className="field">
            <label>Correo</label>
            <input className="input" value={data.correo || ""} readOnly disabled />
          </div>

          <div className="field">
            <label>Teléfono</label>
            <input className="input" value={data.telefono || ""} readOnly disabled />
          </div>
          <div className="field">
            <label>Provincia</label>
            <input className="input" value={data.provincia || ""} readOnly disabled />
          </div>

          <div className="field">
            <label>País</label>
            <input className="input" value={data.pais || ""} readOnly disabled />
          </div>
          <div className="field">
            <label>Profesión/Carrera</label>
            <input className="input" value={data.profesion || ""} readOnly disabled />
          </div>

          <div className="field" style={{ gridColumn: "1 / span 2" }}>
            <label>Cuerda</label>
            {editable ? (
              <select
                className="input"
                value={selCuerda}
                onChange={(e) => setSelCuerda(e.target.value)}
                aria-label="Seleccionar cuerda"
                // 🛡️ evita que el click del menú nativo burbujee y dispare el backdrop
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">...</option>
                {opcionesCuerdas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input className="input" value={data.cuerda || ""} readOnly disabled />
            )}
          </div>

          <div className="field" style={{ gridColumn: "1 / span 2" }}>
            <label>Foto (reconocimiento)</label>
            {data.fotoUrl ? (
              <img
                src={data.fotoUrl}
                alt="Foto del postulante"
                style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,.15)" }}
              />
            ) : (
              <input className="input" value="" placeholder="Sin imagen" readOnly disabled />
            )}
          </div>
        </div>

        <section style={{ margin: "14px 0 6px" }}>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Ahora, ¡queremos saber más de vos!</h4>
        </section>

        <div className="form-grid">
          {[
            ["Contanos de vos", "contanosDeVos"],
            ["Hoy estás acá… ¿en qué te gustaría crecer?", "motivacion"],
            ["¿Cantás o cantaste alguna vez? ¿Dónde?", "cantoAntes"],
            ["¿Vas a Misa? ¿Conocés la misa de 21hs de Capuchinos?", "conoceMisa"],
            ["¿Participás/participaste en otro grupo de nuestra comunidad?", "participaGrupo"],
            ["¿Sabés tocar algún instrumento musical? ¿Cuál?", "instrumentos"],
            ["¿Tenés algún otro talento artístico?", "otrosTalentos"],
            ["¿Cómo te enteraste de la convocatoria al coro?", "comoTeEnteraste"],
            ["¿Qué buscás/encontrar o qué te motiva a ingresar al Coro?", "queBuscas"],
            ["¿Qué canción vas a cantar?", "queCancion"],
          ].map(([label, key]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <textarea className="input" rows={2} value={data[key] || ""} readOnly disabled />
            </div>
          ))}
        </div>

        <section style={{ margin: "14px 0 6px" }}>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Elegí el horario para tu audición:</h4>
        </section>

        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label>Día</label>
            <input className="input" value={data.diaAudicion || ""} readOnly disabled />
          </div>
          <div className="field">
            <label>Horario disponible</label>
            <input className="input" value={data.horaAudicion || ""} readOnly disabled />
          </div>
        </div>

        <div className="field" style={{ marginTop: 8 }}>
          <label>¿Está de acuerdo con todo lo anterior?</label>
          <input
            type="checkbox"
            checked={!!data.aceptaTerminos}
            readOnly
            disabled
            style={{ transform: "scale(1.2)", marginLeft: 8 }}
          />
        </div>

        <div className="pop-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
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
        </div>
      </div>
    </Modal>
  );
}
