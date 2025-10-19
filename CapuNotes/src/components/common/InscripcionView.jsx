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
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Formulario de Inscripción"
      showHeaderClose={true}  // ✅ ahora con cruz en el header
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
      <div style={{ maxHeight: "80vh", overflow: "auto" }}>
        {/* contenido idéntico, no modificado */}
        <hr className="divisor-amarillo" />
        <h4 style={{ margin: "0 0 12px" }}>Datos personales:</h4>
        {/* ... resto del cuerpo sin cambios ... */}
      </div>
    </Modal>
  );
}
