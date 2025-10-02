import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useNotification } from '../hooks';
import './formulario.css';

// Reglas de validación del formulario
const validationRules = {
  nombre: {
    required: true,
    label: 'Nombre y apellido',
    minLength: 2,
    minLengthMessage: 'El nombre debe tener al menos 2 caracteres',
  },
  tipoDocumento: {
    required: true,
    label: 'Tipo de documento',
  },
  numeroDocumento: {
    required: true,
    label: 'Número de documento',
    minLength: 6,
    minLengthMessage: 'El número de documento debe tener al menos 6 caracteres',
  },
  fechaNacimiento: {
    required: true,
    label: 'Fecha de nacimiento',
    validate: (value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16) {
        return 'Debes tener al menos 16 años para inscribirte';
      }
      if (age > 80) {
        return 'Por favor verifica la fecha de nacimiento';
      }
      return null;
    },
  },
  correo: {
    required: true,
    label: 'Correo electrónico',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Ingresa un correo electrónico válido',
  },
  telefono: {
    required: true,
    label: 'Teléfono',
    pattern: /^[+]?[\d\s\-()]{8,15}$/,
    patternMessage: 'Ingresa un teléfono válido (8-15 dígitos)',
  },
  provincia: {
    required: true,
    label: 'Provincia',
    minLength: 2,
  },
  pais: {
    required: true,
    label: 'País',
    minLength: 2,
  },
  profesion: {
    required: true,
    label: 'Profesión',
    minLength: 2,
  },
  conocerMas: {
    required: true,
    label: 'Qué te gustaría conocer más del coro',
    minLength: 10,
    minLengthMessage:
      'Por favor proporciona una respuesta más detallada (mínimo 10 caracteres)',
  },
  esperasDios: {
    required: true,
    label: 'Qué esperas que Dios haga en tu vida',
    minLength: 10,
    minLengthMessage:
      'Por favor proporciona una respuesta más detallada (mínimo 10 caracteres)',
  },
  participacion: {
    required: true,
    label: 'Participación en coros anteriores',
  },
  instrumentos: {
    required: true,
    label: 'Instrumentos musicales',
  },
  talento: {
    required: true,
    label: 'Talento que ofreces',
    minLength: 5,
    minLengthMessage: 'Describe brevemente tu talento (mínimo 5 caracteres)',
  },
  convocatoria: {
    required: true,
    label: 'Cómo te enteraste de la convocatoria',
  },
  encontrarMotivo: {
    required: true,
    label: 'Motivación para ser parte del coro',
    minLength: 10,
    minLengthMessage: 'Por favor explica tu motivación (mínimo 10 caracteres)',
  },
  cancion: {
    required: true,
    label: 'Canción favorita',
  },
  audicion: {
    required: true,
    label: 'Acuerdo con los términos',
  },
  dia: {
    required: true,
    label: 'Día para la audición',
  },
  horarioDisponible: {
    required: true,
    label: 'Horario disponible',
  },
};

// Valores iniciales del formulario
const initialFormValues = {
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
  dia: '',
  horarioDisponible: '',
};

const Formulario = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // Usar el hook de formulario
  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    reset,
  } = useForm(initialFormValues, validationRules);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showError('Por favor corrige los errores del formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío del formulario - aquí iría tu lógica de API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Datos del formulario:', values);

      showSuccess('¡Formulario enviado exitosamente! Te contactaremos pronto.');
      reset();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      showError('Error al enviar el formulario. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHome = () => {
    window.scrollTo(0, 0);
    navigate('/');
  };

  return (
    <div className="formulario-container">
      <div className="formulario-card">
        <button className="close-btn" onClick={handleHome}>
          ✕
        </button>

        <div className="formulario-header">
          <div className="logo-container">
            <img src="/Logo coro sin fondo.jpg" alt="Logo" className="logo" />
          </div>
          <h1 className="title-primary">Formulario de Inscripción</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Datos personales */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre y apellido</label>
              <input
                type="text"
                name="nombre"
                className={`form-input ${errors.nombre ? 'is-invalid' : ''}`}
                placeholder="Ingresa tu nombre completo"
                value={values.nombre}
                onChange={handleChange}
              />
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de documento</label>
              <select
                name="tipoDocumento"
                className={`form-input ${
                  errors.tipoDocumento ? 'is-invalid' : ''
                }`}
                value={values.tipoDocumento}
                onChange={handleChange}
              >
                <option value="">Seleccionar tipo de documento</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula">Cédula de Identidad</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.tipoDocumento && (
                <div className="invalid-feedback">{errors.tipoDocumento}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Número de documento</label>
              <input
                type="text"
                name="numeroDocumento"
                className={`form-input ${
                  errors.numeroDocumento ? 'is-invalid' : ''
                }`}
                placeholder="Número de documento"
                value={values.numeroDocumento}
                onChange={handleChange}
              />
              {errors.numeroDocumento && (
                <div className="invalid-feedback">{errors.numeroDocumento}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                className={`form-input ${
                  errors.fechaNacimiento ? 'is-invalid' : ''
                }`}
                value={values.fechaNacimiento}
                onChange={handleChange}
              />
              {errors.fechaNacimiento && (
                <div className="invalid-feedback">{errors.fechaNacimiento}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="correo"
                className={`form-input ${errors.correo ? 'is-invalid' : ''}`}
                placeholder="tu@email.com"
                value={values.correo}
                onChange={handleChange}
              />
              {errors.correo && (
                <div className="invalid-feedback">{errors.correo}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className={`form-input ${errors.telefono ? 'is-invalid' : ''}`}
                placeholder="Número de teléfono"
                value={values.telefono}
                onChange={handleChange}
              />
              {errors.telefono && (
                <div className="invalid-feedback">{errors.telefono}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Provincia</label>
              <input
                type="text"
                name="provincia"
                className={`form-input ${errors.provincia ? 'is-invalid' : ''}`}
                placeholder="Provincia donde vives"
                value={values.provincia}
                onChange={handleChange}
              />
              {errors.provincia && (
                <div className="invalid-feedback">{errors.provincia}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">País</label>
              <input
                type="text"
                name="pais"
                className={`form-input ${errors.pais ? 'is-invalid' : ''}`}
                placeholder="País donde vives"
                value={values.pais}
                onChange={handleChange}
              />
              {errors.pais && (
                <div className="invalid-feedback">{errors.pais}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Profesión</label>
              <input
                type="text"
                name="profesion"
                className={`form-input ${errors.profesion ? 'is-invalid' : ''}`}
                placeholder="¿A qué te dedicas?"
                value={values.profesion}
                onChange={handleChange}
              />
              {errors.profesion && (
                <div className="invalid-feedback">{errors.profesion}</div>
              )}
            </div>
          </div>

          {/* Sección de preguntas */}
          <div className="preguntas-section">
            <div className="form-group">
              <label className="form-label">
                ¿Qué te gustaría conocer más del coro?
              </label>
              <textarea
                name="conocerMas"
                rows="3"
                className={`form-input ${
                  errors.conocerMas ? 'is-invalid' : ''
                }`}
                placeholder="Comparte qué aspectos del coro te interesan más..."
                value={values.conocerMas}
                onChange={handleChange}
              ></textarea>
              {errors.conocerMas && (
                <div className="invalid-feedback">{errors.conocerMas}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Qué esperas que Dios haga en tu vida a través de la música?
              </label>
              <textarea
                name="esperasDios"
                rows="3"
                className={`form-input ${
                  errors.esperasDios ? 'is-invalid' : ''
                }`}
                placeholder="Comparte tus expectativas espirituales..."
                value={values.esperasDios}
                onChange={handleChange}
              ></textarea>
              {errors.esperasDios && (
                <div className="invalid-feedback">{errors.esperasDios}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Has participado en algún coro anteriormente?
              </label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="participacion-si"
                    name="participacion"
                    value="Sí"
                    checked={values.participacion === 'Sí'}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label
                    htmlFor="participacion-si"
                    className="form-check-label"
                  >
                    Sí
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="participacion-no"
                    name="participacion"
                    value="No"
                    checked={values.participacion === 'No'}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label
                    htmlFor="participacion-no"
                    className="form-check-label"
                  >
                    No
                  </label>
                </div>
              </div>
              {errors.participacion && (
                <div className="invalid-feedback">{errors.participacion}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Tocas algún instrumento musical?
              </label>
              <textarea
                name="instrumentos"
                rows="2"
                className={`form-input ${
                  errors.instrumentos ? 'is-invalid' : ''
                }`}
                placeholder="Si es así, ¿cuál o cuáles? Si no, simplemente escribe 'No'"
                value={values.instrumentos}
                onChange={handleChange}
              ></textarea>
              {errors.instrumentos && (
                <div className="invalid-feedback">{errors.instrumentos}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Qué talento crees que tienes para ofrecer?
              </label>
              <textarea
                name="talento"
                rows="3"
                className={`form-input ${errors.talento ? 'is-invalid' : ''}`}
                placeholder="Describe tus habilidades musicales o cualquier otro talento..."
                value={values.talento}
                onChange={handleChange}
              ></textarea>
              {errors.talento && (
                <div className="invalid-feedback">{errors.talento}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Cómo te enteraste de esta convocatoria?
              </label>
              <input
                type="text"
                name="convocatoria"
                className={`form-input ${
                  errors.convocatoria ? 'is-invalid' : ''
                }`}
                placeholder="Redes sociales, amigos, iglesia, etc."
                value={values.convocatoria}
                onChange={handleChange}
              />
              {errors.convocatoria && (
                <div className="invalid-feedback">{errors.convocatoria}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Qué te motiva a querer ser parte de este coro?
              </label>
              <textarea
                name="encontrarMotivo"
                rows="3"
                className={`form-input ${
                  errors.encontrarMotivo ? 'is-invalid' : ''
                }`}
                placeholder="Comparte tu motivación personal..."
                value={values.encontrarMotivo}
                onChange={handleChange}
              ></textarea>
              {errors.encontrarMotivo && (
                <div className="invalid-feedback">{errors.encontrarMotivo}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Tienes alguna canción favorita que te gustaría que el coro
                interprete?
              </label>
              <input
                type="text"
                name="cancion"
                className={`form-input ${errors.cancion ? 'is-invalid' : ''}`}
                placeholder="Nombre de la canción (opcional pero recomendado)"
                value={values.cancion}
                onChange={handleChange}
              />
              {errors.cancion && (
                <div className="invalid-feedback">{errors.cancion}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ¿Estás de acuerdo con todo lo anterior?
              </label>
              <div className="radio-group">
                <div className="form-check">
                  <input
                    type="radio"
                    id="audicion-si"
                    name="audicion"
                    value="Sí"
                    checked={values.audicion === 'Sí'}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label htmlFor="audicion-si" className="form-check-label">
                    Sí
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="audicion-no"
                    name="audicion"
                    value="No"
                    checked={values.audicion === 'No'}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label htmlFor="audicion-no" className="form-check-label">
                    No
                  </label>
                </div>
              </div>
              {errors.audicion && (
                <div className="invalid-feedback">{errors.audicion}</div>
              )}
            </div>
          </div>

          {/* Sección de horario */}
          <div className="horario-section">
            <h3 className="title-secondary mb-3">
              Elegí el horario para tu audición:
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Día:</label>
                <select
                  name="dia"
                  className={`form-input ${errors.dia ? 'is-invalid' : ''}`}
                  value={values.dia}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar día</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
                {errors.dia && (
                  <div className="invalid-feedback">{errors.dia}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Horarios disponibles:</label>
                <select
                  name="horarioDisponible"
                  className={`form-input ${
                    errors.horarioDisponible ? 'is-invalid' : ''
                  }`}
                  value={values.horarioDisponible}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar horario</option>
                  <option value="09:00 - 09:30">09:00 - 09:30</option>
                  <option value="09:30 - 10:00">09:30 - 10:00</option>
                  <option value="10:00 - 10:30">10:00 - 10:30</option>
                  <option value="10:30 - 11:00">10:30 - 11:00</option>
                  <option value="11:00 - 11:30">11:00 - 11:30</option>
                  <option value="11:30 - 12:00">11:30 - 12:00</option>
                  <option value="14:00 - 14:30">14:00 - 14:30</option>
                  <option value="14:30 - 15:00">14:30 - 15:00</option>
                  <option value="15:00 - 15:30">15:00 - 15:30</option>
                  <option value="15:30 - 16:00">15:30 - 16:00</option>
                  <option value="16:00 - 16:30">16:00 - 16:30</option>
                  <option value="16:30 - 17:00">16:30 - 17:00</option>
                  <option value="17:00 - 17:30">17:00 - 17:30</option>
                  <option value="17:30 - 18:00">17:30 - 18:00</option>
                  <option value="18:00 - 18:30">18:00 - 18:30</option>
                  <option value="18:30 - 19:00">18:30 - 19:00</option>
                </select>
                {errors.horarioDisponible && (
                  <div className="invalid-feedback">
                    {errors.horarioDisponible}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="info-section">
            <ul>
              <li>
                La audición es individual y consiste en preparar una canción que
                más te guste!
              </li>
              <li>
                Cantar la canción y después se toma el registro vocal. (No te
                preocupes que la audición es privada!)
              </li>
              <li>
                No es necesario tener conocimiento en teoría musical, solo tus
                ganas de desarrollar el don Musical y el Compromiso!
              </li>
            </ul>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Inscribirme'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
