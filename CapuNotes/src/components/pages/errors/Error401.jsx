
import { Link } from "react-router-dom";

export default function Error401() {
  return (
    <main style={{ padding: 24 }}>
      <h1>401 — No autorizado</h1>
      <p>Debe iniciar sesión o su sesión ha expirado.</p>
      <p>
        <Link to="/login">Ir a la pantalla de inicio de sesión</Link>
      </p>
    </main>
  );
}