import { useState } from "react";
import "@/styles/login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";

import WavyClipPath from "@/assets/WavyClipPath.jsx";
import MobileWavyClipPath from "@/assets/MobileWavyClipPath.jsx";
import AccountUser from "@/assets/AccountUserIcon.jsx";
import PasswordToggleIcon from "@/assets/PasswordToggleIcon.jsx";

import {
  validateLoginFields,
  hasErrors,
} from "@/components/common/validators.js";

export default function Login({ onLogin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // LOGIN
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ usuario: null, contraseña: null });

  // REGISTER
  const [regNombre, setRegNombre] = useState("");
  const [regApellido, setRegApellido] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRepeatPassword, setRegRepeatPassword] = useState("");
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowPassword2, setRegShowPassword2] = useState(false);

  // 🔥 VARIABLE EN DURO PARA SIMULAR RESULTADO DEL REGISTRO
  // true = éxito | false = error
  const registroExitoso = true; // CAMBIAR A false PARA PROBAR EL OTRO CASO

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const runValidation = (nextState) => {
    const nextErrors = validateLoginFields(nextState);
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRegisterMode) {
      const isValid = runValidation({ username, password });
      if (isValid) onLogin(username, password);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "Usuario") setUsername(value);
    if (name === "Contraseña") setPassword(value);

    runValidation({
      username: name === "Usuario" ? value : username,
      password: name === "Contraseña" ? value : password,
    });
  };

  // VALIDACIONES REGISTRO
  const regPasswordRules = {
    min: regPassword.length >= 8,
    mayus: /[A-Z]/.test(regPassword),
    numero: /[0-9]/.test(regPassword),
    especial: /[^A-Za-z0-9]/.test(regPassword),
  };

  const regPasswordValid = Object.values(regPasswordRules).every((v) => v);
  const regRepeatMatch =
    regPassword.length > 0 && regPassword === regRepeatPassword;

  const isRegisterFormValid =
    regNombre.trim() !== "" &&
    regApellido.trim() !== "" &&
    regPasswordValid &&
    regRepeatMatch;

  // 🔥 FUNCIÓN PARA HACER REGISTRO
  const handleRegister = async () => {
    if (!isRegisterFormValid) return;

    if (registroExitoso) {
      await Swal.fire({
        icon: "success",
        title: "Usuario registrado correctamente",
        text: `${regNombre} ${regApellido} fue creado exitosamente.`,
        confirmButtonColor: "#DE9205",
        background: "#11103a",
        color: "#E8EAED",
      });

      // Después de cerrar el modal → vuelve al login
      setIsRegisterMode(false);

      // Setea "Usuario" con nombre + apellido
      setUsername(`${regNombre.trim()} ${regApellido.trim()}`);

      // Limpia datos del registro
      setRegNombre("");
      setRegApellido("");
      setRegPassword("");
      setRegRepeatPassword("");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error al registrar el usuario",
        text: "Ocurrió un error inesperado.",
        confirmButtonColor: "#DE9205",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  return (
    <main className="login-container">
      <WavyClipPath />
      <div className="login-form-container">
        <MobileWavyClipPath />

        <Form onSubmit={handleSubmit} noValidate className="formulario-login">
          {/* LOGIN */}
          {!isRegisterMode && (
            <>
              <h1 className="logo-text">
                Iniciar sesión en su cuenta de <strong>CapuNotes </strong>
                <img
                  src="/logo-coro-sin-fondo.png"
                  alt="Logo"
                  className="logo-coro"
                />
              </h1>

              {/* USUARIO */}
              <Form.Group className="custom-input-group">
                <AccountUser className="account-icon" />
                <Form.Control
                  type="text"
                  className={`custom-input ${
                    username.trim() ? "valid" : "invalid"
                  }`}
                  placeholder="Usuario"
                  value={username}
                  onChange={handleInputChange}
                  name="Usuario"
                  required
                />
              </Form.Group>
              <p className="menssaje-error-login">{errors.usuario}</p>

              {/* CONTRASEÑA */}
              <Form.Group className="custom-input-group">
                <PasswordToggleIcon
                  isVisible={showPassword}
                  onToggle={togglePasswordVisibility}
                />
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  className={`custom-input ${
                    password.trim() ? "valid" : "invalid"
                  }`}
                  placeholder="Contraseña"
                  value={password}
                  onChange={handleInputChange}
                  name="Contraseña"
                  required
                />
              </Form.Group>
              <p className="menssaje-error-login">{errors.contraseña}</p>

              {/* BOTONES */}
              <Form.Group className="custom-input-group">
                <Button type="submit" className="button-login">
                  Ingresar
                </Button>
              </Form.Group>

              <Form.Group className="custom-input-group">
                <Button
                  className="button-login"
                  onClick={() => setIsRegisterMode(true)}
                >
                  Registrar
                </Button>
              </Form.Group>
            </>
          )}

          {/* REGISTRO */}
          {isRegisterMode && (
            <>
              <h1 className="logo-text">
                Registrar su cuenta de <strong>CapuNotes</strong>
              </h1>

              {/* NOMBRE */}
              <Form.Group className="custom-input-group">
                <Form.Control
                  type="text"
                  className={`custom-input validate-input ${
                    regNombre.trim() ? "valid" : "invalid"
                  }`}
                  placeholder="Nombre"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                />
              </Form.Group>

              {/* APELLIDO */}
              <Form.Group className="custom-input-group">
                <Form.Control
                  type="text"
                  className={`custom-input validate-input ${
                    regApellido.trim() ? "valid" : "invalid"
                  }`}
                  placeholder="Apellido"
                  value={regApellido}
                  onChange={(e) => setRegApellido(e.target.value)}
                />
              </Form.Group>

              {/* CONTRASEÑA */}
              <Form.Group className="custom-input-group">
                <PasswordToggleIcon
                  isVisible={regShowPassword}
                  onToggle={() => setRegShowPassword((v) => !v)}
                />
                <Form.Control
                  type={regShowPassword ? "text" : "password"}
                  className={`custom-input validate-input ${
                    regPasswordValid ? "valid" : "invalid"
                  }`}
                  placeholder="Contraseña"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </Form.Group>

              {/* REGLAS */}
              <ul style={{ fontSize: 12, marginTop: 5, marginBottom: -5 }}>
                <li style={{ color: regPasswordRules.min ? "green" : "gray" }}>
                  Mínimo 8 caracteres
                </li>
                <li style={{ color: regPasswordRules.mayus ? "green" : "gray" }}>
                  Al menos una mayúscula
                </li>
                <li
                  style={{ color: regPasswordRules.numero ? "green" : "gray" }}
                >
                  Al menos un número
                </li>
                <li
                  style={{
                    color: regPasswordRules.especial ? "green" : "gray",
                  }}
                >
                  Al menos un caracter especial
                </li>
              </ul>

              {/* REPETIR CONTRASEÑA */}
              <Form.Group className="custom-input-group">
                <PasswordToggleIcon
                  isVisible={regShowPassword2}
                  onToggle={() => setRegShowPassword2((v) => !v)}
                />
                <Form.Control
                  type={regShowPassword2 ? "text" : "password"}
                  className={`custom-input validate-input ${
                    regRepeatMatch ? "valid" : "invalid"
                  }`}
                  placeholder="Repetir contraseña"
                  value={regRepeatPassword}
                  onChange={(e) => setRegRepeatPassword(e.target.value)}
                />
              </Form.Group>

              {/* BOTÓN REGISTRAR */}
              <Form.Group className="custom-input-group">
                <Button
                  className="button-login"
                  disabled={!isRegisterFormValid}
                  onClick={handleRegister}
                >
                  Registrar
                </Button>
              </Form.Group>

              {/* VOLVER */}
              <Form.Group className="custom-input-group">
                <Button
                  className="button-login"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setRegNombre("");
                    setRegApellido("");
                    setRegPassword("");
                    setRegRepeatPassword("");
                  }}
                >
                  Volver
                </Button>
              </Form.Group>
            </>
          )}
        </Form>
      </div>

      <img
        src="/fondo.jpg"
        alt="Decorative background"
        className="img-fondo"
      />
    </main>
  );
}
