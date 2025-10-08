import { useState } from 'react';
import './login.css';
import WavyClipPath from './WavyClipPath';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <main className="login-container">

      <WavyClipPath/>

      {/* Bloque azul con onda */}
      <div className="login-form-container"> 
        
        <h1 className="logo-text">Iniciar Sesion en su cuenta de <strong>CapuNotes</strong></h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="formulario-login">
    

          <div className="custom-input-group mb-3">
            <span
              className="custom-input-emoji"
              role="img"
              aria-label="usuario"
            >
              👤
            </span>
            <input
              type="text"
              className="custom-input form-control bg-transparent border-0 text-white"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="custom-input-group mb-3">
            <span
              className="custom-input-emoji"
              role="img"
              aria-label="contraseña"
            >
              👁️
            </span>
            <input
              type="password"
              className="custom-input form-control bg-transparent border-0 text-white"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold">
            Ingresar
          </button>
        </form>

      </div>

      <img
        src="../public/fondo.jpg"
        alt="fondo"
        className="img-fondo"
      />

    </main>
  );
}
