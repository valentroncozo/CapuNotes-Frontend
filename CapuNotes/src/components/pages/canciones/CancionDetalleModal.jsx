import Modal from "@/components/common/Modal";
import "@/styles/abmc.css";

export default function CancionDetalleModal({ isOpen, onClose, cancion }) {
  if (!cancion) return null;

  const categorias = Array.isArray(cancion.categoriasNombres)
    ? cancion.categoriasNombres.filter(Boolean).join(", ")
    : "";

  const tiempos = Array.isArray(cancion.tiemposLiturgicosNombres)
    ? cancion.tiemposLiturgicosNombres.filter(Boolean).join(", ")
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Canción${cancion.titulo ? `: ${cancion.titulo}` : ""}`}
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
      <div className="form-grid">
        <div className="field">
          <label>Título</label>
          <p>{cancion.titulo || "—"}</p>
        </div>
        <div className="field">
          <label>Letra</label>
          <p style={{ whiteSpace: "pre-line" }}>{cancion.letra || "—"}</p>
        </div>
        <div className="field">
          <label>Arreglo URL</label>
          {cancion.arregloUrl ? (
            <a
              href={cancion.arregloUrl}
              target="_blank"
              rel="noreferrer"
              className="abmc-link"
            >
              {cancion.arregloUrl}
            </a>
          ) : (
            <p>—</p>
          )}
        </div>
        <div className="field">
          <label>Categorías</label>
          <p>{categorias || "—"}</p>
        </div>
        <div className="field">
          <label>Tiempos</label>
          <p>{tiempos || "—"}</p>
        </div>
        <div className="field">
          <label>Estado</label>
          <p>{cancion.activo ? "Activo" : "Inactivo"}</p>
        </div>
      </div>
    </Modal>
  );
}
