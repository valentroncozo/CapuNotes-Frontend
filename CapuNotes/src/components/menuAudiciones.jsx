import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './menuAudiciones.css';

const MenuAudiciones = ({ onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    navigate('/menu');
  };

  const handlePlanificarAudiciones = () => {
    // Lógica para planificar audiciones
    console.log('Planificar audiciones');
  };

  const handleVerAudiciones = () => {
    navigate('/audiciones');
  };

  const handleCandidatos = () => {
    // Lógica para candidatos
    console.log('Candidatos');
  };

  const handleHistorial = () => {
    // Lógica para historial
    console.log('Historial de audiciones');
  };

  return (
    <Container fluid className="menu-audiciones-container">
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
          <h2 className="audiciones-title">Audiciones</h2>
        </Col>
      </Row>

      {/* Botones del menú */}
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="menu-buttons-container">
            <Button
              className="menu-audiciones-btn"
              onClick={handlePlanificarAudiciones}
            >
              Planificar audiciones
            </Button>

            <Button
              className="menu-audiciones-btn"
              onClick={handleVerAudiciones}
            >
              Ver audiciones
            </Button>

            <Button className="menu-audiciones-btn" onClick={handleCandidatos}>
              Candidatos
            </Button>

            <Button className="menu-audiciones-btn" onClick={handleHistorial}>
              Historial de audiciones
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MenuAudiciones;
