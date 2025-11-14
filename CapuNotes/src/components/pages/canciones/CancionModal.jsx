import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import Modal from "@/components/common/Modal";
import "@/styles/abmc.css";

export default function CancionModal({
  isOpen,
  onClose,
  mode = "create",
  initialData,
  onSubmit,
  categorias = [],
  tiempos = [],
}) {
  const [titulo, setTitulo] = useState("");
  const [letra, setLetra] = useState("");
  const [arregloUrl, setArregloUrl] = useState("");
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedTiempos, setSelectedTiempos] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialData) {
      setTitulo(initialData.titulo || "");
      setLetra(initialData.letra || "");
      setArregloUrl(initialData.arregloUrl || "");
      setSelectedCategorias(initialData.categoriaIds || []);
      setSelectedTiempos(initialData.tiempoLiturgicoIds || []);
    } else {
      setTitulo("");
      setLetra("");
      setArregloUrl("");
      setSelectedCategorias([]);
      setSelectedTiempos([]);
    }
    setPreviewOpen(false);
  }, [initialData, isOpen, mode]);

  const toggleCategoria = (id) => {
    setSelectedCategorias((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const toggleTiempo = (id) => {
    setSelectedTiempos((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const textoPreview = useMemo(() => letra || "", [letra]);

  const handleSave = async () => {
    if (!titulo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "El título es obligatorio.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }
    if (!letra.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "La letra es obligatoria.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: mode === "create" ? "Crear canción" : "Actualizar canción",
      text:
        mode === "create"
          ? "Se guardará la nueva canción con los datos ingresados."
          : "Se actualizarán los datos de la canción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);
    try {
      await onSubmit(mode, {
        titulo: titulo.trim(),
        letra: letra.trim(),
        arregloUrl: arregloUrl?.trim() || "",
        categoriaIds: selectedCategorias,
        tiempoLiturgicoIds: selectedTiempos,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === "create" ? "Nueva canción" : "Editar canción"}
        actions={
          <>
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="abmc-btn abmc-btn-primary"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {mode === "create" ? "Crear" : "Guardar"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              className="abmc-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la canción"
            />
          </div>
          <div className="field">
            <label htmlFor="letra">Letra</label>
            <textarea
              id="letra"
              className="abmc-input"
              rows="5"
              value={letra}
              onChange={(e) => setLetra(e.target.value)}
              placeholder="Escribí la letra o pegala aquí"
            />
          </div>
          <div className="field">
            <label htmlFor="arreglo">URL de arreglo</label>
            <input
              id="arreglo"
              className="abmc-input"
              value={arregloUrl}
              onChange={(e) => setArregloUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          <div className="field">
            <label>Categorías</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                padding: "0.25rem 0",
              }}
            >
              {categorias.map((cat) => {
                const checked = selectedCategorias.includes(cat.id);
                return (
                  <label
                    key={`cat-${cat.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategoria(cat.id)}
                    />
                    {cat.nombre}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="field">
            <label>Tiempos litúrgicos</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                padding: "0.25rem 0",
              }}
            >
              {tiempos.map((tiempo) => {
                const checked = selectedTiempos.includes(tiempo.id);
                return (
                  <label
                    key={`tiempo-${tiempo.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTiempo(tiempo.id)}
                    />
                    {tiempo.nombre}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="field">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={() => setPreviewOpen(true)}
            >
              Vista previa de letra
            </button>
          </div>
        </div>
      </Modal>

      <LetraPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        letra={textoPreview}
      />
    </>
  );
}

function LetraPreviewModal({ isOpen, onClose, letra }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vista previa de la letra"
      actions={
        <>
          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </>
      }
    >
      <div style={{ whiteSpace: "pre-line", minHeight: "120px" }}>
        {letra || "No hay letra definida para previsualizar."}
      </div>
    </Modal>
  );
}
