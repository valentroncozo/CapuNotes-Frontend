import React from "react";
import "@/styles/globals.css";
import "@/styles/popup.css";

const PopUpEventos = ({
  modo = "crear",
  eventoSeleccionado,
  onClose,
  onSave,
}) => {
  const isViewMode = modo === "ver";

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nuevoEvento = {
      nombre: formData.get("nombre"),
      tipoEvento: formData.get("tipoEvento"),
      fechaInicio: formData.get("fechaInicio"),
      hora: formData.get("hora"),
      lugar: formData.get("lugar"),
    };

    // Normalizar hora (añadir :00 si falta)
    if (nuevoEvento.hora?.length === 5) {
      nuevoEvento.hora += ":00";
    }

    onSave(nuevoEvento);
  };

  return (
    <div className="popup-container" style={{ overflow: "auto", maxHeight: "95vh" }}>
      <header className="abmc-header">
        <div className="abmc-title">
          <h1>
            {modo === "crear"
              ? "Crear Evento"
              : modo === "editar"
              ? "Modificar Evento"
              : "Visualizar Evento"}
          </h1>
        </div>
      </header>

      <hr className="divisor-amarillo" />

      <form className="popup-form" onSubmit={handleSubmit}>
        <div className="popup-grid">
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              defaultValue={eventoSeleccionado?.nombre || ""}
              disabled={isViewMode}
            />
          </div>

          <div className="field">
            <label>Tipo de evento</label>
            <select
              name="tipoEvento"
              defaultValue={eventoSeleccionado?.tipoEvento || ""}
              disabled={isViewMode}
            >
              <option value="">Seleccionar</option>
              <option value="ENSAYO">Ensayo</option>
              <option value="PRESENTACION">Presentación</option>
            </select>
          </div>

          <div className="field-inline">
            <div className="field">
              <label>Fecha</label>
              <input
                type="date"
                name="fechaInicio"
                defaultValue={eventoSeleccionado?.fechaInicio || ""}
                disabled={isViewMode}
              />
            </div>

            <div className="field">
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                defaultValue={eventoSeleccionado?.hora || ""}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="field">
            <label>Lugar</label>
            <input
              type="text"
              name="lugar"
              defaultValue={eventoSeleccionado?.lugar || ""}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="popup-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            Cancelar
          </button>
          {!isViewMode && (
            <button type="submit" className="btn-primary">
              Aceptar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PopUpEventos;
