import './menu.css';
import { useNavigate } from 'react-router-dom';

export default function Menu({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="menu-screen">
      {/* Hambur/Close opcional */}
      <button className="menu-close" onClick={onClose} aria-label="Cerrar menú">
        ✕
      </button>

      {/* Encabezado: logo + marca */}
      <header className="menu-top menu-top--hero">
        <img
          src="/Logo coro sin fondo.jpg"
          alt="Logo CapuNotes"
          className="menu-top__logo"
        />
        <span className="menu-top__brand">CapuNotes</span>
      </header>

      {/* Lista de opciones */}
      <nav className="menu-body">
        <ul className="menu-list">
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">🧾</span>
              <span className="menu-item__text">Asistencias</span>
            </button>
          </li>
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">🎤</span>
              <span className="menu-item__text">Audiciones</span>
            </button>
          </li>
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">🎵</span>
              <span className="menu-item__text">Canciones</span>
            </button>
          </li>
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">🗓️</span>
              <span className="menu-item__text">Eventos</span>
            </button>
          </li>
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">🤍</span>
              <span className="menu-item__text">Fraternidades</span>
            </button>
          </li>
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">👥</span>
              <span className="menu-item__text">Miembros</span>
            </button>
          </li>
          <li>
            <button
              className="menu-item"
              onClick={() => navigate('/organizacion-coro')}
            >
              <span className="menu-item__icon">🏛️</span>
              <span className="menu-item__text">Organización del Coro</span>
            </button>
          </li>
          <li>
            <button className="menu-item">
              <span className="menu-item__icon">⚙️</span>
              <span className="menu-item__text">Usuarios y Roles</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
