import "./menu.css";
import { useState } from "react";

export default function Menu() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {/* Botón hamburguesa visible solo en móviles */}
      <button
        className="btn btn-outline-light d-md-none menu-toggle"
        onClick={() => setAbierto(!abierto)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${abierto ? "open" : ""}`}>
        <div className="menu-header">
          <img
            src="/Logo coro sin fondo.jpg"
            alt="Logo"
            className="menu-logo"
          />
          <h3 className="menu-title">CapuNotes</h3>
        </div>

        <ul className="list-unstyled menu-list">
          <li>
            <button className="btn btn-primary w-100">📋 Asistencias</button>
          </li>
          <li>
            <button className="btn btn-primary w-100">🎤 Audiciones</button>
          </li>
          <li>
            <button className="btn btn-primary w-100">🎶 Canciones</button>
          </li>
          <li>
            <button className="btn btn-primary w-100">📅 Eventos</button>
          </li>
          <li>
            <button className="btn btn-primary w-100">🤝 Fraternidades</button>
          </li>
          <li>
            <button className="btn btn-primary w-100">👥 Miembros</button>
          </li>
          <li>
            <button className="btn btn-primary w-100">
              🏛 Organización del Coro
            </button>
          </li>
          <li>
            <button className="btn btn-primary w-100">⚙️ Usuarios y Roles</button>
          </li>
        </ul>
      </div>
    </>
  );
}
