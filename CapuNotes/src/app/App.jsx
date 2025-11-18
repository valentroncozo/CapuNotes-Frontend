// src/App.jsx
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import AppShell from "@/components/layout/AppShell.jsx";

// Pages
import Login from "@/components/pages/login/index.jsx";
import Principal from "@/components/pages/principal/index.jsx";
import Cuerdas from "@/components/pages/cuerdas/index.jsx";
import Areas from "@/components/pages/areas/index.jsx";
import Miembros from "@/components/pages/miembros/index.jsx";
import MiembrosAgregar from "@/components/pages/miembros/agregar.jsx";
import MiembrosEditar from "@/components/pages/miembros/editar.jsx";
import Audicion from "@/components/pages/audicion/index.jsx";
import AudicionEditar from "@/components/pages/audicion/editar.jsx";
import AudicionAgregar from "@/components/pages/audicion/agregar.jsx";
import CuestionarioConfig from "@/components/pages/cuestionario/configuracion.jsx";
import CuestionarioPreview from "@/components/pages/cuestionario/preview.jsx";
import AsistenciaEnsayos from "@/components/pages/asistencias/asistenciaEnsayos.jsx";
import AsistenciaEnsayosDetalle from "@/components/pages/asistencias/asistenciaEnsayosDetalle.jsx";
import HistorialAudiciones from "@/components/pages/audicion/historial.jsx";
import Formulario from "@/components/pages/formulario/index.jsx";
import FormularioConsulta from "@/components/pages/formulario/consulta.jsx";
import FormularioConsultaCoordinacion from "@/components/pages/formulario/consultaCoordinacion.jsx";
import Eventos from "@/components/pages/eventos/index.jsx";
import Candidatos from "@/components/pages/audicion/candidatos.jsx";
import CandidatosCoordinadores from "@/components/pages/candidatos_coordinadores/index.jsx";
import ReporteAsistenciaMiembroAnualPage from "@/components/pages/reportes/ReporteAsistenciaMiembroAnualPage.jsx";
import ReportesPage from "@/components/pages/reportes/ReportesPage.jsx";
import CategoriasCanciones from "@/components/pages/categorias-canciones/index.jsx";
import TiemposLiturgicos from "@/components/pages/tiempos-liturgicos/index.jsx";
import Canciones from "@/components/pages/canciones/index.jsx";
import Repertorios from "@/components/pages/repertorios/index.jsx";
import RepertorioFormPage from "@/components/pages/repertorios/RepertorioFormPage.jsx";
import RepertorioLecturaPage from "@/components/pages/repertorios/RepertorioLecturaPage.jsx";
import FraternidadesPage from "@/components/pages/fraternidades/index.jsx";
import FraternidadFormPage from "@/components/pages/fraternidades/FraternidadFormPage.jsx";

// Estilos base (usar globals como fuente deFverdad)
import "@/styles/globals.css";
import LandingPage from "../components/pages/landing";

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("capunotes_auth") === "1";
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    localStorage.getItem("capunotes_user") || ""
  );

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
      <Route
        path="/login"
        element={<Login onLogin={(u) => handleLogin(u)} />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/landing" replace />} />
        <Route path="principal" element={<Principal username={username} />} />
        <Route path="miembros" element={<Miembros />} />
        <Route path="miembros/agregar" element={<MiembrosAgregar />} />
        <Route path="miembros/editar" element={<MiembrosEditar />} />
        <Route path="cuerdas" element={<Cuerdas />} />
        <Route path="areas" element={<Areas />} />
        <Route path="categorias-canciones" element={<CategoriasCanciones />} />
        <Route path="tiempos-liturgicos" element={<TiemposLiturgicos />} />
        <Route path="canciones" element={<Canciones />} />
        <Route path="repertorios" element={<Repertorios />} />
        <Route path="repertorios/nuevo" element={<RepertorioFormPage mode="create" />} />
        <Route path="repertorios/:id/editar" element={<RepertorioFormPage mode="edit" />} />
        <Route path="repertorios/lectura" element={<RepertorioLecturaPage />} />
        <Route path="fraternidades" element={<FraternidadesPage />} />
        <Route path="fraternidades/nueva" element={<FraternidadFormPage mode="create" />} />
        <Route path="fraternidades/:id/editar" element={<FraternidadFormPage mode="edit" />} />
        <Route
          path="cuestionario/configuracion"
          element={<CuestionarioConfig />}
        />
        <Route path="cuestionario/preview" element={<CuestionarioPreview />} />
        <Route path="asistencias" element={<AsistenciaEnsayos />} />
        <Route
          path="asistencias/ensayos/:idEnsayo"
          element={<AsistenciaEnsayosDetalle />}
        />
        <Route path="eventos" element={<Eventos />} />
        <Route path="audicion" element={<Audicion />} />
        <Route path="audicion/agregar" element={<AudicionAgregar />} />
        <Route path="audicion/editar" element={<AudicionEditar />} />
        <Route path="audicion/historial" element={<HistorialAudiciones />} />
        <Route
          path="inscripcion/:id"
          element={<FormularioConsulta />}
        />
        <Route
          path="inscripcion/coordinadores/:id"
          element={<FormularioConsultaCoordinacion />}
        />
        <Route path="audicion/candidatos" element={<Candidatos />} />
        <Route
          path="candidatos-administracion"
          element={<CandidatosCoordinadores />}
        />
        <Route path="reportes" element={<ReportesPage />} />
        <Route
          path="reportes/miembro/:tipoDocumento/:nroDocumento"
          element={<ReporteAsistenciaMiembroAnualPage />}
        />
        <Route
          path="reportes/asistencias/miembro"
          element={<ReporteAsistenciaMiembroAnualPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/principal" replace />} />
      <Route path="/formulario" element={<Formulario />} />

      <Route path="landing" element={<LandingPage />} />
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
