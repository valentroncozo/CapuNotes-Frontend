// src/components/layout/AppShell.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext.jsx";

import "@/styles/offcanvas.css";
import LogOutIcon from "@/assets/LogOutIcon";

// Ícono de cierre
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

export default function AppShell({ onLogout }) {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const rol = usuario?.rol;

  const esFull = rol === "SUPERADMIN" || rol === "COORDINADOR";
  const esAdmin = rol === "ADMINISTRADOR";

  const [open, setOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [audOpen, setAudOpen] = useState(false);
  const [songsOpen, setSongsOpen] = useState(false);
  const [gearOpen, setGearOpen] = useState(false);

  // Cerrar drawer con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      {/* NAV SUPERIOR — agregado z-index alto */}
      <nav
        className="navbar fixed-top navbar-dark appshell-navbar"
        style={{ zIndex: 1050 }}
      >
        <button
          className="navbar-toggler appshell-toggle"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      {/* DRAWER */}
      <div className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <h5 className="offcanvas-title">Menú</h5>

          <div className="appshell-header-controls">
            {/* Logout */}
            <button
              className="appshell-gearbtn"
              type="button"
              aria-label="Cerrar sesión"
              onClick={(e) => {
                e.stopPropagation();
                setGearOpen((v) => !v);
              }}
            >
              <LogOutIcon fill="var(--text-light)" />
            </button>

            {gearOpen && (
              <div className="appshell-gear-panel" role="menu">
                <button className="appshell-gear-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}

            {/* Close drawer */}
            <button
              type="button"
              className="appshell-closebtn"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          <Menu
            rol={rol}
            orgOpen={orgOpen}
            setOrgOpen={setOrgOpen}
            audOpen={audOpen}
            setAudOpen={setAudOpen}
            songsOpen={songsOpen}
            setSongsOpen={setSongsOpen}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {open && (
        <div
          className="drawer-backdrop"
          role="presentation"
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{ zIndex: 999 }}
        />
      )}

      <div style={{ height: "40px" }} />

      {/* Outlet donde van las páginas */}
      <Outlet />
    </>
  );
}

/* ===========================
    MENÚ PRINCIPAL COMPLETO
=========================== */

function Menu({
  rol,
  orgOpen,
  setOrgOpen,
  audOpen,
  setAudOpen,
  songsOpen,
  setSongsOpen,
  onNavigate,
}) {
  const esFull = rol === "SUPERADMIN" || rol === "COORDINADOR";
  const esAdmin = rol === "ADMINISTRADOR";

  return (
    <div className="appshell-menu">
      {/* Inicio */}
      <a
        href="/principal"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/principal");
        }}
      >
        Inicio
      </a>

      {/* Asistencias */}
      <a
        href="/asistencias"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/asistencias");
        }}
      >
        Asistencias
      </a>

      {/* Reportes */}
      <a
        href="/reportes"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/reportes");
        }}
      >
        Reportes
      </a>

      {/* Canciones */}
      <div className="appshell-accordion-outer">
        <button
          className={`appshell-accordion-trigger ${songsOpen ? "open" : ""}`}
          onClick={() => setSongsOpen((v) => !v)}
        >
          Canciones
          <span className="appshell-accordion-caret">
            {songsOpen ? "▴" : "▾"}
          </span>
        </button>

        {songsOpen && (
          <div className="appshell-accordion-content">
            <a
              href="/canciones"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/canciones");
              }}
            >
              Cancionero
            </a>

            <a
              href="/repertorios"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/repertorios");
              }}
            >
              Repertorios
            </a>

            <a
              href="/tiempos-liturgicos"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/tiempos-liturgicos");
              }}
            >
              Tiempos litúrgicos
            </a>

            <a
              href="/categorias-canciones"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/categorias-canciones");
              }}
            >
              Categorías
            </a>
          </div>
        )}
      </div>

      {/* Eventos */}
      <a
        href="/eventos"
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/eventos");
        }}
      >
        Eventos
      </a>

      {/* AUDICIONES (full access) */}
      {esFull && (
        <div className="appshell-accordion-outer">
          <button
            className={`appshell-accordion-trigger ${audOpen ? "open" : ""}`}
            onClick={() => setAudOpen((v) => !v)}
          >
            Audiciones
            <span className="appshell-accordion-caret">
              {audOpen ? "▴" : "▾"}
            </span>
          </button>

          {audOpen && (
            <div className="appshell-accordion-content">
              <a
                href="/audicion"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/audicion");
                }}
              >
                Audición
              </a>

              <a
                href="/audicion/candidatos"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/audicion/candidatos");
                }}
              >
                Cronograma de candidatos
              </a>

              <a
                href="/candidatos-administracion"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/candidatos-administracion");
                }}
              >
                Cronograma de turnos
              </a>

              <a
                href="/audicion/historial"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/audicion/historial");
                }}
              >
                Historial Candidatos
              </a>

              <a
                href="/cuestionario/configuracion"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/cuestionario/configuracion");
                }}
              >
                Configurar Cuestionario
              </a>
            </div>
          )}
        </div>
      )}

      {/* AUDICIONES SOLO CORDINADOR ADMIN */}
      {esAdmin && (
        <div className="appshell-accordion-outer">
          <button
            className={`appshell-accordion-trigger ${audOpen ? "open" : ""}`}
            onClick={() => setAudOpen((v) => !v)}
          >
            Audiciones
            <span className="appshell-accordion-caret">
              {audOpen ? "▴" : "▾"}
            </span>
          </button>

          {audOpen && (
            <div className="appshell-accordion-content">
              <a
                href="/candidatos-administracion"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/candidatos-administracion");
                }}
              >
                Cronograma de turnos
              </a>
            </div>
          )}
        </div>
      )}

      {/* Organización del coro */}
      {esFull && (
        <div className="appshell-accordion-outer">
          <button
            className={`appshell-accordion-trigger ${orgOpen ? "open" : ""}`}
            onClick={() => setOrgOpen((v) => !v)}
          >
            Organización del Coro
            <span className="appshell-accordion-caret">
              {orgOpen ? "▴" : "▾"}
            </span>
          </button>

          {orgOpen && (
            <div className="appshell-accordion-content">
              <a href="/areas" className="nav-link" onClick={(e) => {e.preventDefault(); onNavigate("/areas");}}>Áreas</a>
              <a href="/cuerdas" className="nav-link" onClick={(e) => {e.preventDefault(); onNavigate("/cuerdas");}}>Cuerdas</a>
              <a href="/miembros" className="nav-link" onClick={(e) => {e.preventDefault(); onNavigate("/miembros");}}>Miembros</a>
              <a href="/fraternidades" className="nav-link" onClick={(e) => {e.preventDefault(); onNavigate("/fraternidades");}}>Fraternidades</a>
            </div>
          )}
        </div>
      )}

      {/* Usuarios y Roles */}
      {esFull && (
        <a
          href="/usuarios-roles"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/usuarios-roles");
          }}
        >
          Usuarios y Roles
        </a>
      )}
    </div>
  );
}
