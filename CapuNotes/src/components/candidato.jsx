import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './candidato.css';

const Candidato = ({ candidatoData, onClose, onUpdate }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    tipoDni: '',
    numeroDni: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    provincia: '',
    pais: '',
    profesion: '',
    pregunta1: '',
    pregunta2: '',
    pregunta3: '',
    pregunta4: '',
    pregunta5: '',
    pregunta6: '',
    pregunta7: '',
    pregunta8: '',
    pregunta9: '',
  });

  useEffect(() => {
    if (candidatoData) {
      setFormData(candidatoData);
    }
  }, [candidatoData]);

  const handleClose = () => {
    if (onClose) {
      // Si viene desde audiciones.jsx, usa la función onClose
      onClose();
    } else {
      // Si se accede directamente, navega a audiciones
      navigate('/audiciones');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(formData);
    } else {
      console.log('Datos del candidato actualizados:', formData);
    }
  };

  return (
    <Container fluid className="candidato-container">
      {/* Ícono posicionado absolutamente */}
      <div className="header-icon"></div>

      {/* Botón cerrar para volver a audiciones */}
      <button
        className="menu-close"
        onClick={handleClose}
        aria-label="Volver a audiciones"
      >
        ✕
      </button>

      {/* Título centrado independientemente */}
      <div className="candidato-header">
        <h2 className="candidato-title">Candidato</h2>
      </div>
      <hr className="divisor-amarillo" />

      <Row>
        {/* Una sola columna con scroll para todo el contenido */}
        <Col xs={12}>
          <div className="candidato-full-section">
            <Form onSubmit={handleSubmit}>
              {/* Datos personales */}
              <div className="seccion-datos">
                <h5 className="seccion-title">Datos Personales</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre y apellido:</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className="candidato-input"
                  />
                </Form.Group>

                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo DNI:</Form.Label>
                      <Form.Select
                        value={formData.tipoDni}
                        onChange={(e) =>
                          handleChange('tipoDni', e.target.value)
                        }
                        className="candidato-select"
                      >
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="CI">Cédula</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nro dni:</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.numeroDni}
                        onChange={(e) =>
                          handleChange('numeroDni', e.target.value)
                        }
                        className="candidato-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de nacimiento:</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) =>
                      handleChange('fechaNacimiento', e.target.value)
                    }
                    className="candidato-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo:</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                    className="candidato-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono:</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    className="candidato-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Provincia:</Form.Label>
                  <Form.Select
                    value={formData.provincia}
                    onChange={(e) => handleChange('provincia', e.target.value)}
                    className="candidato-select"
                  >
                    <option value="Córdoba">Córdoba</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Santa Fe">Santa Fe</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>País:</Form.Label>
                  <Form.Select
                    value={formData.pais}
                    onChange={(e) => handleChange('pais', e.target.value)}
                    className="candidato-select"
                  >
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Uruguay">Uruguay</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Profesión:</Form.Label>
                  <Form.Select
                    value={formData.profesion}
                    onChange={(e) => handleChange('profesion', e.target.value)}
                    className="candidato-select"
                  >
                    <option value="Estudiante">Estudiante</option>
                    <option value="Profesional">Profesional</option>
                    <option value="Jubilado">Jubilado</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Preguntas */}
              <div className="seccion-preguntas">
                <h5 className="seccion-title">Queremos conocer más de vos!</h5>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    Hoy estás acá, y es por algo especial que Dios quiere para
                    vos... Vas quieres crecer en la fe, que te gustaría crecer?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.pregunta1}
                    onChange={(e) => handleChange('pregunta1', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Cantas o Cantaste alguna vez? ¿Dónde?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta2}
                    onChange={(e) => handleChange('pregunta2', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Vas a Misa? ¿Conoces la misa de 21hs de Capuchinos?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta3}
                    onChange={(e) => handleChange('pregunta3', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Participas o participaste en algún otro grupo de nuestra
                    comunidad?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta4}
                    onChange={(e) => handleChange('pregunta4', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Sabes tocar algún instrumento musical? ¿Cuál?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta5}
                    onChange={(e) => handleChange('pregunta5', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Tienes algún otro talento artístico?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta6}
                    onChange={(e) => handleChange('pregunta6', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Cómo te enteraste de la convocatoria al coro?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta7}
                    onChange={(e) => handleChange('pregunta7', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">
                    ¿Qué buscas encontrar o que te motiva a ingresar al Coro?
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta8}
                    onChange={(e) => handleChange('pregunta8', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>

                <div className="pregunta-item">
                  <p className="pregunta-text">¿Qué canción vas a cantar?</p>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.pregunta9}
                    onChange={(e) => handleChange('pregunta9', e.target.value)}
                    className="pregunta-textarea"
                  />
                </div>
              </div>

              <Button type="submit" className="btn-guardar-candidato">
                {onUpdate ? 'Guardar cambios' : 'Guardar candidato'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Candidato;
