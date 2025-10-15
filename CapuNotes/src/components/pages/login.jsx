import { useState } from 'react';
import '../../styles/login.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import WavyClipPath from '../../assets/WavyClipPath';
import MobileWavyClipPath from '../../assets/MobileWavyClipPath';
import AccountUser from '../../assets/AccountUserIcon';
import PasswordToggleIcon from '../../assets/PasswordToggleIcon';
import { validateLoginFields, hasErrors } from '../utils/validators';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ usuario: null, contraseña: null });

  const runValidation = (nextState) => {
    const nextErrors = validateLoginFields(nextState);
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = runValidation({ username, password });
    if (isValid) onLogin(username, password);
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Usuario') setUsername(value);
    if (name === 'Contraseña') setPassword(value);

    const draft = {
      username: name === 'Usuario' ? value : username,
      password: name === 'Contraseña' ? value : password,
    };
    runValidation(draft);
  };

  return (
    <main className="login-container">
      <WavyClipPath />
      <div className="login-form-container">
        <MobileWavyClipPath />

        <Form onSubmit={handleSubmit} noValidate className="formulario-login">
          <h1 className="logo-text">
            Iniciar sesión en su cuenta de <strong>CapuNotes </strong>
            {/* ✅ Logo actualizado sin espacio ni carpeta /public */}
            <img
              src="/logo-coro-sin-fondo.png"
              alt="Logo"
              className="logo-coro"
            />
          </h1>

          <Form.Group className="custom-input-group">
            <AccountUser className="account-icon" />
            <Form.Control
              type="text"
              className="custom-input"
              placeholder="Usuario"
              value={username}
              onChange={handleInputChange}
              name="Usuario"
              required
            />
          </Form.Group>
          <p className="menssaje-error-login">{errors.usuario}</p>

          <Form.Group className="custom-input-group">
            <PasswordToggleIcon isVisible={showPassword} onToggle={togglePasswordVisibility} />
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              className="custom-input"
              placeholder="Contraseña"
              value={password}
              onChange={handleInputChange}
              name="Contraseña"
              required
            />
          </Form.Group>
          <p className="menssaje-error-login">{errors.contraseña}</p>

          <Form.Group className="custom-input-group">
            <Button type="submit" className="button-login">
              Ingresar
            </Button>
          </Form.Group>
        </Form>
      </div>

      <img src="/fondo.jpg" alt="fondo" className="img-fondo" />
    </main>
  );
}
