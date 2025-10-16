import "../../styles/principal.css";
import WelcomeCard from "./titulo-cards.jsx";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import GroupsIcon from "@mui/icons-material/Groups";

export default function Principal() {
  return (
    <div className="container mt-4">
      {/* Cabecera simple del dashboard */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="text-light m-0">Inicio</h2>
        {/* si tenías un logo, usá SIEMPRE la ruta raíz, no /public/... */}
        {/* <img src="/Logo coro sin fondo.png" alt="Logo" style={{ height: 40 }} /> */}
      </div>

      {/* Tarjeta de bienvenida (reutilizable) */}
      <WelcomeCard
        title="Bienvenido/a"
        subtitle="Panel principal"
        description="Accesos rápidos a tus secciones más usadas."
      />

      {/* Grid de accesos rápidos (de ejemplo, ajustá a tu gusto) */}
      <div className="row g-3 mt-2">
        <div className="col-12 col-md-6 col-lg-3">
          <QuickLink
            icon={<CalendarMonthIcon />}
            title="Eventos"
            text="Calendario y próximos ensayos"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <QuickLink
            icon={<ScheduleIcon />}
            title="Asistencias"
            text="Control y estadísticas"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <QuickLink
            icon={<LibraryMusicIcon />}
            title="Canciones"
            text="Repertorio y material"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <QuickLink
            icon={<GroupsIcon />}
            title="Miembros"
            text="Gestión del coro"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, title, text }) {
  return (
    <div
      className="p-3 rounded-4 h-100"
      style={{
        background: "var(--surface, #0c0f2b)",
        color: "var(--ink, #eae9ff)",
        border: "1px solid var(--line, rgba(255,255,255,.12))",
      }}
    >
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-3 mb-2"
        style={{
          width: 44,
          height: 44,
          background: "var(--accent, #f5b800)",
          color: "#1b1b1b",
        }}
      >
        {icon}
      </div>
      <div className="fw-semibold">{title}</div>
      <div className="opacity-75" style={{ fontSize: ".95rem" }}>
        {text}
      </div>
    </div>
  );
}
