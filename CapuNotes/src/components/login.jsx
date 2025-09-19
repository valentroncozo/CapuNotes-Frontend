import { useState } from 'react';
import './login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-container">
      {/* Onda amarilla superior izquierda */}
      <div className="onda-amarilla">
        <svg
          viewBox="0 0 120 80"
          width="120"
          height="80"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q80,0 120,60 Q60,80 0,80 Z" fill="#f3a21d" />
        </svg>
      </div>

      {/* Título sobre la imagen */}
      <h1 className="logo-text">CapuNotes</h1>

      {/* Onda azul */}
      <div className="onda-superior">
        <svg
          viewBox="0 0 340 80"
          width="340"
          height="80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 Q85,0 170,40 Q255,80 340,20 L340,0 L0,0 Z"
            fill="#0d0c2b"
          />
        </svg>
      </div>

      <div className="login-form-onda">
        {/* Logo centrado arriba del bloque azul */}
        <img
          src="/Logo coro sin fondo.jpg"
          alt="Logo Coro"
          className="logo-coro"
        />

        {/* 👉 Formulario con estados y submit */}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)} // ✅ guarda en estado
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
              onChange={(e) => setPassword(e.target.value)} // ✅ guarda en estado
            />
          </div>

          <button type="submit" className="btn-ingresar w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
