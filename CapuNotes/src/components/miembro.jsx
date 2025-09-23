import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { PencilFill, XCircleFill } from 'react-bootstrap-icons';
import AgregarModificarMiembro from './agregarModificarMiembro';
import './miembro.css';

const Miembros = () => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('registro'); // 'registro' o 'modificacion'
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);

  const miembros = [
    {
      id: 1,
      nombre: 'Juan López',
      apellido: 'Lopez',
      tipoDni: 'DNI',
      numeroDni: '42876543',
      fechaNacimiento: '2003-11-02',
      correo: 'juanlopez@gmail.com',
      telefono: '3510000000',
      provincia: 'Córdoba',
      cuerda: 'Tenor',
      area: 'Administración',
      estado: 'Activo',
    },
  ];

  // Abrir formulario vacío para registro
  const handleAgregar = () => {
    setFormMode('registro');
    setMiembroSeleccionado(null);
    setShowForm(true);
  };

  // Abrir formulario con datos para modificación
  const handleModificar = (miembro) => {
    setFormMode('modificacion');
    setMiembroSeleccionado(miembro);
    setShowForm(true);
  };

  // Cerrar formulario
  const handleCancel = () => {
    setShowForm(false);
    setMiembroSeleccionado(null);
  };

  // Acción de submit (puedes agregar lógica real aquí)
  const handleSubmit = (data) => {
    if (formMode === 'registro') {
      // Lógica para agregar miembro
      alert('Miembro registrado:\n' + JSON.stringify(data, null, 2));
    } else {
      // Lógica para modificar miembro
      alert('Miembro modificado:\n' + JSON.stringify(data, null, 2));
    }
    setShowForm(false);
  };

  return (
    <Container fluid className="miembros-container">
      {!showForm ? (
        <>
          <Row className="mb-4 align-items-center">
            <Col xs="auto">
              <div className="header-icon"></div>
            </Col>
            <Col>
              <h2 className="miembros-title">Miembros</h2>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col xs={12} md={8}>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o cuerda"
                className="search-input"
              />
            </Col>
            <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
              <Button className="btn-agregar" onClick={handleAgregar}>
                Agregar miembro
              </Button>
            </Col>
          </Row>
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
                    {miembros.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <span className="miembro-nombre">{m.nombre}</span>
                        </td>
                        <td>{m.cuerda}</td>
                        <td>{m.area}</td>
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
                          >
                            <XCircleFill />
                          </Button>
                        </td>
                      </tr>
                    ))}
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
