import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Offcanvas } from "bootstrap";
import "../../styles/offcanvas.css";

export default function AppShell({ username = "", onLogout }) {
  const navigate = useNavigate();

  const offRef = useRef(null);
  const nextPathRef = useRef(null);
  const logoutPendingRef = useRef(false);

  const cleanupBackdrops = () => {
    document
      .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
      .forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
  };

  useEffect(() => {
    const el = offRef.current;
    if (!el) return;

    const onHidden = () => {
      // si venía logout pendiente, primero ejecutamos onLogout
      if (logoutPendingRef.current) {
        logoutPendingRef.current = false;
        onLogout?.();
      }
      // navega al destino encolado, si lo hay
      const path = nextPathRef.current;
      nextPathRef.current = null;
      if (path) navigate(path);

      cleanupBackdrops();
    };

    el.addEventListener("hidden.bs.offcanvas", onHidden);
    return () => el.removeEventListener("hidden.bs.offcanvas", onHidden);
  }, [navigate, onLogout]);

  const go = (to) => {
    const el = offRef.current;
    const isShown = el?.classList.contains("show");
    if (!el || !isShown) {
      nextPathRef.current = null;
      navigate(to);
      return;
    }
    nextPathRef.current = to;
    try {
      const inst = Offcanvas.getOrCreateInstance(el);
      inst.hide();
    } catch {
      nextPathRef.current = null;
      navigate(to);
      cleanupBackdrops();
    }
  };

  const logout = () => {
    const el = offRef.current;
    const isShown = el?.classList.contains("show");
    if (!el || !isShown) {
      // si el panel ya está cerrado, deslogueamos y navegamos directo
      onLogout?.();
      navigate("/login");
      cleanupBackdrops();
      return;
    }
    // cerrar panel primero; onHidden hará onLogout + navigate('/login')
    logoutPendingRef.current = true;
    nextPathRef.current = "/login";
    try {
      const inst = Offcanvas.getOrCreateInstance(el);
      inst.hide();
    } catch {
      logoutPendingRef.current = false;
      onLogout?.();
      navigate("/login");
      cleanupBackdrops();
    }
  };

  return (
    <>
      {/* Navbar superior fija */}
      <nav className="navbar fixed-top navbar-dark appshell-navbar">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasMenu"
          aria-controls="offcanvasMenu"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="appshell-user">
          {username ? <span className="appshell-hello">Hola, {username}</span> : null}
        </div>
      </nav>

      {/* Offcanvas (menú lateral) */}
      <div
        ref={offRef}
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header appshell-offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>

          <button
            type="button"
            className="btn-close appshell-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>

          <button
            type="button"
            className="nav-link appshell-logout"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>

        <div className="offcanvas-body">
          <Menu onNavigate={go} />
        </div>
      </div>

      {/* Separador para no tapar contenido con la navbar fija */}
      <div style={{ height: "56px" }} />

      {/* Aquí se renderiza cada página */}
      <Outlet />
    </>
  );
}

function Menu({ onNavigate }) {
  const items = [
    { to: "/principal", label: "Inicio" },
    { to: "/asistencias", label: "Asistencias" },
    { to: "/audiciones", label: "Audiciones" },
    { to: "/canciones", label: "Canciones" },
    { to: "/eventos", label: "Eventos" },
    { to: "/fraternidades", label: "Fraternidades" },
    { to: "/miembros", label: "Miembros" },
    { to: "/organizacion-coro", label: "Organización del Coro" },
    { to: "/usuarios-roles", label: "Usuarios y roles" },
  ];

  return (
    <>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={(e) => { e.preventDefault(); onNavigate(it.to); }}
          data-bs-dismiss="offcanvas" /* fallback */
        >
          {it.label}
        </NavLink>
      ))}
    </>
  );
}
