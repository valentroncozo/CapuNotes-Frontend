import Modal from "@/components/common/Modal";
import "@/styles/repertorios.css";
import RepertorioStarIcon from "@/components/icons/RepertorioStarIcon";
import { formatDate } from "@/components/common/datetime";

export default function RepertorioDetalleModal({ isOpen, onClose, repertorio }) {
  if (!repertorio) return null;

  const canciones = Array.isArray(repertorio.canciones)
    ? [...repertorio.canciones].sort((a, b) => (a.orden || 0) - (b.orden || 0))
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Repertorio${repertorio.nombre ? `: ${repertorio.nombre}` : ""}`}
    >
      <div className="repertorio-modal">
        <div className="repertorio-modal-body">
          <section className="repertorio-panel">
            <div className="repertorio-panel-header">
              <h4 className="repertorio-form-title">Resumen</h4>
              <div className="fav-check">
                <RepertorioStarIcon filled={repertorio.favorito} /> Favorito
              </div>
            </div>

            <p>
              <strong>Creación:</strong> {formatDate(repertorio.fechaCreacion)}
            </p>
            <p>
              <strong>Último ensayo:</strong>{" "}
              {formatDate(repertorio.fechaUltimoEnsayo) || "—"}
            </p>
            <p>
              <strong>Activo:</strong> {repertorio.activo ? "Sí" : "No"}
            </p>
            <p>
              <strong>Cantidad canciones:</strong> {repertorio.cantidadCanciones || canciones.length}
            </p>
          </section>

          <section className="repertorio-panel">
            <div className="repertorio-header grid">
              <span className="order">Ord.</span>
              <span>Título</span>
              <span className="actions-label">Orden</span>
            </div>
            <div className="panel-scroll repertorio-list">
              {canciones.length ? (
                canciones.map((song) => (
                  <div key={`detalle-${song.id}`} className="draggable-item">
                    <span className="order">{song.orden || "—"}</span>
                    <span>{song.titulo}</span>
                    <span>{song.orden || "—"}</span>
                  </div>
                ))
              ) : (
                <div className="list-empty">No hay canciones asignadas.</div>
              )}
            </div>
          </section>

          <div className="repertorio-footer">
            <button
              type="button"
              className="abmc-btn abmc-btn-primary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
