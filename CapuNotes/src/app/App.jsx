// src/app/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell.jsx";

import Principal from "@/components/pages/principal/index.jsx";
import Audicion from "@/components/pages/audicion/index.jsx";
import AudicionAgregar from "@/components/pages/audicion/agregar.jsx";
import Areas from "@/components/pages/areas/index.jsx";
import Cuerdas from "@/components/pages/cuerdas/index.jsx";
import Miembros from "@/components/pages/miembros/index.jsx";
import MiembrosAgregar from "@/components/pages/miembros/agregar.jsx";
import MiembrosEditar from "@/components/pages/miembros/editar.jsx";

import CandidatosPage from "@/components/pages/audicion/candidatos.jsx";
import CandidatosCoordPage from "@/components/pages/audicion/candidatosCoord.jsx";
import HistorialAudicionesPage from "@/components/pages/audicion/historial.jsx";

function Placeholder({ title }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ opacity: 0.8 }}>Contenido en construcción.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/principal" replace />} />
          <Route path="principal" element={<Principal />} />

          {/* AUDICIONES */}
          <Route path="audicion" element={<Audicion />} />
          <Route path="audicion/agregar" element={<AudicionAgregar />} />
          <Route path="audiciones/planificar" element={<Navigate to="/audicion" replace />} />

          {/* ORGANIZACIÓN */}
          <Route path="areas" element={<Areas />} />
          <Route path="cuerdas" element={<Cuerdas />} />
          <Route path="miembros" element={<Miembros />} />
          <Route path="miembros/agregar" element={<MiembrosAgregar />} />
          <Route path="miembros/editar" element={<MiembrosEditar />} />

          {/* CANDIDATOS */}
          <Route path="candidatos" element={<CandidatosPage />} />
          <Route path="candidatos-coord" element={<CandidatosCoordPage />} />
          <Route path="historial-audiciones" element={<HistorialAudicionesPage />} />

          <Route path="*" element={<Navigate to="/principal" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/principal" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
