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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // 👉 función que valida login
  const handleLogin = (usernameInput, password) => {
    if (usernameInput === 'admin' && password === '1234') {
      setIsAuthenticated(true);
      setUsername(usernameInput); // Guarda el nombre del usuario
    } else {
      alert('Usuario o contraseña incorrectos');
    }
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
                <Principal username={username} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="/organizacion-coro" element={<OrganizacionCoro />} />
          {/* ...otras rutas... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
