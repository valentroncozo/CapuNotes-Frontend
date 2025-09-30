import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './formulario.css';

const Formulario = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    provincia: '',
    pais: '',
    profesion: '',
    conocerMas: '',
    esperasDios: '',
    participacion: '',
    instrumentos: '',
    talento: '',
    convocatoria: '',
    encontrarMotivo: '',
    cancion: '',
    audicion: '',
    horario: 'Mañana',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.tipoDocumento)
      newErrors.tipoDocumento = 'Selecciona el tipo de documento';
    if (!formData.numeroDocumento.trim())
      newErrors.numeroDocumento = 'El número de documento es requerido';
    if (!formData.fechaNacimiento)
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es requerido';
    if (!formData.telefono.trim())
      newErrors.telefono = 'El teléfono es requerido';
    if (!formData.provincia) newErrors.provincia = 'Selecciona la provincia';
    if (!formData.pais) newErrors.pais = 'Selecciona el país';
    if (!formData.profesion) newErrors.profesion = 'Selecciona la profesión';

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = 'El correo no tiene un formato válido';
    }

    // Validación de edad mínima (18 años)
    if (formData.fechaNacimiento) {
      const today = new Date();
      const birthDate = new Date(formData.fechaNacimiento);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.fechaNacimiento = 'Debes ser mayor de 18 años';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío de datos
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Datos del formulario:', formData);
      alert('¡Formulario enviado exitosamente! Te contactaremos pronto.');

      // Resetear el formulario
      setFormData({
        nombre: '',
        tipoDocumento: '',
        numeroDocumento: '',
        fechaNacimiento: '',
        correo: '',
        telefono: '',
        provincia: '',
        pais: '',
        profesion: '',
        conocerMas: '',
        esperasDios: '',
        participacion: '',
        instrumentos: '',
        talento: '',
        convocatoria: '',
        encontrarMotivo: '',
        cancion: '',
        audicion: '',
        horario: 'Mañana',
      });
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert(
        'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="formulario-card">
              {/* Botón de cerrar */}
              <button className="close-btn-formulario" onClick={handleHome}>
                ✕
              </button>

              {/* Header */}
              <div className="formulario-header text-center mb-4">
                <div className="logo-container mb-3">
                  <i className="fas fa-snowflake logo-icon"></i>
                </div>
                <h2 className="formulario-title">Formulario de Inscripción</h2>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Datos Personales */}
                <div className="row">
                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label className="form-label">Nombre y apellido:</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.nombre ? 'is-invalid' : ''
                        }`}
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Tipo DNI:</label>
                      <select
                        className={`form-select ${
                          errors.tipoDocumento ? 'is-invalid' : ''
                        }`}
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Cedula">Cédula</option>
                      </select>
                      {errors.tipoDocumento && (
                        <div className="invalid-feedback">
                          {errors.tipoDocumento}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Nro dni:</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.numeroDocumento ? 'is-invalid' : ''
                        }`}
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                        required
                      />
                      {errors.numeroDocumento && (
                        <div className="invalid-feedback">
                          {errors.numeroDocumento}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Fecha de nacimiento:</label>
                      <input
                        type="date"
                        className={`form-control ${
                          errors.fechaNacimiento ? 'is-invalid' : ''
                        }`}
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        required
                      />
                      {errors.fechaNacimiento && (
                        <div className="invalid-feedback">
                          {errors.fechaNacimiento}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Correo:</label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.correo ? 'is-invalid' : ''
                        }`}
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                      />
                      {errors.correo && (
                        <div className="invalid-feedback">{errors.correo}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Teléfono:</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Provincia:</label>
                      <select
                        className="form-select"
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Buenos Aires">Buenos Aires</option>
                        <option value="CABA">CABA</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Santa Fe">Santa Fe</option>
                        {/* Agregar más provincias según necesites */}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">País:</label>
                      <select
                        className="form-select"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Brasil">Brasil</option>
                        {/* Agregar más países según necesites */}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Profesión:</label>
                      <select
                        className="form-select"
                        name="profesion"
                        value={formData.profesion}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Estudiante">Estudiante</option>
                        <option value="Profesional">Profesional</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preguntas específicas */}
                <div className="preguntas-section mt-4">
                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Queremos conocer más de vos!
                    </label>
                    <textarea
                      className="form-control"
                      name="conocerMas"
                      value={formData.conocerMas}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Hoy estás acá, y es por algo especial que Dios quiere para vos... Nos querés contar en FE lo que te gustaría crecer?"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Cantás o Orministá alguna vez? ¿Dónde?
                    </label>
                    <textarea
                      className="form-control"
                      name="esperasDios"
                      value={formData.esperasDios}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Vas a Misa? ¿Conocés la liturgia de la Misa? de quienes
                      crees o estas?
                    </label>
                    <textarea
                      className="form-control"
                      name="participacion"
                      value={formData.participacion}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Te gusta o participás en algún otro grupo de
                      Evangelización?
                    </label>
                    <textarea
                      className="form-control"
                      name="instrumentos"
                      value={formData.instrumentos}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Sabés tocar algún instrumento musical? ¿Cuál?
                    </label>
                    <textarea
                      className="form-control"
                      name="talento"
                      value={formData.talento}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Tenés algún otro talento artístico?
                    </label>
                    <textarea
                      className="form-control"
                      name="convocatoria"
                      value={formData.convocatoria}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Cómo te enteraste de la convocatoria del coro?
                    </label>
                    <textarea
                      className="form-control"
                      name="encontrarMotivo"
                      value={formData.encontrarMotivo}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Qué buscás encontrar o qué te motiva a ingresar al Coro?
                    </label>
                    <textarea
                      className="form-control"
                      name="cancion"
                      value={formData.cancion}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      ¿Qué canción vas a cantar?
                    </label>
                    <textarea
                      className="form-control"
                      name="audicion"
                      value={formData.audicion}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  {/* Selección de horario para audición */}
                  <div className="form-group mb-4">
                    <label className="form-label">
                      Elegí el horario para tu audición:
                    </label>
                    <div className="horario-selection mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="horario"
                              id="manana"
                              value="Mañana"
                              checked={formData.horario === 'Mañana'}
                              onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="manana"
                            >
                              Mañana
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="horario"
                              id="tarde"
                              value="Tarde"
                              checked={formData.horario === 'Tarde'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="tarde">
                              Tarde
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-text mb-4">
                    <p className="text-muted">
                      Las audiciones son individuales y constará en presencia de
                      organizadores, no serás grabada ni filmada. Cada solo
                      presentará, tocará para la Inspiración Musical. Ten
                      respuestas claras de la Inspiración Musical (de donde nace
                      o viene) y el Compromiso!
                    </p>
                  </div>
                </div>

                {/* Botón de envío */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-inscribirse"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Enviando...
                      </>
                    ) : (
                      'Inscribirme'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
