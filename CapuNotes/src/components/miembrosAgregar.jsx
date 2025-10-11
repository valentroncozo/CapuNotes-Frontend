import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './miembros.css';
import { Link } from 'react-router-dom';

export default function MiembrosAgregar() {
  const emptyMiembro = { nombre: '', cuerda: '', area: '', estado: '' };
  const [miembro, setMiembro] = useState(emptyMiembro);
  const [listaMiembros, setListaMiembros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cuerdasGuardadas = JSON.parse(localStorage.getItem('capunotes_cuerdas')) || [];
    setCuerdasDisponibles(cuerdasGuardadas);
}, []);

  useEffect(() => {
    localStorage.setItem('capunotes_miembros', JSON.stringify(listaMiembros));
  }, [listaMiembros]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!miembro.nombre || !miembro.cuerda) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor completá al menos Nombre y Cuerda.',
      });
      return;
    }

    if (editIndex !== null) {
      const nueva = [...listaMiembros];
      nueva[editIndex] = miembro;
      setListaMiembros(nueva);
      setEditIndex(null);
      Swal.fire({ icon: 'success', title: 'Miembro actualizado', text: `${miembro.nombre} actualizado correctamente.`, timer: 1800, showConfirmButton: false });
    } else {
      setListaMiembros([...listaMiembros, miembro]);
      Swal.fire({ icon: 'success', title: 'Miembro registrado', text: `Se registró ${miembro.nombre} exitosamente.`, timer: 1800, showConfirmButton: false });
    }

    setMiembro(emptyMiembro);
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

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="pantalla-miembros" style={{ marginTop: '70px' }}>
        <Container className="pt-5">
          <div className="formulario-miembros">
            <h2>{editIndex !== null ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}</h2>
            <Form onSubmit={handleSubmit} className="d-flex flex-column">
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={miembro.nombre}
                onChange={handleChange}
                className="mb-3"
              />

              <Row className="mb-3 align-items-center">
                <Col xs={10}>
                <Form.Select
                  name="cuerda"
                  value={miembro.cuerda}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar cuerda</option>
                  {cuerdasDisponibles.map((c, index) => (
                    <option key={index} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
                </Col>
                <Col xs={2} className="text-end">
                  <Button
                    variant="warning"
                    className="btn-agregar-cuerda"
                    onClick={() => navigate('/cuerdas')}
                    title="Gestionar cuerdas"
                  >
                    🎵 Cuerdas
                  </Button>
                </Col>
              </Row>

              <Form.Control
                type="text"
                name="area"
                placeholder="Área"
                value={miembro.area}
                onChange={handleChange}
                className="mb-3"
              />
              <Form.Control
                type="text"
                name="estado"
                placeholder="Estado"
                value={miembro.estado}
                onChange={handleChange}
                className="mb-3"
              />

              <Button type="submit" className="btn btn-success mt-2">
                {editIndex !== null ? 'GUARDAR CAMBIOS' : 'REGISTRAR'}
              </Button>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
}
