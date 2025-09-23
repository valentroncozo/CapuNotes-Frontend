import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import './audiciones.css';

const initialAudiciones = [
  {
    hora: '17.00 hs',
    nombre: 'Begilardo, Francisco',
    cancion: 'Ya me enteré, Reik',
    rta: '',
  },
  {
    hora: '17.15 hs',
    nombre: 'Alejandro, Peréz',
    cancion: 'Aleluya',
    rta: '',
  },
  {
    hora: '17.30 hs',
    nombre: 'Contretas, Stefani',
    cancion: 'Ella y yo, Don Omar',
    rta: '',
  },
  {
    hora: '17.45 hs',
    nombre: 'Bottari, Juan Mauro',
    cancion: 'Zamba para olvidar, Abel Pintos',
    rta: '',
  },
  {
    hora: '18.00 hs',
    nombre: 'Acuña, Micaela Sol',
    cancion: 'Intento, Ulises Bueno',
    rta: '',
  },
  {
    hora: '18.15 hs',
    nombre: 'Cantartuti, Ariana Gabriela',
    cancion: 'Eterno Amor, Juan Fuentes',
    rta: '',
  },
];

export default function Audiciones({ username }) {
  const [audiciones, setAudiciones] = useState(initialAudiciones);

  const handleRtaChange = (index, value) => {
    const nuevasAudiciones = [...audiciones];
    nuevasAudiciones[index].rta = value;
    setAudiciones(nuevasAudiciones);
  };

  const renderEmoji = (value) => {
    if (value === 'ok')
      return <span style={{ color: '#4ade80', fontSize: '1.3rem' }}>✓</span>;
    if (value === 'no')
      return <span style={{ color: '#f87171', fontSize: '1.3rem' }}>❌</span>;
    return <span style={{ color: '#fff', fontSize: '1.3rem' }}>—</span>;
  };

  return (
    <Container fluid className="audiciones-container">
      <Row className="mb-3 align-items-center">
        <Col xs="auto">
          <div className="header-icon"></div>
        </Col>
        <Col>
          <div className="audiciones-title">Bienvenido, {username}!</div>
          <div className="audiciones-subtitle">Audiciones</div>
        </Col>
      </Row>
      <hr className="divisor-amarillo" />
      <Row className="mb-3">
        <Col xs={12} md={3} className="mb-2 mb-md-0">
          <Form.Select className="audiciones-select">
            <option>Value</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3} className="mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Buscar"
            className="audiciones-search"
          />
        </Col>
        <Col xs={12} md={3} className="mb-2 mb-md-0">
          <Form.Select className="audiciones-select">
            <option>MARZO 2025</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select className="audiciones-select">
            <option>Viernes 14</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="tabla-wrapper">
            <Table bordered responsive className="tabla-audiciones mb-0">
              <thead>
                <tr>
                  <th>Hs</th>
                  <th>Nombre</th>
                  <th>Canción</th>
                  <th>Rta</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {audiciones.map((a, i) => (
                  <tr key={i}>
                    <td>{a.hora}</td>
                    <td>{a.nombre}</td>
                    <td>{a.cancion}</td>
                    <td className="audiciones-rta">
                      <Form.Select
                        value={a.rta}
                        onChange={(e) => handleRtaChange(i, e.target.value)}
                        className="audiciones-select-rta"
                      >
                        <option value="">{renderEmoji('')}</option>
                        <option value="ok">{renderEmoji('ok')}</option>
                        <option value="no">{renderEmoji('no')}</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button className="btn-agregar-audicion">
                        <PlusCircleFill />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
