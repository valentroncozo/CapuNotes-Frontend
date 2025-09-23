import './agregarModificarMiembro.css';

export default function AgregarCuerda({ show, onClose, cuerda }) {
  if (!show || !cuerda) return null; // No se renderiza si está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="mb-3 text-white">Cuerda</h2>
        <hr className="divisor-amarillo" />

        <form>
          <div className="mb-3">
            <label className="form-label text-white">Nombre:</label>
            <input
              type="text"
              className="form-control organizacion-input"
              defaultValue={cuerda.nombre}
            />
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-secondary w-50"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-warning w-50">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
