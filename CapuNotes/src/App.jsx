import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/landing';
import QuienesSomos from './components/quienesSomos';
import Login from './components/login';
import Principal from './components/principal';
import Menu from './components/menu';
import Miembros from './components/miembro';
import OrganizacionCoro from './components/organizacionCoro';
import Audiciones from './components/audiciones';
import MenuAudiciones from './components/menuAudiciones';
import Candidato from './components/candidato';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Temporal para debugging
  console.log('App component rendering...');
  console.log('Current URL:', window.location.pathname);
  console.log('Is Authenticated:', isAuthenticated);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal - Landing */}
          <Route path="/" element={<Landing />} />

          {/* Quienes somos */}
          <Route path="/quienes-somos" element={<QuienesSomos />} />

          {/* Login - Permite acceso al formulario de login */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUsername={setUsername}
                />
              ) : (
                <Navigate to="/principal" replace />
              )
            }
          />

          {/* Principal - requiere autenticación */}
          <Route
            path="/principal"
            element={
              isAuthenticated ? (
                <Principal username={username} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Menu */}
          <Route
            path="/menu"
            element={isAuthenticated ? <Menu /> : <Navigate to="/" replace />}
          />

          {/* Miembros */}
          <Route
            path="/miembros"
            element={
              isAuthenticated ? <Miembros /> : <Navigate to="/" replace />
            }
          />

          {/* Organización del Coro */}
          <Route
            path="/organizacion-coro"
            element={
              isAuthenticated ? (
                <OrganizacionCoro />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Menu de Audiciones */}
          <Route
            path="/menu-audiciones"
            element={
              isAuthenticated ? <MenuAudiciones /> : <Navigate to="/" replace />
            }
          />

          {/* Audiciones */}
          <Route
            path="/audiciones"
            element={
              isAuthenticated ? (
                <Audiciones username={username} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Candidato */}
          <Route
            path="/candidato"
            element={
              isAuthenticated ? <Candidato /> : <Navigate to="/" replace />
            }
          />

          {/* Ruta para cualquier otra URL no encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
