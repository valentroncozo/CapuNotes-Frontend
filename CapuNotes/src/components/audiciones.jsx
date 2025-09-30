import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Candidato from './candidato';
import './audiciones.css';

const initialAudiciones = [
  {
    id: 1,
    hora: '17.00 hs',
    nombre: 'Begilardo, Francisco',
    cancion: 'Ya me enteré, Reik',
    rta: '',
    candidatoData: {
      nombre: 'Francisco Begilardo',
      tipoDni: 'DNI',
      numeroDni: '12345678',
      fechaNacimiento: '1995-05-15',
      correo: 'francisco.begilardo@email.com',
      telefono: '+54 9 351 123-4567',
      provincia: 'Córdoba',
      pais: 'Argentina',
      profesion: 'Estudiante',
      pregunta1:
        'Sí, me encanta la música coral y quiero formar parte de esta comunidad.',
      pregunta2: 'Tenor',
      pregunta3: 'Sí, voy a misa todos los domingos.',
      pregunta4: 'No, esta sería mi primera participación.',
      pregunta5: 'Toco guitarra desde los 12 años.',
      pregunta6: 'También me gusta la actuación.',
      pregunta7: 'Me enteré por un amigo del coro.',
      pregunta8: 'Busco crecer espiritualmente a través de la música.',
      pregunta9: "Voy a cantar 'Amazing Grace'.",
    },
  },
  {
    id: 2,
    hora: '17.15 hs',
    nombre: 'Alejandro, Peréz',
    cancion: 'Aleluya',
    rta: '',
    candidatoData: {
      nombre: 'Alejandro Pérez',
      tipoDni: 'DNI',
      numeroDni: '87654321',
      fechaNacimiento: '1992-08-20',
      correo: 'alejandro.perez@email.com',
      telefono: '+54 9 351 987-6543',
      provincia: 'Córdoba',
      pais: 'Argentina',
      profesion: 'Profesional',
      pregunta1: 'Quiero expresar mi fe a través del canto.',
      pregunta2: 'Bajo',
      pregunta3: 'Sí, conozco la misa de 21hs.',
      pregunta4: 'Participo en el grupo de jóvenes.',
      pregunta5: 'No toco ningún instrumento.',
      pregunta6: 'Me gusta escribir poesía.',
      pregunta7: 'Vi la convocatoria en las redes sociales.',
      pregunta8: 'Quiero conocer personas con mi misma fe.',
      pregunta9: "Cantaré 'Aleluya' de Leonard Cohen.",
    },
  },
  // ... más candidatos con sus datos completos
];

export default function Audiciones({ username }) {
  const navigate = useNavigate();
  const [audiciones, setAudiciones] = useState(initialAudiciones);
  const [showCandidato, setShowCandidato] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);

  // Función para cerrar y volver al menú de audiciones
  const handleClose = () => {
    navigate('/menu-audiciones');
  };

  const handleRtaChange = (index, value) => {
    const nuevasAudiciones = [...audiciones];
    nuevasAudiciones[index].rta = value;
    setAudiciones(nuevasAudiciones);
  };

  const handleVerCandidato = (candidato) => {
    setCandidatoSeleccionado(candidato);
    setShowCandidato(true);
  };

  const handleCloseCandidato = () => {
    setShowCandidato(false);
    setCandidatoSeleccionado(null);
  };

  const handleUpdateCandidato = (datosActualizados) => {
    // Actualizar los datos del candidato en la lista
    const nuevasAudiciones = audiciones.map((audicion) =>
      audicion.id === candidatoSeleccionado.id
        ? { ...audicion, candidatoData: datosActualizados }
        : audicion
    );
    setAudiciones(nuevasAudiciones);
    setShowCandidato(false);
    setCandidatoSeleccionado(null);
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
      {!showCandidato ? (
        <>
          {/* Ícono posicionado absolutamente */}
          <div className="header-icon"></div>

          {/* Botón cerrar */}
          <button
            className="menu-close"
            onClick={handleClose}
            aria-label="Volver al menú de audiciones"
          >
            ✕
          </button>

          {/* Título centrado independientemente */}
          <div className="audiciones-header">
            <div>
              <div className="audiciones-title">Audiciones</div>
            </div>
          </div>
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
                      <tr key={a.id}>
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
                          <Button
                            className="btn-agregar-audicion"
                            onClick={() => handleVerCandidato(a)}
                            title="Ver/Editar candidato"
                          >
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
        </>
      ) : (
        <Candidato
          candidatoData={candidatoSeleccionado.candidatoData}
          onClose={handleCloseCandidato}
          onUpdate={handleUpdateCandidato}
        />
      )}
    </Container>
  );
}
