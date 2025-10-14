import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../../styles/miembrosAgregar.css';
import BackButton from '../utils/BackButton';


export default function MiembrosEditar() {
  const location = useLocation();
  const navigate = useNavigate();
  const miembro = location.state?.miembro;
  const cuerdasDisponibles = JSON.parse(localStorage.getItem("capunotes_cuerdas")) || [];
  const areasDisponibles = JSON.parse(localStorage.getItem("capunotes_areas")) || [];
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    provincia: "",
    cuerda: "",
  });
  

  useEffect(() => {
  if (miembro) {
    setFormData({
      nombre: miembro.nombre || "",
      apellido: miembro.apellido || "",
      tipoDocumento: miembro.tipoDocumento || "",
      numeroDocumento: miembro.numeroDocumento || "",
      fechaNacimiento: miembro.fechaNacimiento || "",
      correo: miembro.correo || "",
      telefono: miembro.telefono || "",
      provincia: miembro.provincia || "",
      cuerda: miembro.cuerda || "",
    });
  }
}, [miembro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtener miembros del localStorage
    const miembros = JSON.parse(localStorage.getItem("capunotes_miembros")) || [];

    // Buscar y actualizar el miembro que coincide por nombre
    const actualizados = miembros.map((m) =>
      m.nombre === miembro.nombre ? { ...m, ...formData } : m
    );

    localStorage.setItem("capunotes_miembros", JSON.stringify(actualizados));

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

    {/* === CONTENIDO PRINCIPAL === */}
    <div className="pantalla-miembros" style={{ marginTop: '70px' }}>
    <Container  className="pt-5">
      <div className="formulario-miembros">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {/* VOLVER */}
              <BackButton />
              <h1 className="titulo-formulario-miembros" style={{ margin: 0 }}>Modificacion de miembro</h1>
            </div>
            <hr className="divisor-amarillo" />

      <Form onSubmit={handleSubmit} className="d-flex flex-column">
        <Form.Group className="">
            <label className="form-label text-white">Nombre</label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Apellido</label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Tipo de Documento</label>
            <Form.Select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">...</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Número de Documento</label>
            <Form.Control
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>
    
          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Fecha de Nacimiento</label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Correo Electrónico</label>
            <Form.Control
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Teléfono</label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label className="form-label text-white">Provincia</label>
            <Form.Control
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className='form-group-agregar-cuerda'>
                    <label className="label-cuerda">Cuerda</label>
                    <Form.Select className='select-cuerda'
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
    
                      <Button
                        variant="warning"
                        className="btn-agregar-cuerda"
                        onClick={() => navigate('/cuerdas')}
                        title="Gestionar cuerdas"
                      >
                        +
                      </Button>
                  </Form.Group>

              <Row className="mb-3 align-items-center">
                <Col xs={13}>
              <Form.Group className='form-group-miembro'>
                <label className="form-label text-white">Area</label>
                <Form.Select
                  name="area"
                  value={formData.area}
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

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary w-50 me-2" onClick={() => navigate("/miembros")}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-warning w-50">
            Guardar Cambios
          </button>
        </div>
      </Form>
      </div>
    </Container>
    </div>
    </>
  );
}