import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Login from './components/login.jsx';
import Principal from './components/principal.jsx';
import OrganizacionCoro from './components/organizacionCoro.jsx';
import Miembros from './components/miembros.jsx';
import Cuerda from './components/Cuerda.jsx';
// ...otros imports de componentes...

function App() {
  // Persist authentication in localStorage so user only needs to login once
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const s = localStorage.getItem('capunotes_auth');
      if (!s) return false;
      const obj = JSON.parse(s);
      return !!obj.isAuthenticated;
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState(() => {
    try {
      const s = localStorage.getItem('capunotes_auth');
      if (!s) return '';
      const obj = JSON.parse(s);
      return obj.username || '';
    } catch {
      return '';
    }
  });

  // 👉 función que valida login
  const handleLogin = (usernameInput, password) => {
    if (usernameInput === 'admin' && password === '1234') {
      setIsAuthenticated(true);
      setUsername(usernameInput); // Guarda el nombre del usuario
      // Guardar sesión en localStorage para persistencia
      try {
        localStorage.setItem(
          'capunotes_auth',
          JSON.stringify({ isAuthenticated: true, username: usernameInput })
        );
      } catch {
        // noop
      }
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    try {
      localStorage.removeItem('capunotes_auth');
  } catch { /* noop */ }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta login */}
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

          {/* Ruta principal */}
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

          <Route path="/inicio" element={<Navigate to="/principal" />} />
          <Route path="/organizacion-coro" element={<OrganizacionCoro />} />
          <Route path="/miembros" element={<Miembros />} />
          <Route path="/miembros" element={<Cuerda />} />
          {/* ...otras rutas... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
