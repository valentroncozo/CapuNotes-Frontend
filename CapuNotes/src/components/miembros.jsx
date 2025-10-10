import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './miembros.css';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { PencilFill, XCircleFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

export const Miembros = ({ onLogout }) => {
  const navigate = useNavigate();

  const emptyMiembro = {
    nombre: '',
    cuerda: '',
    area: '',
    estado: '',
  };

  const [miembro, setMiembro] = useState(emptyMiembro);
  const [listaMiembros, setListaMiembros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const dataGuardada = localStorage.getItem('capunotes_miembros');
    if (dataGuardada) setListaMiembros(JSON.parse(dataGuardada));
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
      alert('Por favor completá al menos Nombre y Cuerda.');
      return;
    }

    if (editIndex !== null) {
      const nueva = [...listaMiembros];
      nueva[editIndex] = miembro;
      setListaMiembros(nueva);
      setEditIndex(null);
      Swal.fire({
        icon: 'success',
        title: 'Miembro actualizado',
        text: `${miembro.nombre} actualizado correctamente.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      setListaMiembros([...listaMiembros, miembro]);
      Swal.fire({
        icon: 'success',
        title: 'Miembro registrado',
        text: `Se registró ${miembro.nombre} exitosamente.`,
        timer: 1800,
        showConfirmButton: false,
      });
    }

    setMiembro(emptyMiembro);
  };

  const handleModificar = (index) => {
    setMiembro(listaMiembros[index]);
    setEditIndex(index);
  };

  const handleEliminar = (index) => {
  Swal.fire({
    title: '¿Eliminar miembro?',
    text: `Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      const nuevaLista = listaMiembros.filter((_, i) => i !== index);
      setListaMiembros(nuevaLista);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'Miembro eliminado correctamente.',
        timer: 1800,
        showConfirmButton: false,
      });
    }
  });
  };

  const doLogout = () => {
    try { localStorage.removeItem('capunotes_auth'); } catch { /* noop */ }
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar fixed-top w-100 navbar-dark" style={{ padding: '10px', backgroundColor: '#11103a' }}>
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

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <Link className="nav-link" to="/inicio">Inicio</Link>
          <Link className="nav-link" to="/asistencias">Asistencias</Link>
          <Link className="nav-link" to="/audiciones">Audiciones</Link>
          <Link className="nav-link" to="/canciones">Canciones</Link>
          <Link className="nav-link" to="/eventos">Eventos</Link>
          <Link className="nav-link" to="/fraternidades">Fraternidades</Link>
          <Link className="nav-link" to="/miembros">Miembros</Link>
          <Link className="nav-link" to="/organizacion-coro">Organización del Coro</Link>
          <Link className="nav-link" to="/usuarios-roles">Usuarios y roles</Link>
          <button type="button" className="nav-link btn" style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#E8EAED', background: 'transparent', border: 'none' }} data-bs-dismiss="offcanvas" onClick={doLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="container mt-5">
        <Row className="mb-3 align-items-center">
        </Row>

        <div className="pantalla-miembros">
          <div className="formulario-miembros">
            <h2>{editIndex !== null ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}</h2>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
              <input type="text" name="nombre" placeholder="Nombre" value={miembro.nombre} onChange={handleChange} />
              <input type="text" name="cuerda" placeholder="Cuerda" value={miembro.cuerda} onChange={handleChange} />
              <input type="text" name="area" placeholder="Área" value={miembro.area} onChange={handleChange} />
              <input type="text" name="estado" placeholder="Estado" value={miembro.estado} onChange={handleChange} />
              <button type="submit" className="btn btn-success mt-3">{editIndex !== null ? 'GUARDAR CAMBIOS' : 'REGISTRAR'}</button>
            </form>
          </div>
        </div>

        <Row>
          <Col xs={12}>
            <div className="miembros-label">Listado de Miembros</div>
            <div className="tabla-wrapper">
              <Table className="tabla-miembros" responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cuerda</th>
                    <th>Área</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaMiembros.length > 0 ? (
                    listaMiembros.map((m, index) => (
                      <tr key={`${m.nombre}-${index}`}>
                        <td><span className="miembro-nombre">{m.nombre}</span></td>
                        <td>{m.cuerda || '-'}</td>
                        <td>{m.area || '-'}</td>
                        <td>{m.estado || '-'}</td>
                        <td className="acciones">
                          <Button variant="warning" className="btn-accion me-2" onClick={() => handleModificar(index)}><PencilFill /></Button>
                          <Button variant="danger" className="btn-accion eliminar" onClick={() => handleEliminar(index)}><XCircleFill /></Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No hay miembros registrados</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};