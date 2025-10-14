import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/miembrosAgregar.css';

import BackButton from '../utils/BackButton';

export default function MiembrosAgregar() {
  const emptyMiembro = { nombre: '', cuerda: '', area: '', estado: '' };
  const [miembro, setMiembro] = useState(emptyMiembro);
  const [listaMiembros, setListaMiembros] = useState([]);
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
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
            <div>
        {/* Añadimos 'navbar-dark' para el ícono blanco.
        Usamos 'backgroundColor' en 'style' para forzar el color exacto. 
      */}
        <nav
          className="navbar fixed-top w-100 navbar-dark"
          style={{ padding: '10px' }}
        >
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
      <h5 className="offcanvas-title" id="offcanvasMenuLabel">
        Menú
      </h5>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
      {/* Botón cerrar sesión CORREGIDO */}
      <button
          type="button"
          className="nav-link btn" // Mantenemos nav-link para el estilo de color y btn
          // ✅ CORRECCIÓN: Quitamos los estilos en línea que fuerzan el padding y el textAlign
          // Dejamos solo los estilos esenciales que no pueden ir en CSS
          style={{ color: '#E8EAED', background: 'transparent', border: 'none' }} 
          data-bs-dismiss="offcanvas"
          onClick={() => { if (onLogout) onLogout(); }}
      >
          Cerrar sesión
      </button>
    </div>
    <div className="offcanvas-body">
      <Link className="nav-link" to="/inicio" >
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

        {/* Esto es solo para que el contenido no quede debajo de la navbar */}
        <div style={{ marginTop: '60px' }}></div>
      </div>
    
      {/* === CONTENIDO PRINCIPAL === */}
      <div className="pantalla-miembros" style={{ marginTop: '70px' }}>
        <Container className="pt-5">
          <div className="formulario-miembros">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {/* VOLVER */}
            <BackButton />
              <h1 className="titulo-formulario-miembros" style={{ margin: 0 }}>Registro de miembro</h1>
            </div>
            <hr className="divisor-amarillo" />

            <Form onSubmit={handleSubmit} className="d-flex flex-column">
              <label className="form-label text-white">Nombre</label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Ej: Juan"
                value={miembro.nombre}
                onChange={handleChange}
                className="form-control"
              />

              <Form.Group className="form-group-miembro">
                <label className="form-label text-white">Apellido</label>
                <Form.Control
                  type="text"
                  name="apellido"
                  placeholder="Ej: Pérez"
                  value={miembro.apellido || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <label className="form-label text-white">Tipo de Documento</label>
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
                <label className="form-label text-white">Número de Documento</label>
                <Form.Control
                  type="text"
                  name="numeroDocumento"
                  placeholder="Ej: 40123456"
                  value={miembro.numeroDocumento || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <label className="form-label text-white">Fecha de Nacimiento</label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  placeholder="Ej: 01/01/1990"
                  value={miembro.fechaNacimiento || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <label className="form-label text-white">Correo Electrónico</label>
                <Form.Control
                  type="email"
                  name="correo"
                  placeholder="Ej: juanperez@mail.com"
                  value={miembro.correo || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <label className="form-label text-white">Teléfono</label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  placeholder="Ej: +54 11 1234-5678"
                  value={miembro.telefono || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group-miembro">
                <label className="form-label text-white">Provincia</label>
                <Form.Control
                  type="text"
                  name="provincia"
                  placeholder="Ej: Buenos Aires"
                  value={miembro.provincia || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Row className="mb-3 align-items-center">
                <Col xs={10}>
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
                </Col>

                <Col xs={1} className="text-end">
                  <Button
                    variant="warning"
                    className="btn-agregar-cuerda"
                    onClick={() => navigate('/cuerdas')}
                    title="Gestionar cuerdas"
                  >
                    +
                  </Button>
                </Col>
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
