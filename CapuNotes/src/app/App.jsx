// src/app/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell.jsx";

// Pages
import Login from "@/components/pages/login/index.jsx";
import Principal from "@/components/pages/principal/index.jsx";
import Cuerdas from "@/components/pages/cuerdas/index.jsx";
import Areas from "@/components/pages/areas/index.jsx";
import Miembros from "@/components/pages/miembros/index.jsx";
import MiembrosAgregar from "@/components/pages/miembros/agregar.jsx";
import MiembrosEditar from "@/components/pages/miembros/editar.jsx";

// Audiciones
import Audiciones from "@/components/pages/audiciones/planificar.jsx";
import Candidatos from "@/components/pages/audiciones/candidatos.jsx";              // evaluadores
import CandidatosCoordinadores from "@/components/pages/audiciones/candidatosCoord.jsx"; // coordinadores
import ConfigurarCuestionario from "@/components/pages/audiciones/cuestionario.jsx";
import HistorialAudiciones from "@/components/pages/audiciones/historial.jsx";

// Estilos base
import "@/styles/globals.css";

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("capunotes_auth") === "1";
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("capunotes_user") || "");

  const handleLogin = (user) => {
    localStorage.setItem("capunotes_auth", "1");
    localStorage.setItem("capunotes_user", user);
    setUsername(user);
    navigate("/principal", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("capunotes_auth");
    localStorage.removeItem("capunotes_user");
    setUsername("");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(u) => handleLogin(u)} />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/principal" replace />} />
        <Route path="principal" element={<Principal username={username} />} />

        {/* Organización del Coro */}
        <Route path="miembros" element={<Miembros />} />
        <Route path="miembros/agregar" element={<MiembrosAgregar />} />
        <Route path="miembros/editar" element={<MiembrosEditar />} />
        <Route path="cuerdas" element={<Cuerdas />} />
        <Route path="areas" element={<Areas />} />

        {/* Audiciones */}
        <Route path="audiciones" element={<Audiciones />} />
        <Route path="candidatos" element={<Candidatos />} /> {/* evaluadores */}
        <Route path="candidatos-coordinadores" element={<CandidatosCoordinadores />} /> {/* coordinadores */}
        <Route path="configurar-cuestionario" element={<ConfigurarCuestionario />} />
        <Route path="historial-audiciones" element={<HistorialAudiciones />} />
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
