// src/pages/PopupLab.jsx
import { useState } from "react";
import AreaEditPopup from "../components/AreaEditPopup"; // <-- nuevo popup para Áreas
import "./popup-lab.css";

export default function PopupLab() {
  // Áreas de prueba (simulan lo que tendría tu sistema)
  const [areas, setAreas] = useState([
    { id: "adm", nombre: "Administración", descripcion: "Gestión y trámites del coro." },
    { id: "com", nombre: "Comunicación", descripcion: "Redes, prensa y difusión." },
    { id: "log", nombre: "Logística", descripcion: "Eventos, traslados y materiales." },
  ]);

  // Estado del pop-up de edición de área
  const [open, setOpen] = useState(false);
  const [areaSel, setAreaSel] = useState(null);

  const openPopup = (area) => {
    setAreaSel(area);
    setOpen(true);
  };

  const handleSave = ({ id, nombre, descripcion }) => {
    // Actualiza el arreglo local (en tu app real acá iría el PUT/PATCH a backend)
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, nombre, descripcion } : a))
    );
  };

  return (
    <div className="lab-page">
      {/* === NavBar estándar requerido (según guía) === */}
      <div>
        <nav className="navbar fixed-top w-100 navbar-dark" style={{ padding: "10px" }}>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasMenu"
          aria-labelledby="offcanvasMenuLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <a className="nav-link" href="#">Inicio</a>
            <a className="nav-link" href="#">Asistencias</a>
            <a className="nav-link" href="#">Audiciones</a>
            <a className="nav-link" href="#">Canciones</a>
            <a className="nav-link" href="#">Eventos</a>
            <a className="nav-link" href="#">Fraternidades</a>
            <a className="nav-link" href="#">Miembros</a>
            <a className="nav-link" href="#">Organización del Coro</a>
            <a className="nav-link" href="#">Usuarios y roles</a>
          </div>
        </div>

        {/* separador para que el contenido no quede debajo del navbar */}
        <div style={{ marginTop: "60px" }}></div>
      </div>

      {/* === Contenido del laboratorio: listado de Áreas con botón Editar === */}
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

      {/* Pop-up de edición de Área (sin NavBar dentro) */}
      <AreaEditPopup
        isOpen={open}
        onClose={() => { setOpen(false); setAreaSel(null); }}
        area={areaSel}
        onSave={handleSave}
      />
    </div>
  );
}
