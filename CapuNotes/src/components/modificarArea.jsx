import { useState, useEffect } from "react";
import './organizacionCoro.css';

export default function ModificarArea({ show, onClose, area, onSave }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // 👇 cada vez que el área cambie, actualizamos el formulario
  useEffect(() => {
    if (area) {
      setNombre(area.name || "");          // fijate: en tu backend se llama "name"
      setDescripcion(area.description || "");
    }
  }, [area]);

  if (!show || !area) return null;

  const handleSubmit = (e) => {
  e.preventDefault();

  const updatedArea = {
    name,
    description,
  };

  onSave(updatedArea);
};


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="mb-3 text-white">Área</h2>
        <hr className="divisor-amarillo" />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">Nombre:</label>
            <input
              type="text"
              className="form-control organizacion-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Descripción:</label>
            <textarea
              className="form-control organizacion-input"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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

