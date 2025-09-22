import './organizacionCoro.css';

export default function ModificarArea({ show, onClose, area }) {
  if (!show || !area) return null; // No se renderiza si está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="mb-3 text-white">Área</h2>
        <hr className="divisor-amarillo" />

        <form>
          <div className="mb-3">
            <label className="form-label text-white">Nombre:</label>
            <input
              type="text"
              className="form-control organizacion-input"
              defaultValue={area.nombre}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Descripción:</label>
            <textarea
              className="form-control organizacion-input"
              defaultValue={area.descripcion}
              rows="3"
            ></textarea>
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

