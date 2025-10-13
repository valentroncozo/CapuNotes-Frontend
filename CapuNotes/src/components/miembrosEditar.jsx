import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import './miembrosAgregar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function MiembrosEditar() {
  const emptyMiembro = { nombre: '', cuerda: '', area: '', estado: '' };
  const [miembro, setMiembro] = useState(emptyMiembro);
  const [listaMiembros, setListaMiembros] = useState([]);
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  // const estado = [
  //   { nombre: 'Activo' },
  //   { nombre: 'Inactivo' },
  // ];
  const [editIndex, setEditIndex] = useState(null);
  const areasDisponibles = [
    { nombre: 'Técnica Vocal' },
    { nombre: 'Guitarra' },
    { nombre: 'Bajo' },
    { nombre: 'Batería' },
  ];
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {/* VOLVER */}
            <Button variant="link" className="p-0" onClick={() => navigate(-1)} title="Volver">
              <ArrowBackIcon 
                    style={{ color: '#fff', fontSize: '28px' }} // Ajusta el tamaño y color
                /> 
            </Button>
              <h1 className="titulo-formulario-miembros" style={{ margin: 0 }}>Editar de miembro</h1>
            </div>
            <Form onSubmit={handleSubmit} className="d-flex flex-column">
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={miembro.nombre}
                onChange={handleChange}
                className="form-control"
              />

              <Form.Group className="form-group-miembro">
                <Form.Control
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={miembro.apellido || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <Form.Select
                  name="tipoDocumento"
                  value={miembro.tipoDocumento || ''}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Tipo de documento</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Libreta Cívica">Libreta Cívica</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <Form.Control
                  type="text"
                  name="numeroDocumento"
                  placeholder="Número de documento"
                  value={miembro.numeroDocumento || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  placeholder="Fecha de nacimiento"
                  value={miembro.fechaNacimiento || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <Form.Control
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={miembro.correo || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <Form.Control
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={miembro.telefono || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <Form.Control
                  type="text"
                  name="provincia"
                  placeholder="Provincia"
                  value={miembro.provincia || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Row className="mb-3 align-items-center">
                <Form.Group className='form-group-miembro'>
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
                </Form.Group>
              </Row>

              <Row className="mb-3 align-items-center">
                <Col xs={13}>
              <Form.Group className='form-group-miembro'>
                <Form.Select
                  name="area"
                  value={miembro.area}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar área</option>
                  {areasDisponibles.map((a, index) => (
                    <option key={index} value={a.nombre}>
                      {a.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              </Col>
              </Row>

              {/* 
              <Row className="mb-3 align-items-center">
                <Col xs={10}>
              <Form.Group className="form-group-miembro">
                <Form.Select
                  name="estado"
                  value={miembro.estado || ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar estado</option>
                  {estado.map((c, index) => (
                    <option key={index} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              </Col>
              </Row> */}

              <button type="submit" className="btn-submit-form">
                {editIndex !== null ? 'GUARDAR CAMBIOS' : 'Agregar miembro'}
              </button>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
}
