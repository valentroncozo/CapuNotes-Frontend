import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/theme.css";
import "../../styles/offcanvas.css";
import Drawer from "./Drawer.jsx";
import nav from "../../config/nav.jsx";

export default function AppShell({ onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleItem(to) {
    setOpen(false);
    navigate(to);
  }
  function handleLogout() {
    setOpen(false);
    onLogout?.();
    navigate("/login");
  }

  return (
    <>
      <nav className="navbar fixed-top navbar-dark appshell-navbar">
        <button
          className="navbar-toggler appshell-toggle"
          type="button"
          onClick={() => setOpen(true)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sections={nav}
        onItemClick={handleItem}
        onLogout={handleLogout}
      />

      <div style={{ height: "56px" }} />
      <Outlet />
    </>
  );
}
