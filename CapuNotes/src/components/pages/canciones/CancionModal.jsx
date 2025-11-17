import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Modal from "@/components/common/Modal";
import "@/styles/abmc.css";
import "@/styles/canciones.css";

export default function CancionModal({
  isOpen,
  onClose,
  mode = "create",
  initialData,
  onSubmit = () => {},
  categorias = [],
  tiempos = [],
}) {
  const [titulo, setTitulo] = useState("");
  const [letra, setLetra] = useState("");
  const [arregloUrl, setArregloUrl] = useState("");
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedTiempos, setSelectedTiempos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isViewMode = mode === "view";

  useEffect(() => {
    if (!isOpen) return;
    if ((mode === "edit" || mode === "view") && initialData) {
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
  }, [initialData, isOpen, mode]);

  const toggleCategoria = (id) => {
    if (isViewMode) return;
    setSelectedCategorias((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const toggleTiempo = (id) => {
    if (isViewMode) return;
    setSelectedTiempos((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    if (isViewMode) return;
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
      title: mode === "create" ? "Agregar canción" : "Actualizar canción",
      text:
        mode === "create"
          ? "Se agregará la nueva canción con los datos ingresados."
          : "Se actualizarán los datos de la canción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#DE9205",
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

  const modalTitle =
    mode === "create"
      ? "Agregar canción"
      : mode === "edit"
      ? "Editar canción"
      : "Visualizar canción";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      actions={
        isViewMode ? (
          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            onClick={onClose}
          >
            Cerrar
          </button>
        ) : (
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
              {mode === "create" ? "Agregar" : "Guardar"}
            </button>
          </>
        )
      }
    >
      <div className="cancion-modal-body">
        <div className="cancion-modal-scroll form-grid">
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              className="abmc-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              readOnly={isViewMode}
              placeholder="Título de la canción"
            />
          </div>
          <div className="field">
            <label htmlFor="letra">Letra</label>
            <textarea
              id="letra"
              className="abmc-input"
              value={letra}
              onChange={(e) => setLetra(e.target.value)}
              readOnly={isViewMode}
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
              readOnly={isViewMode}
              placeholder="https://"
            />
          </div>
          <div className="field">
            <label>Categorías</label>
            <div className="cancion-pill-list">
              {categorias.map((cat) => {
                const checked = selectedCategorias.includes(cat.id);
                return (
                  <label key={`cat-${cat.id}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategoria(cat.id)}
                      disabled={isViewMode}
                    />
                    {cat.nombre}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="field">
            <label>Tiempos litúrgicos</label>
            <div className="cancion-pill-list">
              {tiempos.map((tiempo) => {
                const checked = selectedTiempos.includes(tiempo.id);
                return (
                  <label key={`tiempo-${tiempo.id}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTiempo(tiempo.id)}
                      disabled={isViewMode}
                    />
                    {tiempo.nombre}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
