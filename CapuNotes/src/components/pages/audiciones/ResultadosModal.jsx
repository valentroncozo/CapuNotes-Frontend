// src/components/pages/audiciones/ResultadosModal.jsx
import { useEffect, useMemo, useState } from "react";
import "@/styles/popup.css";     // estilos del popup estándar
import "@/styles/forms.css";
import "@/styles/icons.css";

/* Íconos de resultado */
import AceptadoIcon from "@/assets/icons/resultado/AceptadoIcon.jsx";
import RechazadoIcon from "@/assets/icons/resultado/RechazadoIcon.jsx";
import AusenteIcon from "@/assets/icons/resultado/AusenteIcon.jsx";
import SinResultadoIcon from "@/assets/icons/resultado/SinResultadoIcon.jsx";

export default function ResultadosModal({ row, onClose, onSave }) {
  const [estado, setEstado] = useState("sin");
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initial = String(row?.resultado?.estado || "sin").toLowerCase();
    setEstado(initial);
    setObs(row?.resultado?.obs || "");
  }, [row]);

  const PreviewIcon = useMemo(() => {
    const e = String(estado || "sin").toLowerCase();
    if (e === "aceptado" || e === "aceptada" || e === "ok")
      return () => (
        <span className="icon-estado icon-estado--ok icon-md" title="Aceptado">
          <AceptadoIcon />
        </span>
      );
    if (e === "rechazado" || e === "rechazada" || e === "bad")
      return () => (
        <span className="icon-estado icon-estado--bad icon-md" title="Rechazado">
          <RechazadoIcon />
        </span>
      );
    if (e === "ausente" || e === "pend")
      return () => (
        <span className="icon-estado icon-estado--pend icon-md" title="Ausente">
          <AusenteIcon />
        </span>
      );
    return () => (
      <span className="icon-estado icon-estado--sin icon-md" title="Sin resultado">
        <SinResultadoIcon />
      </span>
    );
  }, [estado]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (saving) return;
    setSaving(true);
    try {
      await onSave?.(estado, obs);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pop-backdrop" onMouseDown={onClose}>
      <div className="pop-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="pop-header">
          <h3 className="pop-title">Editar resultado</h3>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pop-body">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="estado">Resultado</label>
                <select
                  id="estado"
                  className="input"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="sin">Sin resultado</option>
                  <option value="aceptado">Aceptado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="ausente">Ausente</option>
                </select>

                {/* Previsualización solo ícono */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <PreviewIcon />
                  <small style={{ opacity: .8 }}>Resultado seleccionado</small>
                </div>
              </div>

              <div className="field">
                <label htmlFor="obs">Observaciones</label>
                <textarea
                  id="obs"
                  className="input"
                  rows={3}
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Notas opcionales…"
                />
              </div>
            </div>
          </div>

          <div className="pop-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className={`btn ${saving ? "btn-disabled" : "btn-primary"}`} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
