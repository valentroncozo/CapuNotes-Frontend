import Modal from "@/components/common/Modal";
import "@/styles/abmc.css";
import StarIcon from "@/assets/StarIcon";
import { formatDate } from "@/components/common/datetime";

export default function RepertorioDetalleModal({ isOpen, onClose, repertorio }) {
  if (!repertorio) return null;

  const canciones =
    Array.isArray(repertorio.canciones) && repertorio.canciones.length
      ? [...repertorio.canciones].sort((a, b) => (a.orden || 0) - (b.orden || 0))
      : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Repertorio${repertorio.nombre ? `: ${repertorio.nombre}` : ""}`}
      actions={
        <button
          type="button"
          className="abmc-btn abmc-btn-primary"
          onClick={onClose}
        >
          Cerrar
        </button>
      }
    >
      <div className="form-grid" style={{ maxHeight: "50vh", overflowY: "auto" }}>
        <div className="field">
          <label>Nombre</label>
          <p>{repertorio.nombre || "—"}</p>
        </div>
        <div className="field">
          <label>Favorito</label>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <StarIcon filled={repertorio.favorito} color={repertorio.favorito ? "#fff" : "#ffc107"} />
            <span>{repertorio.favorito ? "Sí" : "No"}</span>
          </div>
        </div>
        <div className="field">
          <label>Creación</label>
          <p>{formatDate(repertorio.fechaCreacion) || "—"}</p>
        </div>
        <div className="field">
          <label>Último ensayo</label>
          <p>{formatDate(repertorio.fechaUltimoEnsayo) || "—"}</p>
        </div>
        <div className="field">
          <label>Estado</label>
          <p>{repertorio.activo ? "Activo" : "Inactivo"}</p>
        </div>
        <div className="field">
          <label>Cantidad de canciones</label>
          <p>{repertorio.cantidadCanciones ?? canciones.length ?? 0}</p>
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Canciones</label>
          {canciones.length ? (
            <ul className="abmc-list">
              {canciones.map((song) => (
                <li key={`det-${song.id}`} style={{ display: "flex", gap: "1rem" }}>
                  <strong>{song.orden}.</strong>
                  <span>{song.titulo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin canciones asignadas.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
