import { useState } from "react";
import "./principal.css";
import Menu from "./menu.jsx";
import WelcomeCard from "./titulo-cards.jsx";
import Icon from "./Icon.jsx"; // 👈 nuevo componente reutilizable

export default function Principal({ username }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (menuAbierto) {
    return <Menu onClose={() => setMenuAbierto(false)} />;
  }

  return (
    <div className="principal-container">
      {/* Botón menú hamburguesa */}
      <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </button>

      {/* Contenido principal */}
      <div className="home-container">
        {/* Bienvenida */}
        <WelcomeCard
          title={`Bienvenido, ${username}!`}
          subtitle="Tu música, tu comunidad."
        />

        {/* Línea divisora */}
        <hr className="divisor-amarillo" />

        {/* Próximos eventos */}
        <section className="eventos-section">
          <h4 className="section-title">Tus próximos eventos</h4>
          <div className="eventos-scroll">
            <div className="evento-card">
              <h5>Peña</h5>
              <div className="evento-info">
                <Icon name="calendar_month" />
                <p>Viernes 12/09</p>
              </div>
              <div className="evento-info">
                <Icon name="schedule" />
                <p>13:00 hs</p>
              </div>
              <div className="evento-info">
                <Icon name="location_on" />
                <p>Villa Allende</p>
              </div>
            </div>

            <div className="evento-card">
              <h5>Concierto</h5>
              <div className="evento-info">
                <Icon name="calendar_month" />
                <p>Sábado 14/09</p>
              </div>
              <div className="evento-info">
                <Icon name="schedule" />
                <p>18:00 hs</p>
              </div>
              <div className="evento-info">
                <Icon name="location_on" />
                <p>Córdoba</p>
              </div>
            </div>

            <div className="evento-card">
              <h5>Ensayo</h5>
              <div className="evento-info">
                <Icon name="calendar_month" />
                <p>Domingo 15/09</p>
              </div>
              <div className="evento-info">
                <Icon name="schedule" />
                <p>10:00 hs</p>
              </div>
              <div className="evento-info">
                <Icon name="location_on" />
                <p>Sede Central</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tareas principales */}
        <section className="tareas-section">
          <h4 className="section-title">Tareas principales</h4>
          <div className="tareas-grid">
            <div className="tarea-card">📋 Asistencia</div>
            <div className="tarea-card tarea-activa">🗓️ Eventos</div>
            <div className="tarea-card">🎶 Actividades complementarias</div>
            <div className="tarea-card">🎤 Audiciones</div>
          </div>
        </section>
      </div>
    </div>
  );
}
