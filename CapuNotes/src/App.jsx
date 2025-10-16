// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AppShell from "./components/layout/AppShell.jsx";

// Pages
import Login from "./components/pages/login.jsx";
import Principal from "./components/pages/principal.jsx";
import Miembros from "./components/pages/miembros.jsx";
import MiembrosAgregar from "./components/pages/miembrosAgregar.jsx";
import MiembrosEditar from "./components/pages/miembrosEditar.jsx";
import Cuerdas from "./components/pages/cuerdas.jsx";
import Area from "./components/pages/areas.jsx";

// Global styles
import "./styles/index.css";
import "./styles/App.css";

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("capunotes_auth") === "1";
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("capunotes_user") || "");

  const handleLogin = (user) => {
    // Guardar sesión
    localStorage.setItem("capunotes_auth", "1");
    localStorage.setItem("capunotes_user", user);
    setUsername(user);

    // 🔐 Navegar a la home protegida
    navigate("/principal", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("capunotes_auth");
    localStorage.removeItem("capunotes_user");
    setUsername("");
    // (AppShell también navega a /login al cerrar sesión)
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(u) => handleLogin(u)} />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell username={username} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/principal" replace />} />
        <Route path="principal" element={<Principal username={username} />} />

        {/* Miembros */}
        <Route path="miembros" element={<Miembros />} />
        <Route path="miembros/agregar" element={<MiembrosAgregar />} />
        <Route path="miembros/editar" element={<MiembrosEditar />} />

        {/* Cuerdas (ABMC sin ID) */}
        <Route path="cuerdas" element={<Cuerdas />} />

        {/* Áreas (ABMC genérico) */}
        <Route path="organizacion-coro" element={<Area />} />


      </Route>

      <Route path="*" element={<Navigate to="/principal" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
