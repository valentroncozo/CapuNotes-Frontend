import { useState } from 'react';
import './login.css';
import Form from 'react-bootstrap/Form';
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
        

        {/* Formulario */}
        <Form onSubmit={handleSubmit} className=" mb-3 formulario-login">
  
          <h1 className="logo-text">Iniciar Sesion en su cuenta de <strong>CapuNotes</strong></h1>
          <Form.Group className='mb-3 custom-input-group'>
            <Form.Control
              type="text"
              className="custom-input"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

              
        
          <div className="mb-3 custom-input-group">
            <input
              type="password"
              className="custom-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold">
            Ingresar
          </button>
        </Form>

      </div>

      <img
        src="../public/fondo.jpg"
        alt="fondo"
        className="img-fondo"
      />

    </main>
  );
}
