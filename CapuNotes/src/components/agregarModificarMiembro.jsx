import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import AgregarCuerda from './agregarCuerda';
import './agregarModificarMiembro.css';

const AgregarModificarMiembro = ({
  titulo,
  datosIniciales,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDni: '',
    numeroDni: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    provincia: '',
    cuerda: '',
    area: '',
  });

  const [showAgregarCuerda, setShowAgregarCuerda] = useState(false);

  useEffect(() => {
    if (datosIniciales) setFormData(datosIniciales);
  }, [datosIniciales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAgregarCuerda = () => {
    setShowAgregarCuerda(true);
  };

  const handleCloseAgregarCuerda = () => {
    setShowAgregarCuerda(false);
  };

  return (
    <Container fluid className="form-container">
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <div className="header-icon"></div>
        </Col>
        <Col>
          <h2 className="form-title">{titulo}</h2>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} className="mb-3">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </Col>
          <Col xs={12} className="mb-3">
            <Form.Label>Apellido:</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </Col>
          <Col xs={6} className="mb-3">
            <Form.Label>Tipo DNI:</Form.Label>
            <Form.Select
              name="tipoDni"
              value={formData.tipoDni}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </Form.Select>
          </Col>
          <Col xs={6} className="mb-3">
            <Form.Label>Número:</Form.Label>
            <Form.Control
              type="text"
              name="numeroDni"
              value={formData.numeroDni}
              onChange={handleChange}
              placeholder="Número"
            />
          </Col>
          <Col xs={12} className="mb-3">
            <Form.Label>Fecha de nacimiento:</Form.Label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <Form.Label>Correo:</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Correo"
            />
          </Col>
          <Col xs={12} className="mb-3">
            <Form.Label>Teléfono:</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
            />
          </Col>
          <Col xs={12} className="mb-3">
            <Form.Label>Provincia:</Form.Label>
            <Form.Control
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              placeholder="Provincia"
            />
          </Col>
          <Col xs={6} className="mb-3 d-flex align-items-end">
            <div style={{ width: '100%' }}>
              <Form.Label>Cuerda:</Form.Label>
              <Form.Select
                name="cuerda"
                value={formData.cuerda}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option value="Tenor">Tenor</option>
                <option value="Soprano">Soprano</option>
                <option value="Contralto">Contralto</option>
                <option value="Bajo">Bajo</option>
              </Form.Select>
            </div>
            <Button
              type="button"
              className="btn-agregar-cuerda ms-2"
              onClick={handleAgregarCuerda}
              title="Agregar cuerda"
            >
              <PlusCircleFill />
            </Button>
          </Col>
          <Col xs={6} className="mb-3">
            <Form.Label>Área:</Form.Label>
            <Form.Select
              name="area"
              value={formData.area}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="Administración">Administración</option>
              <option value="Logística">Logística</option>
              <option value="Musical">Musical</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="text-center">
            <Button type="submit" className="btn-agregar">
              {titulo.includes('Registro')
                ? 'Agregar miembro'
                : 'Modificar miembro'}
            </Button>
            <Button
              variant="secondary"
              className="btn-cancelar ms-2"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
      </Form>
      <AgregarCuerda
        show={showAgregarCuerda}
        onClose={handleCloseAgregarCuerda}
        cuerda={{ nombre: '' }}
      />
    </Container>
  );
};

export default AgregarModificarMiembro;
