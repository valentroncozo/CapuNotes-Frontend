// src/components/common/InscripcionView.jsx
import Modal from "@/components/common/Modal.jsx";
import { CUERDAS } from "@/constants/candidatos.js";
import "@/styles/popup.css";
import "@/styles/forms.css";

/**
 * InscripcionView
 * Modal de solo lectura (o semi editable para evaluadores)
 * Muestra todos los campos del formulario de inscripción del candidato.
 */
export default function InscripcionView({ data = {}, open, onClose, editable = false }) {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="modal-body" style={{ maxHeight: "80vh", overflow: "auto" }}>
        <h3 className="pop-title" style={{ marginBottom: 8 }}>Formulario de Inscripción</h3>
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
              <select className="input" value={data.cuerda || ""}>
                <option value="">...</option>
                {CUERDAS.map((c) => (
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
        </div>
      </div>
    </Modal>
  );
}
