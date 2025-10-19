// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "@/components/pages/login/index.jsx";
import Principal from "@/components/pages/principal/index.jsx";

import AreasPage from "@/components/pages/areas/index.jsx";
import CuerdasPage from "@/components/pages/cuerdas/index.jsx";

import MiembrosPage from "@/components/pages/miembros/index.jsx";
import MiembrosAgregarPage from "@/components/pages/miembros/agregar.jsx";
import MiembrosEditarPage from "@/components/pages/miembros/editar.jsx";

// Audiciones (todas bajo /audiciones)
import AudicionesLanding from "@/components/pages/audiciones/index.jsx";
import AgregarAudicionPage from "@/components/pages/audiciones/agregar.jsx";
import PlanificarAudicionesPage from "@/components/pages/audiciones/planificar.jsx";
import CandidatosPage from "@/components/pages/audiciones/candidatos.jsx";
import CandidatosCoordPage from "@/components/pages/audiciones/candidatosCoord.jsx";
import HistorialAudicionesPage from "@/components/pages/audiciones/historial.jsx";
import ConfigurarCuestionario from "@/components/pages/audiciones/cuestionario.jsx";

function NotFound() {
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <h1 className="abmc-title">404</h1>
        </div>
        <p>La página que buscás no existe.</p>
      </div>
    </main>
  );
}

export default function App() {
  // Auth mínima de demo para pasar el username a Principal
  const [username, setUsername] = useState("Usuario");

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigí raíz a principal (cambiá a /login si querés) */}
        <Route path="/" element={<Navigate to="/principal" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login onLogin={setUsername} />} />

        {/* Home */}
        <Route path="/principal" element={<Principal username={username} />} />

        {/* Catálogos */}
        <Route path="/areas" element={<AreasPage />} />
        <Route path="/cuerdas" element={<CuerdasPage />} />

        {/* Miembros */}
        <Route path="/miembros" element={<MiembrosPage />} />
        <Route path="/miembros/agregar" element={<MiembrosAgregarPage />} />
        <Route path="/miembros/editar" element={<MiembrosEditarPage />} />

        {/* Audiciones */}
        <Route path="/audiciones" element={<AudicionesLanding />} />
        <Route path="/audiciones/agregar" element={<AgregarAudicionPage />} />
        <Route path="/audiciones/planificar" element={<PlanificarAudicionesPage />} />
        <Route path="/audiciones/candidatos" element={<CandidatosPage />} />
        <Route path="/audiciones/candidatosCoord" element={<CandidatosCoordPage />} />
        <Route path="/audiciones/historial" element={<HistorialAudicionesPage />} />
        <Route path="/audiciones/cuestionario" element={<ConfigurarCuestionario />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
