// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({
  title = 'Título',
  showMenuButton = true,
  showCloseButton = true,
  onMenuClick = null,
  onCloseClick = null,
  logoSize = 'normal', // 'small', 'normal', 'large'
}) => {
  const navigate = useNavigate();

  // Función por defecto para el botón menú
  const handleDefaultMenu = () => {
    navigate(-1); // Volver atrás por defecto
  };

  // Función por defecto para el botón cerrar
  const handleDefaultClose = () => {
    window.scrollTo(0, 0);
    navigate('/');
  };

  return (
    <>
      {/* Header */}
      <div className="standard-header">
        {/* Botón izquierda (menú) */}
        <div className="header-left">
          {showMenuButton && (
            <button
              className="menu-button"
              onClick={onMenuClick || handleDefaultMenu}
            >
              <div className="menu-icon">
                <div className="menu-bar"></div>
                <div className="menu-bar"></div>
                <div className="menu-bar"></div>
              </div>
            </button>
          )}
        </div>

        {/* Centro - Logo + Título (MISMA LÍNEA HORIZONTAL) */}
        <div className="header-center">
          <img
            src="/Logo coro sin fondo.jpg"
            alt="Logo"
            className={`header-logo ${logoSize}`}
          />
          <h1 className="header-title">{title}</h1>
        </div>

        {/* Botón derecha (cerrar) */}
        <div className="header-right">
          {showCloseButton && (
            <button
              className="close-button"
              onClick={onCloseClick || handleDefaultClose}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Línea divisora amarilla */}
      <hr className="header-divider" />
    </>
  );
};

export default Header;
