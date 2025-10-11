import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './miembros.css';
import { Link } from 'react-router-dom';

export default function Miembros() {
  const navigate = useNavigate();
  const [listaMiembros, setListaMiembros] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const dataGuardada = localStorage.getItem('capunotes_miembros');
    if (dataGuardada) setListaMiembros(JSON.parse(dataGuardada));
  }, []);

  const miembrosFiltrados = listaMiembros.filter((m) => {
    if (!filtro) return true;
    const q = filtro.toLowerCase();
    return m.nombre && m.nombre.toLowerCase().includes(q);
  });

  const handleAgregar = () => {
    navigate('/miembros/agregar');
  };

  const handleBuscar = () => {
    // filtro ya se aplica automáticamente
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
            <Link className="nav-link" to="/principal">
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

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="pantalla-miembros" style={{ marginTop: '70px' }}>
        <Container>
          {/* Título */}
          <Row className="mb-4">
            <Col xs={12}>
              <h2 className="miembros-title text-center">Miembros del Coro</h2>
            </Col>
          </Row>

          {/* Barra de búsqueda + botones */}
          <Row className="mb-4 align-items-center">
            <Col xs={12} md={8} className="mb-2 mb-md-0">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre"
                  className="search-input"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                />
              </InputGroup>
            </Col>

            <Col xs={12} md={4} className="text-md-end">
              <div className="botonera-miembros">
                <Button className="btn-agregar" onClick={handleAgregar}>
                  Agregar Miembro
                </Button>
              </div>
            </Col>
          </Row>

          {/* Tabla de miembros */}
          <div className="tabla-wrapper">
            <Table className="tabla-miembros" responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cuerda</th>
                  <th>Área</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {miembrosFiltrados.length > 0 ? (
                  miembrosFiltrados.map((m, index) => (
                    <tr key={`${m.nombre}-${index}`}>
                      <td>{m.nombre}</td>
                      <td>{m.cuerda || '-'}</td>
                      <td>{m.area || '-'}</td>
                      <td>{m.estado || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No hay miembros registrados</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </>
  );
}
