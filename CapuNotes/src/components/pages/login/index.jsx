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

import { usuariosService } from "@/services/usuariosService.js";

// ⭐ IMPORTAR CONTEXTO
import { useUser } from "@/context/UserContext.jsx";
import { useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser(); // <- esta es la función válida del contexto

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

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const runValidation = (nextState) => {
    const nextErrors = validateLoginFields(nextState);
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  // ============================================================
  // ⭐ LOGIN REAL
  // ============================================================
    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟦 handleSubmit ejecutado");
    console.log("usuario:", username, "pass:", password);

    if (isRegisterMode) return;

    const isValid = runValidation({ username, password });
    console.log("validación:", isValid);
    if (!isValid) return;

    try {
      console.log("🟩 Enviando request al backend...");
      const data = await usuariosService.login({ username, password });
      console.log("🟩 RESPUESTA DEL BACKEND:", data);

      const usuarioNormalizado = {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido || "",
        username: data.username,
        rol: data.rol,
      };

      console.log("🟩 Guardando usuario:", usuarioNormalizado);

      login(usuarioNormalizado);

      console.log("🟩 Redirigiendo a /principal...");
      navigate("/principal");
    } catch (err) {
      console.log("🟥 ERROR EN EL LOGIN:", err);

      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err?.response?.data?.message || "Usuario o contraseña incorrectos.",
        confirmButtonColor: "#DE9205",
        background: "#11103a",
        color: "#E8EAED",
      });
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

  // ============================================================
  // VALIDACIONES REGISTRO
  // ============================================================
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

  // ============================================================
  // REGISTRO REAL
  // ============================================================
  const handleRegister = async () => {
    if (!isRegisterFormValid) return;

    try {
      const res = await usuariosService.registrar({
        nombre: regNombre,
        apellido: regApellido,
        password: regPassword,
        confirmacion: regRepeatPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Usuario registrado correctamente",
        text: res,
        confirmButtonColor: "#DE9205",
        background: "#11103a",
        color: "#E8EAED",
      });

      setIsRegisterMode(false);

      const sugerido = res.replace("Tu usuario será: ", "");
      setUsername(sugerido);

      setRegNombre("");
      setRegApellido("");
      setRegPassword("");
      setRegRepeatPassword("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar usuario",
        text: err?.response?.data?.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#DE9205",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  const groupStyle = { marginBottom: "1rem" };

  return (
    <main className="login-container">
      <WavyClipPath />
      <div className="login-form-container">
        <MobileWavyClipPath />

        <Form onSubmit={handleSubmit} noValidate className="formulario-login">
          {!isRegisterMode && (
            <>
              <h1 className="logo-text">
                Iniciar sesión en su cuenta de <strong>CapuNotes</strong>{" "}
                <img
                  src="/logo-coro-sin-fondo.png"
                  alt="Logo"
                  className="logo-coro"
                />
              </h1>

              <Form.Group className="custom-input-group" style={groupStyle}>
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
                />
              </Form.Group>
              <p className="menssaje-error-login">{errors.usuario}</p>

              <Form.Group className="custom-input-group" style={groupStyle}>
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
                />
              </Form.Group>
              <p className="menssaje-error-login">{errors.contraseña}</p>

              <Form.Group className="custom-input-group" style={groupStyle}>
                <Button type="submit" className="button-login">
                  Ingresar
                </Button>
              </Form.Group>

              <Form.Group className="custom-input-group" style={groupStyle}>
                <Button
                  className="button-login"
                  onClick={() => setIsRegisterMode(true)}
                >
                  Registrar
                </Button>
              </Form.Group>
            </>
          )}

          {isRegisterMode && (
            <>
              <h1 className="logo-text">
                Registrar su cuenta de <strong>CapuNotes</strong>
              </h1>

              <Form.Group className="custom-input-group" style={groupStyle}>
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

              <Form.Group className="custom-input-group" style={groupStyle}>
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

              <Form.Group className="custom-input-group" style={groupStyle}>
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

              <ul style={{ fontSize: 12, marginTop: 5 }}>
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

              <Form.Group className="custom-input-group" style={groupStyle}>
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

              <Form.Group className="custom-input-group" style={groupStyle}>
                <Button
                  className="button-login"
                  disabled={!isRegisterFormValid}
                  onClick={handleRegister}
                >
                  Registrar
                </Button>
              </Form.Group>

              <Form.Group className="custom-input-group" style={groupStyle}>
                <Button
                  className="button-return"
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
