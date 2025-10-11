import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';

// 👉 Componentes
import Login from './components/login.jsx';
import Principal from './components/principal.jsx';
import OrganizacionCoro from './components/organizacionCoro.jsx';
import Miembros from './components/miembros.jsx';
import MiembrosAgregar from './components/miembrosAgregar.jsx';
import Cuerda from './components/cuerdas.jsx';
import PopupLab from './pages/popupLab.jsx';

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
        {console.log("isAuthenticated:", isAuthenticated)}
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

          {/* Organización */}
          <Route path="/organizacion-coro" element={<OrganizacionCoro />} />

          {/* Miembros */}
          <Route
            path="/miembros" element={<Miembros/>}
          />
          <Route
            path="/miembros/agregar" element={<MiembrosAgregar/>}
          />
          <Route
            path="/cuerdas"
            element={<Cuerda cuerda={{ nombre: '' }}/>}
          />
          <Route
            path="/popup-lab"
            element={<PopupLab/>}
          />
          {/* Cualquier ruta inválida redirige a principal */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
