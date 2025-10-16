// src/components/layout/AppShell.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/offcanvas.css";

/* Ícono de cierre (X) */
function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 1 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"
      />
    </svg>
  );
}
/* Ícono de engranaje */
function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 15.5a3.5 3.5 0 1 1 0-7.001 3.5 3.5 0 0 1 0 7zM19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.75.75 0 0 0 .18-.97l-2-3.46a.75.75 0 0 0-.9-.33l-2.49 1a7.57 7.57 0 0 0-1.7-.98l-.38-2.65A.75.75 0 0 0 13.5 0h-3a.75.75 0 0 0-.74.63l-.38 2.65c-.62.24-1.19.56-1.7.98l-2.49-1a.75.75 0 0 0-.9.33l-2 3.46a.75.75 0 0 0 .18.97L4.57 11c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.75.75 0 0 0-.18.97l2 3.46a.75.75 0 0 0 .9.33l2.49-1c.51.42 1.08.74 1.7.98l.38 2.65c.06.36.37.63.74.63h3c.37 0 .68-.27.74-.63l.38-2.65c.62-.24 1.19-.56 1.7-.98l2.49 1a.75.75 0 0 0 .9-.33l2-3.46a.75.75 0 0 0-.18-.97L19.43 12.98z"
      />
    </svg>
  );
}

export default function AppShell({ onLogout }) {
  const navigate = useNavigate();

  // Estado del drawer (offcanvas custom)
  const [open, setOpen] = useState(false);
  // UI secundaria
  const [orgOpen, setOrgOpen] = useState(false);   // acordeón Organización del Coro
  const [gearOpen, setGearOpen] = useState(false); // menú de la tuerquita

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Al cerrar el drawer, cerramos sub-menú
  useEffect(() => { if (!open) setGearOpen(false); }, [open]);

  const handleNavigate = (to) => {
    setOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
    navigate("/login");
  };

  return (
    <>
      {/* Navbar superior fija (solo el botón hamburguesa) */}
      <nav className="navbar fixed-top navbar-dark appshell-navbar">
        <button
          className="navbar-toggler appshell-toggle"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      {/* Drawer custom (sin Bootstrap JS) */}
      <div className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <h5 className="offcanvas-title">Menú</h5>

          <div className="appshell-header-controls">
            <button
              className="appshell-gearbtn"
              type="button"
              aria-label="Ajustes"
              onClick={(e) => {
                e.stopPropagation();
                setGearOpen((v) => !v);
              }}
            >
              <GearIcon />
            </button>

            {gearOpen && (
              <div className="appshell-gear-panel" role="menu">
                <button className="appshell-gear-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
                {/* futuros ítems */}
              </div>
            )}

            <button
              type="button"
              className="appshell-closebtn"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="drawer-body" onClick={() => gearOpen && setGearOpen(false)}>
          <Menu
            orgOpen={orgOpen}
            setOrgOpen={setOrgOpen}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Spacer para no tapar contenido con la navbar */}
      <div style={{ height: "56px" }} />
      <Outlet />
    </>
  );
}

function Menu({ orgOpen, setOrgOpen, onNavigate }) {
  return (
    <div className="appshell-menu">
      <a
        href="/principal"
        onClick={(e) => { e.preventDefault(); onNavigate("/principal"); }}
        className="nav-link"
      >
        Inicio
      </a>

      {/* Acordeón controlado por React */}
      <div className="appshell-accordion-outer">
        <button
          className={`appshell-accordion-trigger ${orgOpen ? "open" : ""}`}
          onClick={() => setOrgOpen((v) => !v)}
          aria-expanded={orgOpen}
        >
          Organización del Coro
          <span className="appshell-accordion-caret">{orgOpen ? "▴" : "▾"}</span>
        </button>

        {orgOpen && (
          <div className="appshell-accordion-content">
            <a
              href="/cuerdas"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); onNavigate("/cuerdas"); }}
            >
              Cuerdas
            </a>
            <a
              href="/organizacion-coro"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); onNavigate("/organizacion-coro"); }}
            >
              Áreas
            </a>
            <a
              href="/miembros"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); onNavigate("/miembros"); }}
            >
              Miembros
            </a>
          </div>
        )}
      </div>

      {[
        ["/asistencias", "Asistencias"],
        ["/audiciones", "Audiciones"],
        ["/canciones", "Canciones"],
        ["/eventos", "Eventos"],
        ["/fraternidades", "Fraternidades"],
        ["/usuarios-roles", "Usuarios y roles"],
      ].map(([to, label]) => (
        <a
          key={to}
          href={to}
          onClick={(e) => { e.preventDefault(); onNavigate(to); }}
          className="nav-link"
        >
          {label}
        </a>
      ))}
    </div>
  );
}
