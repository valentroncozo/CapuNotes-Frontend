// src/App.jsx
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './styles/App.css';

// 👉 Componentes
import Principal from './components/pages/principal.jsx';
import Miembros from './components/organizacion-coro/miembros.jsx';
import MiembrosAgregar from './components/organizacion-coro/miembrosAgregar.jsx';
import MiembrosEditar from './components/organizacion-coro/miembrosEditar.jsx';
import Cuerda from './components/organizacion-coro/cuerdas.jsx';
import PopupLab from './components/popUp/PopupLab.jsx';
import Login from './components/pages/login.jsx';
import Area from './components/organizacion-coro/Area.jsx';

function App() {
  // ✅ Persistencia de sesión
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem('capunotes_auth');
      if (!saved) return false;
      const { isAuthenticated } = JSON.parse(saved);
      return !!isAuthenticated;
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState(() => {
    try {
      const saved = localStorage.getItem('capunotes_auth');
      if (!saved) return '';
      const { username } = JSON.parse(saved);
      return username || '';
    } catch {
      return '';
    }
  });

  // ✅ Login
  const handleLogin = (usernameInput, password) => {
    if (usernameInput === 'admin' && password === '1234') {
      const session = { isAuthenticated: true, username: usernameInput };
      setIsAuthenticated(true);
      setUsername(usernameInput);
      localStorage.setItem('capunotes_auth', JSON.stringify(session));
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('capunotes_auth');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/principal" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Principal */}
          <Route
            path="/principal"
            element={
              isAuthenticated ? (
                <Principal username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Alias para inicio */}
          <Route path="/inicio" element={<Navigate to="/principal" />} />

          {/* Organización -> Áreas */}
          <Route
            path="/organizacion-coro"
            element={
              isAuthenticated ? (
                <Area onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Miembros */}
          <Route
            path="/miembros"
            element={isAuthenticated ? <Miembros /> : <Navigate to="/" />}
          />
          <Route
            path="/miembros/agregar"
            element={isAuthenticated ? <MiembrosAgregar /> : <Navigate to="/" />}
          />
          <Route
            path="/cuerdas"
            element={isAuthenticated ? <Cuerda cuerda={{ nombre: '' }} /> : <Navigate to="/" />}
          />
          <Route
            path="/miembros/editar"
            element={isAuthenticated ? <MiembrosEditar /> : <Navigate to="/" />}
          />

          {/* Popup-Lab (dev) */}
          <Route
            path="/popup-lab"
            element={isAuthenticated ? <PopupLab /> : <Navigate to="/" />}
          />

          {/* Cualquier ruta inválida redirige a principal */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
