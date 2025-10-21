import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell.jsx";

import Principal from "@/components/pages/principal/index.jsx";
import Audicion from "@/components/pages/audicion/index.jsx";
import AudicionAgregar from "@/components/pages/audicion/agregar.jsx";
import Areas from "@/components/pages/areas/index.jsx";
import Cuerdas from "@/components/pages/cuerdas/index.jsx";
import Miembros from "@/components/pages/miembros/index.jsx";

// Placeholder simple para rutas del menú que todavía no tienen página
function Placeholder({ title }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ opacity: 0.8 }}>Contenido en construcción.</p>
    </div>
  );
}

/**
 * Cambios mínimos:
 * - Usamos rutas anidadas con <AppShell /> como layout padre.
 * - <AppShell /> renderiza <Outlet />, por eso las páginas deben ir como children del Route padre.
 * - Redirigimos / (root) -> /principal.
 * - Mapeamos /audiciones/planificar -> /audicion (para que el ítem del menú no rompa).
 * - Añadimos /candidatos como placeholder para evitar pantalla vacía.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta padre con layout */}
        <Route path="/" element={<AppShell />}>
          {/* Redirect desde root */}
          <Route index element={<Navigate to="/principal" replace />} />

          {/* Páginas principales */}
          <Route path="principal" element={<Principal />} />

          {/* Audiciones */}
          <Route path="audicion" element={<Audicion />} />
          <Route path="audicion/agregar" element={<AudicionAgregar />} />
          <Route path="audicion/cronograma/:id" element={<Placeholder title="Cronograma" />} />

          {/* Alias para el menú actual ("Planificar Audición") */}
          <Route path="audiciones/planificar" element={<Navigate to="/audicion" replace />} />

          {/* Organización del Coro */}
          <Route path="areas" element={<Areas />} />
          <Route path="cuerdas" element={<Cuerdas />} />
          <Route path="miembros" element={<Miembros />} />

          {/* Otras entradas del menú para que no queden en blanco */}
          <Route path="candidatos" element={<Placeholder title="Candidatos" />} />
          <Route path="configurar-cuestionario" element={<Placeholder title="Configurar Cuestionario" />} />
          <Route path="historial-audiciones" element={<Placeholder title="Historial de Audiciones" />} />

          {/* 404 dentro del layout */}
          <Route path="*" element={<Navigate to="/principal" replace />} />
        </Route>

        {/* 404 global */}
        <Route path="*" element={<Navigate to="/principal" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
