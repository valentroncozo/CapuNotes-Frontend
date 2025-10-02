import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { PencilFill, XCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import AgregarModificarMiembro from './agregarModificarMiembro';
import * as miembrosApi from '../services/miembros'; // ❌ MAL
import Header from './Header';
import './miembro.css';

const Miembros = ({ onClose }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('registro'); // 'registro' o 'modificacion'
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [filtro, setFiltro] = useState('');

  // --- Navegación / cierre ---
  const handleClose = () => {
    if (onClose) onClose();
    navigate('/menu');
  };

  const handleCustomBack = () => {
    // Lógica personalizada para volver
    navigate(-1);
  };

  // --- Cargar miembros al inicio ---
  useEffect(() => {
    cargarMiembros();
  }, []);

  const cargarMiembros = async () => {
    try {
      const data = await miembrosApi.listar();
      setMiembros(data);
    } catch (err) {
      console.error('Error al cargar miembros:', err);
    }
  };

  // --- Buscar miembros ---
  const handleBuscar = async () => {
    try {
      if (filtro.trim() === '') {
        cargarMiembros();
      } else {
        const data = await miembrosApi.buscar(filtro);
        setMiembros(data);
      }
    } catch (err) {
      console.error('Error en la búsqueda:', err);
    }
  };

  // --- Abrir formulario vacío ---
  const handleAgregar = () => {
    setFormMode('registro');
    setMiembroSeleccionado(null);
    setShowForm(true);
  };

  // --- Abrir formulario con datos ---
  const handleModificar = (miembro) => {
    setFormMode('modificacion');
    setMiembroSeleccionado(miembro);
    setShowForm(true);
  };

  // --- Cerrar formulario ---
  const handleCancel = () => {
    setShowForm(false);
    setMiembroSeleccionado(null);
  };

  // --- Guardar (alta o modificación) ---
  const handleSubmit = async (data) => {
    try {
      if (formMode === 'registro') {
        await miembrosApi.crear(data);
      } else {
        await miembrosApi.actualizar(data);
      }
      cargarMiembros();
      setShowForm(false);
    } catch (err) {
      console.error('Error al guardar miembro:', err);
      alert('No se pudo guardar el miembro');
    }
  };

  // --- Eliminar ---
  const handleEliminar = async (miembro) => {
    if (!window.confirm('¿Seguro que deseas eliminar este miembro?')) return;
    try {
      await miembrosApi.eliminar(miembro.numeroDni, miembro.tipoDni);
      cargarMiembros();
    } catch (err) {
      console.error('Error al eliminar miembro:', err);
      alert('No se pudo eliminar el miembro');
    }
  };

  return (
    <Container fluid className="miembros-container">
      {/* Header con comportamiento personalizado */}
      <Header
        title="Perfil de Miembro"
        showMenuButton={true}
        showCloseButton={true}
        onMenuClick={handleCustomBack} // Comportamiento personalizado
      />

      {!showForm ? (
        <>
          {/* Botón cerrar */}
          <button
            className="menu-close"
            onClick={handleClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>

          {/* Header */}
          <Row className="mb-4 align-items-center">
            <Col xs="auto">
              <div className="header-icon"></div>
            </Col>
            <Col>
              <h2 className="miembros-title">Miembros</h2>
            </Col>
          </Row>

          {/* Buscador + botón agregar */}
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
              <div className="miembros-label">Miembros registrados:</div>
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
