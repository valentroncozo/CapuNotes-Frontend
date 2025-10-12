import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";
import "./miembrosModificar.css";
import { Link } from "react-router-dom";  

export default function MiembrosModificar() {
  const location = useLocation();
  const navigate = useNavigate();
  const miembro = location.state?.miembro;

  const [nombre, setNombre] = useState(miembro?.nombre || "");
  const [cuerda, setCuerda] = useState(miembro?.cuerda || "");
  const [area, setArea] = useState(miembro?.area || "");
  const [estado, setEstado] = useState(miembro?.estado || "");

  useEffect(() => {
    if (!miembro) {
      // Si entraron directo sin pasar datos, volver a la lista
      navigate("/miembros");
    }
  }, [miembro, navigate]);

  const handleGuardar = (e) => {
    e.preventDefault();
    const lista = JSON.parse(localStorage.getItem("capunotes_miembros")) || [];
    const nuevaLista = lista.map((m) =>
      m.nombre === miembro.nombre
        ? { ...m, nombre, cuerda, area, estado }
        : m
    );
    localStorage.setItem("capunotes_miembros", JSON.stringify(nuevaLista));
    navigate("/miembros");
  };

  return (
    <>
      {/* === NAVBAR CON OFFCANVAS === */}
      <nav className="navbar fixed-top navbar-dark" style={{ padding: '10px' }}>
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
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <Link className="nav-link" to="/inicio">
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

    <div className="pantalla-miembros-editar">
      <Container>
        <h2 className="miembros-title text-center mb-4">Editar Miembro</h2>

        <Form onSubmit={handleGuardar} className="form-editar-miembro">
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cuerda</Form.Label>
            <Form.Control
              type="text"
              value={cuerda}
              onChange={(e) => setCuerda(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Área</Form.Label>
            <Form.Control
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate("/miembros")}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-guardar">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Container>
    </div>
    </>
  );
}
