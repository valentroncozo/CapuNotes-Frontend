import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell.jsx";
import useAuth from "@/hooks/useAuth.js";

// Pages
import Login from "@/components/pages/login/index.jsx";
import Principal from "@/components/pages/principal/index.jsx";
import Cuerdas from "@/components/pages/cuerdas/index.jsx";
import Areas from "@/components/pages/areas/index.jsx";
import Miembros from "@/components/pages/miembros/index.jsx";
import MiembrosAgregar from "@/components/pages/miembros/agregar.jsx";
import MiembrosEditar from "@/components/pages/miembros/editar.jsx";

// Audiciones (importamos las nuevas páginas)
import Candidatos from "@/components/pages/audicion/candidatos.jsx";
import CandidatosCoordinadores from "@/components/pages/audicion/candidatosCoord.jsx";
import HistorialAudiciones from "@/components/pages/audicion/historial.jsx";

// Estilos globales
import "@/styles/globals.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const handleLogin = (username) => {
    login(username);
    navigate("/principal", { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell onLogout={logout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/principal" replace />} />
        <Route path="principal" element={<Principal username={user} />} />
        <Route path="miembros" element={<Miembros />} />
        <Route path="miembros/agregar" element={<MiembrosAgregar />} />
        <Route path="miembros/editar" element={<MiembrosEditar />} />
        <Route path="cuerdas" element={<Cuerdas />} />
        <Route path="areas" element={<Areas />} />

        {/* --- Rutas de Audiciones Integradas --- */}
        <Route path="audiciones/planificar" element={<AudicionesPlanificar />} />

        {/* Cronogramas (antes “/audiciones/cronograma/:id”) */}
        <Route path="audiciones/:audicionId/candidatos" element={<Candidatos />} />
        <Route path="audiciones/:audicionId/coordinadores" element={<CandidatosCoordinadores />} />

        {/* Rutas de compatibilidad para enlaces antiguos */}
        <Route path="candidatos" element={<Candidatos />} /> 
        <Route path="candidatos-coordinadores" element={<CandidatosCoordinadores />} /> 

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