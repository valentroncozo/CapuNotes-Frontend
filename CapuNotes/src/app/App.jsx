// src/App.jsx
import React, { useEffect } from "react";
// agregar imports faltantes desde react-router-dom y useAuth desde el contexto
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";
import { PROTECTED_VIEWS, normalizePermission } from "@/config/permissions.js";

import AppShell from '@/components/layout/AppShell.jsx';


// Pages
import Login from "@/components/pages/login/index.jsx"; // PUBLIC
import Principal from "@/components/pages/principal/index.jsx"; // PROTECTED (cualquier logeado)
import Cuerdas from "@/components/pages/cuerdas/index.jsx"; // x view:Cuerdas
import Areas from "@/components/pages/areas/index.jsx"; // x view:Areas
import Miembros from "@/components/pages/miembros/index.jsx"; // x view:Miembros view:eliminar:Miembros
import MiembrosAgregar from "@/components/pages/miembros/agregar.jsx"; // x view:crear:Miembros
import MiembrosEditar from "@/components/pages/miembros/editar.jsx"; // x  view:editar:Miembros
import Audicion from "@/components/pages/audicion/index.jsx";  // x view:Audicion
import AudicionEditar from "@/components/pages/audicion/editar.jsx"; // x view:editar:Audicion
import AudicionAgregar from "@/components/pages/audicion/agregar.jsx"; // x view:crear:Audicion
import CuestionarioConfig from '@/components/pages/cuestionario/configuracion.jsx'; // x view:Preguntas
import CuestionarioPreview from '@/components/pages/cuestionario/preview.jsx'; // x view:VistaCuestionario
import HistorialAudiciones from "@/components/pages/audicion/historial.jsx"; // x view:HistorialAudiciones
import Formulario from "@/components/pages/formulario/index.jsx"; // PUBLIC
import FormularioConsulta from "@/components/pages/formulario/consulta.jsx"; // x view:Inscripcion
import FormularioConsultaCoordinacion from "@/components/pages/formulario/consultaCoordinacion.jsx"; //x  view:InscripcionCoordinador
import Candidatos from "@/components/pages/audicion/candidatos.jsx"; // x view:CandidatosTurnos
import CandidatosCoordinadores from "@/components/pages/candidatos_coordinadores/index.jsx"; // x view:CandidatoEvaluación

import Eventos from '@/components/pages/eventos/index.jsx'; // x view:Eventos
import AsistenciaEnsayosDetalle from '@/components/pages/asistencias/asistenciaEnsayosDetalle.jsx'; // x view:Asistencias
import AsistenciaEnsayos from '@/components/pages/asistencias/asistenciaEnsayos.jsx'; // x view:Asistencias
import ReporteAsistenciaMiembroAnualPage from "@/components/pages/reportes/ReporteAsistenciaMiembroAnualPage.jsx"; // x view:ReporteAsistencia
import ReportesPage from "@/components/pages/reportes/ReportesPage.jsx"; // x view:ReportesAsistencia


import Error401 from "../components/pages/errors/Error401"; //public
import Error403 from "../components/pages/errors/Error403"; //public
import LandingPage from "../components/pages/landing"; //public


// Estilos base (usar globals como fuente deFverdad)
import '@/styles/globals.css';

const ROUTE_COMPONENTS = {
  Cuerdas,
  Areas,
  Miembros,
  MiembrosAgregar,
  MiembrosEditar,
  Audicion,
  AudicionEditar,
  AudicionAgregar,
  CuestionarioConfig,
  CuestionarioPreview,
  HistorialAudiciones,
  FormularioConsulta,
  FormularioConsultaCoordinacion,
  Candidatos,
  CandidatosCoordinadores,
  Eventos,
  AsistenciaEnsayos,
  AsistenciaEnsayosDetalle,
  ReportesPage,
  ReporteAsistenciaMiembroAnualPage,
};

const hasPermission = (permissionList = [], required) => {
  if (!required) return true;
  const goal = normalizePermission(required);
  return permissionList.some((perm) => normalizePermission(perm) === goal);
};

function PermissionGate({ permission, children }) {
  const { permissions = [], loading } = useAuth();
  if (loading) return null;
  if (!hasPermission(permissions, permission)) {
    return <Navigate to="/403" replace />;
  }
  return children;
}


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  // mientras carga, podrías mostrar spinner; aquí solo bloqueamos la navegación
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  // redirigir automáticamente a /principal cuando la sesión quede confirmada
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const p = location.pathname;
      if (p === "/login" || p === "/") navigate("/principal", { replace: true });
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  const username = user?.username || "";

  const handleLogout = () => {
    // si necesitas propagar logout al AppShell, usa useAuth dentro de AppShell y llama logout()
    // aquí solo navegamos a login
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      <Route path="/home" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/401" element={<Error401 />} />
      <Route path="/403" element={<Error403 />} />
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
        {PROTECTED_VIEWS.map((view) => {
          const Component = ROUTE_COMPONENTS[view.componentKey];
          if (!Component) return null;
          return (
            <Route
              key={view.key}
              path={view.path}
              element={
                <PermissionGate permission={view.permission}>
                  <Component />
                </PermissionGate>
              }
            />
          );
        })}

      </Route>

      <Route path="/formulario" element={<Formulario />} />
      <Route path="*" element={<Navigate to="/principal" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
