import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { PencilFill, XCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 👈 ícono de flecha atrás
import './miembro.css';

const STORAGE_KEY = 'capunotes_miembros_v1';

const Miembros = ({ onClose }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('registro');
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [filtro, setFiltro] = useState('');

  // --- Navegación / cierre ---
  const handleClose = () => {
    if (onClose) onClose();
    navigate('/menu');
  };

  // --- Cargar miembros al inicio ---
  useEffect(() => {
    cargarMiembros();
  }, []);

  const cargarMiembros = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      setMiembros(data);
      return data;
    } catch (err) {
      console.error('Error al cargar miembros desde localStorage:', err);
      setMiembros([]);
      return [];
    }
  };

  const persistirMiembros = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error al persistir miembros en localStorage:', err);
    }
  };

  const buscarMiembros = (termino) => {
    const all = cargarMiembros();
    if (!termino || termino.trim() === '') return all;
    const lower = termino.toLowerCase();
    return all.filter((m) => {
      const nombreCompleto = `${m.nombre || ''} ${
        m.apellido || ''
      }`.toLowerCase();
      const cuerda = (m.cuerda?.name || '').toLowerCase();
      return nombreCompleto.includes(lower) || cuerda.includes(lower);
    });
  };

  const crearMiembro = (miembro) => {
    const all = cargarMiembros();
    const newMember = { ...miembro };
    if (!newMember.numeroDni) newMember.numeroDni = Date.now();
    if (!newMember.tipoDni) newMember.tipoDni = 'X';
    const exists = all.find(
      (m) =>
        `${m.numeroDni}-${m.tipoDni}` ===
        `${newMember.numeroDni}-${newMember.tipoDni}`
    );
    if (exists) throw new Error('Miembro ya existe');
    const updated = [...all, newMember];
    persistirMiembros(updated);
    setMiembros(updated);
  };

  const actualizarMiembro = (miembro) => {
    const all = cargarMiembros();
    const idx = all.findIndex(
      (m) =>
        `${m.numeroDni}-${m.tipoDni}` ===
        `${miembro.numeroDni}-${miembro.tipoDni}`
    );
    if (idx === -1) throw new Error('Miembro no encontrado');
    const updated = [...all];
    updated[idx] = { ...updated[idx], ...miembro };
    persistirMiembros(updated);
    setMiembros(updated);
  };

  const eliminarMiembroLocal = (numeroDni, tipoDni) => {
    const all = cargarMiembros();
    const updated = all.filter(
      (m) => `${m.numeroDni}-${m.tipoDni}` !== `${numeroDni}-${tipoDni}`
    );
    persistirMiembros(updated);
    setMiembros(updated);
  };

  const handleBuscar = () => {
    try {
      if (filtro.trim() === '') {
        cargarMiembros();
      } else {
        const data = buscarMiembros(filtro);
        setMiembros(data);
      }
    } catch (err) {
      console.error('Error en la búsqueda:', err);
    }
  };

  const handleAgregar = () => {
    setFormMode('registro');
    setMiembroSeleccionado(null);
    setShowForm(true);
  };

  const handleModificar = (miembro) => {
    setFormMode('modificacion');
    setMiembroSeleccionado(miembro);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setMiembroSeleccionado(null);
  };

  const handleSubmit = (data) => {
    try {
      if (formMode === 'registro') {
        crearMiembro(data);
      } else {
        actualizarMiembro(data);
      }
      cargarMiembros();
      setShowForm(false);
    } catch (err) {
      console.error('Error al guardar miembro:', err);
      alert('No se pudo guardar el miembro');
    }
  };

  const handleEliminar = (miembro) => {
    if (!window.confirm('¿Seguro que deseas eliminar este miembro?')) return;
    try {
      eliminarMiembroLocal(miembro.numeroDni, miembro.tipoDni);
      cargarMiembros();
    } catch (err) {
      console.error('Error al eliminar miembro:', err);
      alert('No se pudo eliminar el miembro');
    }
  };

  return (
    <Container fluid className="miembros-container">
      {/* Botón cerrar */}
      <button
        className="menu-close"
        onClick={handleClose}
        aria-label="Cerrar menú"
      >
        ✕
      </button>

      {/* Menú hamburguesa */}
      <div>
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
          </div>
          <div className="offcanvas-body">
            <a className="nav-link" href="#">
              Inicio
            </a>
            <a className="nav-link" href="#">
              Asistencias
            </a>
            <a className="nav-link" href="#">
              Audiciones
            </a>
            <a className="nav-link" href="#">
              Canciones
            </a>
            <a className="nav-link" href="#">
              Eventos
            </a>
            <a className="nav-link" href="#">
              Fraternidades
            </a>
            <a className="nav-link" href="#">
              Miembros
            </a>
            <a className="nav-link" href="#">
              Organización del Coro
            </a>
            <a className="nav-link" href="#">
              Usuarios y roles
            </a>
          </div>
        </div>

        <div style={{ marginTop: '60px' }}></div>
      </div>

      {!showForm ? (
        <>
          {/* --- HEADER con icono atrás --- */}
          <Row className="mb-4 align-items-center">
            <Col xs="auto">
              <ArrowBackIcon
                onClick={handleClose}
                className="arrow-back-icon"
                style={{
                  cursor: 'pointer',
                  color: '#ffc107',
                  fontSize: '2rem',
                  marginRight: '10px',
                  transition: 'transform 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#e0a800';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#ffc107';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </Col>
            <Col>
              <h2 className="miembros-title">Miembros</h2>
            </Col>
          </Row>

          {/* Buscador + botones */}
          <Row className="mb-3 align-items-center">
            <Col xs={12} md={8}>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o cuerda"
                className="search-input"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
            </Col>
            <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
              <Button className="btn-agregar me-2" onClick={handleAgregar}>
                Agregar miembro
              </Button>
              <Button className="btn-agregar" onClick={handleBuscar}>
                Buscar
              </Button>
            </Col>
          </Row>

          {/* Tabla de miembros */}
          <Row>
            <Col xs={12}>
              <div className="miembros-label">Miembros registrados</div>
              <div className="tabla-wrapper">
                <Table bordered responsive className="tabla-miembros mb-0">
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
                    {miembros.length > 0 ? (
                      miembros.map((m) => (
                        <tr key={`${m.numeroDni}-${m.tipoDni}`}>
                          <td>
                            <span className="miembro-nombre">
                              {m.nombre} {m.apellido}
                            </span>
                          </td>
                          <td>{m.cuerda?.name || '-'}</td>
                          <td>{m.area?.name || '-'}</td>
                          <td>{m.estado}</td>
                          <td className="acciones">
                            <Button
                              variant="warning"
                              className="btn-accion me-2"
                              onClick={() => handleModificar(m)}
                            >
                              <PencilFill />
                            </Button>
                            <Button
                              variant="warning"
                              className="btn-accion eliminar"
                              onClick={() => handleEliminar(m)}
                            >
                              <XCircleFill />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No hay miembros registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <AgregarModificarMiembro
          titulo={
            formMode === 'registro'
              ? 'Registro de miembro'
              : 'Modificación de miembro'
          }
          datosIniciales={
            formMode === 'modificacion' ? miembroSeleccionado : null
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </Container>
  );
};

export default Miembros;
