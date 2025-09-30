import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login({ setIsAuthenticated, setUsername }) {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (usernameInput.trim() && password.trim()) {
      // Establecer el estado de autenticación
      setUsername(usernameInput);
      setIsAuthenticated(true);
      // Navegar al principal
      navigate('/principal');
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  return (
    <div className="login-container">
      {/* Onda amarilla superior izquierda */}
      <div className="onda-amarilla">
        <svg viewBox="0 0 120 80" preserveAspectRatio="none">
          <path d="M0,0 Q80,0 120,60 Q60,80 0,80 Z" fill="#f3a21d" />
        </svg>
      </div>

      {/* Título */}
      <h1 className="logo-text">CapuNotes</h1>

      {/* Contenedor azul con onda en el borde superior */}
      <div className="login-form-onda">
        {/* La onda ahora está arriba del bloque */}
        <svg
          className="onda-superior"
          viewBox="0 0 500 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 Q125,0 250,50 Q375,100 500,30 L500,0 L0,0 Z"
            fill="#0d0c2b"
          />
        </svg>

        {/* Logo */}
        <img
          src="/Logo coro sin fondo.jpg"
          alt="Logo Coro"
          className="logo-coro"
        />

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="custom-input-group">
            <span
              className="custom-input-emoji"
              role="img"
              aria-label="usuario"
            >
              👤
            </span>
            <input
              type="text"
              className="custom-input"
              placeholder="Usuario"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>

          <div className="custom-input-group">
            <span
              className="custom-input-emoji"
              role="img"
              aria-label="contraseña"
            >
              👁️
            </span>
            <input
              type="password"
              className="custom-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-ingresar">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
