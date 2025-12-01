// src/components/layout/AppShell.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext.jsx"; // ⭐ TRAEMOS EL USUARIO

import "@/styles/offcanvas.css";
import LogOutIcon from "@/assets/LogOutIcon";

/* Ícono cierre */
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
  const { usuario } = useUser(); // ⭐ obtenemos usuario y rol
  const rol = usuario?.rol;

  // Helpers de permisos
  const esFull = rol === "SUPERADMIN" || rol === "COORDINADOR";
  const esAdmin = rol === "ADMINISTRADOR";

  const [open, setOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [audOpen, setAudOpen] = useState(false);
  const [songsOpen, setSongsOpen] = useState(false);
  const [gearOpen, setGearOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) setGearOpen(false);
  }, [open]);

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

      {/* CONTENEDOR DRAWER */}
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

        <div className="drawer-body">
          <Menu
            orgOpen={orgOpen}
            setOrgOpen={setOrgOpen}
            audOpen={audOpen}
            setAudOpen={setAudOpen}
            songsOpen={songsOpen}
            setSongsOpen={setSongsOpen}
            onNavigate={handleNavigate}
            rol={rol}
          />
        </div>
      </div>

      {open && (
        <div
          className="drawer-backdrop"
          role="presentation"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div style={{ height: "40px" }} />
      <Outlet />
    </>
  );
}

/* ============================
      MENU COMPLETO
=============================== */
function Menu({
  orgOpen,
  setOrgOpen,
  audOpen,
  setAudOpen,
  songsOpen,
  setSongsOpen,
  onNavigate,
  rol,
}) {
  const esFull = rol === "SUPERADMIN" || rol === "COORDINADOR";
  const esAdmin = rol === "ADMINISTRADOR";

  return (
    <div className="appshell-menu">
      {/* Inicio */}
      <a
        href="/principal"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/principal");
        }}
        className="nav-link"
      >
        Inicio
      </a>

      {/* Asistencias → todos */}
      <a
        href="/asistencias"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/asistencias");
        }}
        className="nav-link"
      >
        Asistencias
      </a>

      {/* Reportes → todos */}
      <a
        href="/reportes"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/reportes");
        }}
        className="nav-link"
      >
        Reportes
      </a>

      {/* Canciones → todos */}
      <div className="appshell-accordion-outer">
        <button
          className={`appshell-accordion-trigger ${songsOpen ? "open" : ""}`}
          onClick={() => setSongsOpen((v) => !v)}
        >
          Canciones
          <span className="appshell-accordion-caret">{songsOpen ? "▴" : "▾"}</span>
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

      {/* Eventos → todos */}
      <a
        href="/eventos"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/eventos");
        }}
        className="nav-link"
      >
        Eventos
      </a>

      {/* AUDICIONES — solo FULL */}
      {/* ============================================================
     AUDICIONES – PERMISOS SEGÚN ROL
   ============================================================ */}

      {/* ⭐ FULL ACCESS (SUPERADMIN / COORDINADOR) */}
      {esFull && (
        <div className="appshell-accordion-outer">
          <button
            className={`appshell-accordion-trigger ${audOpen ? "open" : ""}`}
            onClick={() => setAudOpen((v) => !v)}
            aria-expanded={audOpen}
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

              {/* ⭐ SE AGREGA ESTA OPCIÓN QUE FALTABA */}
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


      {/* ⭐ ADMINISTRADOR — VE SOLO CANDIDATOS ADMIN */}
      {esAdmin && (
        <div className="appshell-accordion-outer">
          <button
            className={`appshell-accordion-trigger ${audOpen ? "open" : ""}`}
            onClick={() => setAudOpen((v) => !v)}
            aria-expanded={audOpen}
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


      {/* ORGANIZACIÓN DEL CORO — solo SUPERADMIN / COORDINADOR */}
      {esFull && (
        <div className="appshell-accordion-outer">
          <button
            className={`appshell-accordion-trigger ${orgOpen ? "open" : ""}`}
            onClick={() => setOrgOpen((v) => !v)}
          >
            Organización del Coro
            <span className="appshell-accordion-caret">{orgOpen ? "▴" : "▾"}</span>
          </button>

          {orgOpen && (
            <div className="appshell-accordion-content">
              <a
                href="/areas"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/areas");
                }}
              >
                Áreas
              </a>

              <a
                href="/cuerdas"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/cuerdas");
                }}
              >
                Cuerdas
              </a>

              <a
                href="/miembros"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/miembros");
                }}
              >
                Miembros
              </a>

              <a
                href="/fraternidades"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/fraternidades");
                }}
              >
                Fraternidades
              </a>
            </div>
          )}
        </div>
      )}

      {/* USUARIOS Y ROLES → solo SUPERADMIN / COORDINADOR */}
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
