// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell.jsx";

// Pages
import Login from "@/components/pages/login/index.jsx";
import Principal from "@/components/pages/principal/index.jsx";
import Cuerdas from "@/components/pages/cuerdas/index.jsx";
import Areas from "@/components/pages/areas/index.jsx";
import Fraternidades from "@/components/pages/fraternidades/index.jsx";
import Miembros from "@/components/pages/miembros/index.jsx";
import MiembrosAgregar from "@/components/pages/miembros/agregar.jsx";
import MiembrosEditar from "@/components/pages/miembros/editar.jsx";
import Audicion from "@/components/pages/audicion/index.jsx";
import AudicionAgregar from "@/components/pages/audicion/agregar.jsx";
import AudicionEditar from "@/components/pages/audicion/editar.jsx";
import CuestionarioConfig from "@/components/pages/cuestionario/configuracion.jsx";
import CuestionarioPreview from "@/components/pages/cuestionario/preview.jsx";
import Candidatos from "@/components/pages/audicion/candidatos.jsx";
import CandidatosCoordinadores from "@/components/pages/candidatos_coordinadores/index.jsx";
import HistorialAudiciones from "@/components/pages/audicion/historial.jsx";
import Formulario from "@/components/pages/formulario/index.jsx"; // <-- descomenta cuando exista
import FormularioConsulta from "@/components/pages/formulario/consulta.jsx";
import FormularioConsultaCoordinacion from "@/components/pages/formulario/consultaCoordinacion.jsx";

// Estilos base (usar globals como fuente de verdad)
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
        <Route path="miembros" element={<Miembros />} />
        <Route path="miembros/agregar" element={<MiembrosAgregar />} />
        <Route path="miembros/editar" element={<MiembrosEditar />} />
        <Route path="cuerdas" element={<Cuerdas />} />
        <Route path="areas" element={<Areas />} />
        <Route path="cuestionario/configuracion" element={<CuestionarioConfig />} />
        <Route path="cuestionario/preview" element={<CuestionarioPreview />} />
        <Route path="candidatos-coordinadores" element={<CandidatosCoordinadores />} />
        <Route path="audicion" element={<Audicion />} />
        <Route path="audicion/agregar" element={<AudicionAgregar />} />
        <Route path="audicion/editar" element={<AudicionEditar />} />
        <Route path="audicion/candidatos" element={<Candidatos />} />
        <Route path="audicion/historial" element={<HistorialAudiciones />} />
        <Route path="audicion/cronograma/:id" element={<Navigate to="/candidatos-coordinadores" replace />} />
        <Route path="/inscripcion/:id" element={<FormularioConsulta />} />
        <Route path="/inscripcion/coordinadores/:id" element={<FormularioConsultaCoordinacion />} />
      </Route>
     

      <Route path="*" element={<Navigate to="/principal" replace />} />
      <Route path="/formulario" element={<Formulario />} /> 

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
