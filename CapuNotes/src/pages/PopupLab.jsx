import { useState } from "react";
import AreaEditPopup from "../components/AreaEditPopup"; // ajustá la ruta si lo guardaste en otro lado
import "./popup-lab.css";

export default function PopupLab() {
  // Áreas de prueba
  const AREAS = [
    { id: "adm", nombre: "Administración" },
    { id: "com", nombre: "Comunicación" },
    { id: "log", nombre: "Logística" },
  ];

  // Miembro demo para probar el pop-up
  const [member, setMember] = useState({
    id: 1,
    nombre: "Miembro",
    apellido: "Demo",
    areaId: "adm",
  });

  const [open, setOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleSave = ({ memberId, areaId }) => {
    // Solo para demo: actualizamos el estado local
    setMember((m) => ({ ...m, areaId }));
    setLastSaved({ memberId, areaId });
  };

  return (
    <div className="lab-page">
      {/* === NavBar estándar requerido (según guía) === */}
      <div>
        <nav
          className="navbar fixed-top w-100 navbar-dark"
          style={{ padding: "10px" }}
        >
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
            <h5 className="offcanvas-title" id="offcanvasMenuLabel">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
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

        {/* Esto evita que el contenido quede por debajo del navbar */}
        <div style={{ marginTop: "60px" }}></div>
      </div>

      {/* === Contenido del laboratorio === */}
      <div className="lab-card">
        <h1 className="lab-title">Laboratorio de Pop-up de Área</h1>

        <div className="lab-row">
          <div>
            <p className="lab-text">
              <strong>Miembro:</strong> {member.nombre} {member.apellido}
            </p>
            <p className="lab-text">
              <strong>Área actual:</strong>{" "}
              {AREAS.find((a) => a.id === member.areaId)?.nombre ?? "—"}
            </p>
          </div>

          <div className="lab-actions">
            <button
              className="btn btn-primary capu-btn"
              onClick={() => setOpen(true)}
            >
              Abrir pop-up
            </button>
            <button
              className="btn btn-secondary capu-btn-secondary"
              onClick={() =>
                setMember((m) => ({ ...m, areaId: "com" }))
              }
            >
              Setear área = Comunicación (demo)
            </button>
          </div>
        </div>

        {lastSaved && (
          <div className="lab-note">
            Último guardado → memberId={lastSaved.memberId}, areaId={lastSaved.areaId}
          </div>
        )}
      </div>

      {/* Pop-up (sin NavBar dentro, como indica la guía) */}
      <AreaEditPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        member={member}
        areas={AREAS}
        onSave={handleSave}
      />
    </div>
  );
}
