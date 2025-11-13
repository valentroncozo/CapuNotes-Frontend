// src/pages/principal/index.jsx
import WelcomeCard from './WelcomeCard.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MicIcon from '@mui/icons-material/Mic';
import '@/styles/principal.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { eventoService } from '@/services/eventoService.js';

export default function Principal({ username }) {
  const navigate = useNavigate();

  const navHandler = (path) => (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      if (e.key) e.preventDefault();
      navigate(path);
    }
  };

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventoService.list();
        setEventos(data || []);
      } catch (error) {
        console.error('Error cargando eventos en principal:', error);
      }
    };

    fetchEventos();
  }, []);

  // Ordenar eventos por fecha de inicio (asc) y preparar listado de próximos
  const upcomingEventos = (eventos || [])
    .filter((e) => e) // evita nulos
    .slice() // copia para no mutar estado
    .sort((a, b) => {
      const da = a?.fechaInicio ? new Date(a.fechaInicio) : new Date(0);
      const db = b?.fechaInicio ? new Date(b.fechaInicio) : new Date(0);
      return da - db;
    });

  return (
    <div className="principal-container">
      <div className="home-container">
        <WelcomeCard title={`Bienvenido, ${username}!`} />
        <hr className="divisor-amarillo" />

        {/* Próximos eventos */}
        <section className="eventos-section">
          <h4 className="section-title">Tus próximos eventos</h4>

          <div className="eventos-scroll">
            {upcomingEventos && upcomingEventos.length > 0 ? (
              upcomingEventos.slice(0, 3).map((evento) => (
                <div className="evento-card" key={evento.id}>
                  <h3>
                    <strong>{evento.nombre}</strong>
                  </h3>
                  <div className="evento-info">
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#2e2c2cff"
                >
                  <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                </svg>
                    <p>
                      {evento.fechaInicio
                        ? new Date(evento.fechaInicio).toLocaleDateString('es-ES')
                        : '-'}
                    </p>
                  </div>
                  <div className="evento-info">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/></svg>
                    <p>{evento.hora || '-'}</p>
                  </div>
                  <div className="evento-info">
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#2e2c2cff"
                >
                  <path d="M480-80q-106 0-173-33.5T240-200q0-24 14.5-44.5T295-280l63 59q-9 4-19.5 9T322-200q13 16 60 28t98 12q51 0 98.5-12t60.5-28q-7-8-18-13t-21-9l62-60q28 16 43 36.5t15 45.5q0 53-67 86.5T480-80Zm1-220q99-73 149-146.5T680-594q0-102-65-154t-135-52q-70 0-135 52t-65 154q0 67 49 139.5T481-300Zm-1 100Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z" />
                </svg>
                    <p>{evento.lugar || '-'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem' }}>
                <p>No hay eventos próximos</p>
              </div>
            )}
          </div>
        </section>

        {/* Tareas principales */}
        <section className="tareas-section">
          <h4 className="section-title">Tareas principales</h4>
          <div className="tareas-grid">
            <div
              className="tarea-card"
              role="button"
              tabIndex={0}
              onClick={navHandler('/asistencias')}
              onKeyDown={navHandler('/asistencias')}
              style={{ cursor: 'pointer' }}
              aria-label="Ir a Asistencias"
            >
              <AssignmentIcon
                className="tarea-icon"
                style={{ fill: 'var(--text-light)' }}
              />
              <span>Asistencia</span>
            </div>

            <div
              className="tarea-card "
              role="button"
              tabIndex={0}
              onClick={navHandler('/eventos')}
              onKeyDown={navHandler('/eventos')}
              style={{ cursor: 'pointer' }}
              aria-label="Ir a Eventos"
            >
              <EventIcon
                className="tarea-icon"
                style={{ fill: 'var(--text-light)' }}
              />
              <span>Eventos</span>
            </div>

            {/* Actividades complementarias removido a pedido */}

            <div
              className="tarea-card"
              role="button"
              tabIndex={0}
              onClick={navHandler('/audicion')}
              onKeyDown={navHandler('/audicion')}
              style={{ cursor: 'pointer' }}
              aria-label="Ir a Audiciones"
            >
              <MicIcon
                className="tarea-icon"
                style={{ fill: 'var(--text-light)' }}
              />
              <span>Audiciones</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
