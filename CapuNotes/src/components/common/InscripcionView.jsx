import { useState } from "react";
import "@/styles/popup.css";
import "@/styles/forms.css";

/**
 * Componente para visualizar/editar información de inscripción
 * @param {Object} props
 * @param {Object} props.data - Datos de la inscripción
 * @param {boolean} props.open - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {boolean} props.editable - Si se permite editar la cuerda
 * @param {Function} props.onSaveCuerda - Callback para guardar cambio de cuerda
 */
export default function InscripcionView({ 
  data, 
  open = false, 
  onClose, 
  editable = false,
  onSaveCuerda 
}) {
  const [editingCuerda, setEditingCuerda] = useState(false);
  const [nuevaCuerda, setNuevaCuerda] = useState("");

  if (!open || !data) return null;

  const handleSaveCuerda = async () => {
    if (onSaveCuerda && nuevaCuerda) {
      await onSaveCuerda(nuevaCuerda);
      setEditingCuerda(false);
      setNuevaCuerda("");
    }
  };

  return (
    <div className="pop-backdrop" onMouseDown={onClose}>
      <div 
        className="pop-dialog" 
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: 600 }}
      >
        <div className="pop-header">
          <h3 className="pop-title">Datos de Inscripción</h3>
          <button 
            className="icon-btn" 
            aria-label="Cerrar" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="pop-body">
          <div className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input 
                className="input" 
                value={data.nombre || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Apellido</label>
              <input 
                className="input" 
                value={data.apellido || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Tipo de Documento</label>
              <input 
                className="input" 
                value={data.tipoDocumento || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Nro. Documento</label>
              <input 
                className="input" 
                value={data.nroDocumento || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input 
                className="input" 
                value={data.email || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input 
                className="input" 
                value={data.telefono || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Fecha de Nacimiento</label>
              <input 
                className="input" 
                value={data.fechaNacimiento || ""} 
                readOnly 
                disabled 
              />
            </div>

            <div className="field">
              <label>Género</label>
              <input 
                className="input" 
                value={data.genero || ""} 
                readOnly 
                disabled 
              />
            </div>

            {editable && !editingCuerda && (
              <div className="field">
                <label>Cuerda</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    className="input" 
                    value={data.cuerda || ""} 
                    readOnly 
                    disabled 
                  />
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingCuerda(true);
                      setNuevaCuerda(data.cuerda || "");
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}

            {editable && editingCuerda && (
              <div className="field">
                <label>Cuerda</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    className="input" 
                    value={nuevaCuerda} 
                    onChange={(e) => setNuevaCuerda(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveCuerda}
                  >
                    Guardar
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingCuerda(false);
                      setNuevaCuerda("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {!editable && (
              <div className="field">
                <label>Cuerda</label>
                <input 
                  className="input" 
                  value={data.cuerda || ""} 
                  readOnly 
                  disabled 
                />
              </div>
            )}

            {data.direccion && (
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Dirección</label>
                <input 
                  className="input" 
                  value={data.direccion || ""} 
                  readOnly 
                  disabled 
                />
              </div>
            )}

            {data.observaciones && (
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Observaciones</label>
                <textarea 
                  className="input" 
                  value={data.observaciones || ""} 
                  rows={3}
                  readOnly 
                  disabled 
                />
              </div>
            )}
          </div>
        </div>

        <div className="pop-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
