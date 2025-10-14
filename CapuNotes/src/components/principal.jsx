import WelcomeCard from "./titulo-cards.jsx";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment'; // 📋 Asistencia
import EventIcon from '@mui/icons-material/Event'; // 🗓️ Eventos
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'; // 🎶 Actividades complementarias
import MicIcon from '@mui/icons-material/Mic'; // 🎤 Audiciones
import { Link } from 'react-router-dom';
import "./principal.css";



export default function Principal({ username, onLogout }) {

  return (
    <div className="principal-container">
      {/* Botón menú hamburguesa */}
      <div>
        {/* Añadimos 'navbar-dark' para el ícono blanco.
        Usamos 'backgroundColor' en 'style' para forzar el color exacto. 
      */}
        <nav
          className="navbar fixed-top w-100 navbar-dark"
          style={{ padding: '10px' }}
        >
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

  <div
    className="offcanvas offcanvas-start"
    tabIndex="-1"
    id="offcanvasMenu"
    aria-labelledby="offcanvasMenuLabel"
  >
    <div className="offcanvas-header">
      <h5 className="offcanvas-title" id="offcanvasMenuLabel">
        Menú
      </h5>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
      {/* Botón cerrar sesión CORREGIDO */}
      <button
          type="button"
          className="nav-link" // Mantenemos nav-link para el estilo de color y btn
          // ✅ CORRECCIÓN: Quitamos los estilos en línea que fuerzan el padding y el textAlign
          // Dejamos solo los estilos esenciales que no pueden ir en CSS
          style={{ color: '#E8EAED', background: 'transparent', border: 'none' }} 
          data-bs-dismiss="offcanvas"
          onClick={() => { if (onLogout) onLogout(); }}
      >
          Cerrar sesión
      </button>
    </div>
    <div className="offcanvas-body">
      <Link className="nav-link" to="/inicio" >
        Inicio
      </Link>
      <Link className="nav-link" to="/asistencias">
        Asistencias
      </Link>
      <Link className="nav-link" to="/audiciones">
        Audiciones
      </Link>
      <Link className="nav-link" to="/canciones">
        Canciones
      </Link>
      <Link className="nav-link" to="/eventos">
        Eventos
      </Link>
      <Link className="nav-link" to="/fraternidades">
        Fraternidades
      </Link>
      <Link className="nav-link" to="/miembros">
        Miembros
      </Link>
      <Link className="nav-link" to="/organizacion-coro">
        Organización del Coro 
      </Link>
      <Link className="nav-link" to="/usuarios-roles">
        Usuarios y roles
      </Link>
    </div>
  </div>

        {/* Esto es solo para que el contenido no quede debajo de la navbar */}
        <div style={{ marginTop: '60px' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="home-container">
        {/* Bienvenida */}
        <WelcomeCard title={`Bienvenido, ${username}!`} />

        {/* Línea divisora */}
        <hr className="divisor-amarillo" />

        {/* Próximos eventos */}
        <section className="eventos-section">
          <h4 className="section-title">Tus próximos eventos</h4>

          <div className="eventos-scroll">
            {/* === CARD 1 === */}
            <div className="evento-card">
              <h5>Peña</h5>
              <div className="evento-info">
                <CalendarMonthIcon className="evento-icon" />
                <p>Viernes 12/09</p>
              </div>
              <div className="evento-info">
                <ScheduleIcon className="evento-icon" />
                <p>13:00 hs</p>
              </div>
              <div className="evento-info">
                <LocationOnIcon className="evento-icon" />
                <p>Villa Allende</p>
              </div>
            </div>

            {/* === CARD 2 === */}
            <div className="evento-card">
              <h5>Concierto</h5>
              <div className="evento-info">
                <CalendarMonthIcon className="evento-icon" />
                <p>Sábado 14/09</p>
              </div>
              <div className="evento-info">
                <ScheduleIcon className="evento-icon" />
                <p>18:00 hs</p>
              </div>
              <div className="evento-info">
                <LocationOnIcon className="evento-icon" />
                <p>Córdoba</p>
              </div>
            </div>

            {/* === CARD 3 === */}
            <div className="evento-card">
              <h5>Ensayo</h5>
              <div className="evento-info">
                <CalendarMonthIcon className="evento-icon" />
                <p>Domingo 15/09</p>
              </div>
              <div className="evento-info">
                <ScheduleIcon className="evento-icon" />
                <p>10:00 hs</p>
              </div>
              <div className="evento-info">
                <LocationOnIcon className="evento-icon" />
                <p>Sede Central</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tareas principales */}
        <section className="tareas-section">
          <h4 className="section-title">Tareas principales</h4>
          <div className="tareas-grid">
            <div className="tarea-card">
              <AssignmentIcon className="tarea-icon" />
              <span>Asistencia</span>
            </div>

            <div className="tarea-card tarea-activa">
              <EventIcon className="tarea-icon" />
              <span>Eventos</span>
            </div>

            <div className="tarea-card">
              <LibraryMusicIcon className="tarea-icon" />
              <span>Actividades complementarias</span>
            </div>

            <div className="tarea-card">
              <MicIcon className="tarea-icon" />
              <span>Audiciones</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
