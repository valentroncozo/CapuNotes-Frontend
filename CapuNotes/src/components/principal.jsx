import './principal.css';

export default function Principal({ username }) {
  return (
    <div className="home-container">
      {/* Bienvenida con logo */}
      <header className="welcome">
        <div className="welcome-row">
          <img
            src="/Logo coro sin fondo.jpg"
            alt="Logo Coro"
            className="welcome-logo"
          />
          <div>
            <h3>Bienvenido, {username}!</h3>
            <p>Tu música, tu comunidad.</p>
          </div>
        </div>
      </header>

      {/* Línea divisora amarilla */}
      <hr className="divisor-amarillo" />

      {/* Próximos eventos con scroll horizontal */}
      <section className="eventos-section">
        <h4>Tus próximos eventos:</h4>
        <div className="eventos-scroll">
          <div className="evento-card">
            <h5>Peña</h5>
            <p>📅 Viernes 12/09 – 13hs</p>
            <p>📍 Villa Allende</p>
          </div>
          <div className="evento-card">
            <h5>Concierto</h5>
            <p>📅 Sábado 14/09 – 18hs</p>
            <p>📍 Córdoba</p>
          </div>
          <div className="evento-card">
            <h5>Ensayo</h5>
            <p>📅 Domingo 15/09 – 10hs</p>
            <p>📍 Sede Central</p>
          </div>
        </div>
      </section>

      {/* Tareas principales */}
      <section className="tareas-section">
        <h4>Tareas principales</h4>
        <div className="tareas-grid">
          <div className="tarea-card">📋 Asistencia</div>
          <div className="tarea-card tarea-activa">📅 Eventos</div>
          <div className="tarea-card tarea-activa">
            🎶 Actividades complementarias
          </div>
          <div className="tarea-card">🎤 Audiciones</div>
        </div>
      </section>
    </div>
  );
}
