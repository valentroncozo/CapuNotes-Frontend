import WelcomeCard from "./titulo-cards.jsx";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MicIcon from '@mui/icons-material/Mic';
import "../../styles/principal.css";

export default function Principal({ username }) {
  return (
    <div className="principal-container">
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
