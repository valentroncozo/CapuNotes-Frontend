import { useState } from "react";
import AreaEditPopup from "./AreaEditPopup.jsx";
import "../../styles/popup-lab.css";

export default function PopupLab() {
  const [areas, setAreas] = useState([
    { id: "adm", nombre: "Administración", descripcion: "Gestión y trámites del coro." },
    { id: "com", nombre: "Comunicación", descripcion: "Redes, prensa y difusión." },
    { id: "log", nombre: "Logística", descripcion: "Eventos, traslados y materiales." },
  ]);

  const [open, setOpen] = useState(false);
  const [areaSel, setAreaSel] = useState(null);

  const openPopup = (area) => { setAreaSel(area); setOpen(true); };

  const handleSave = ({ id, nombre, descripcion }) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, nombre, descripcion } : a)));
  };

  return (
    <div className="lab-page">
      <div className="lab-card">
        <h1 className="lab-title">Laboratorio: Edición de Áreas</h1>
        <p className="lab-text" style={{ marginBottom: 12 }}>
          Probá el pop-up para modificar <strong>nombre</strong> y <strong>descripción</strong> de un área.
        </p>

        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle" style={{ borderRadius: "var(--radius)", overflow: "hidden" }}>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>ID</th>
                <th style={{ width: "25%" }}>Nombre</th>
                <th>Descripción</th>
                <th style={{ width: "140px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.id}>
                  <td><code>{a.id}</code></td>
                  <td>{a.nombre}</td>
                  <td>{a.descripcion || "—"}</td>
                  <td>
                    <button
                      className="btn btn-primary capu-btn"
                      onClick={() => openPopup(a)}
                      title="Editar área"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">No hay áreas cargadas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AreaEditPopup
        isOpen={open}
        onClose={() => { setOpen(false); setAreaSel(null); }}
        area={areaSel}
        onSave={handleSave}
      />
    </div>
  );
}
