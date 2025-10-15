import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './styles/App.css';

import AppShell from './components/layout/AppShell.jsx';

import Principal from './components/pages/principal.jsx';
import Miembros from './components/organizacion-coro/miembros.jsx';
import MiembrosAgregar from './components/organizacion-coro/miembrosAgregar.jsx';
import MiembrosEditar from './components/organizacion-coro/miembrosEditar.jsx';
import Cuerda from './components/organizacion-coro/cuerdas.jsx';
import PopupLab from './components/popUp/PopupLab.jsx';
import Login from './components/pages/login.jsx';
import Area from './components/organizacion-coro/Area.jsx';

function App() {
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('capunotes_auth');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirección raíz según auth */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to="/principal" />
                : <Navigate to="/login" />
            }
          />

          {/* Login público en /login */}
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/principal" />
                : <Login onLogin={handleLogin} />
            }
          />

          {/* Layout privado y rutas hijas relativas */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <AppShell username={username} onLogout={handleLogout} />
                : <Navigate to="/login" />
            }
          >
            <Route path="principal" element={<Principal username={username} />} />
            <Route path="organizacion-coro" element={<Area />} />
            <Route path="miembros" element={<Miembros />} />
            <Route path="miembros/agregar" element={<MiembrosAgregar />} />
            <Route path="miembros/editar" element={<MiembrosEditar />} />
            <Route path="cuerdas" element={<Cuerda cuerda={{ nombre: '' }} />} />
            <Route path="popup-lab" element={<PopupLab />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
