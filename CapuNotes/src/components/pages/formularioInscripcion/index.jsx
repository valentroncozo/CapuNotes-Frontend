import React, { useState } from 'react';
import '@/styles/formulario-inscripcion.css';
import BackButton from '../../common/BackButton.jsx';

const FormularioBasico = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="formulario-container">
      <header className="abmc-header">
        <BackButton />
        <h1>Formulario de Audición</h1>
      </header>
      <hr className="divisor-amarillo"></hr>

      <form onSubmit={handleSubmit} className="form-group">
        <section className="form-grid">
          <section className="bloque">
            <div className="datos-personales">
              <h2>Datos personales</h2>
            </div>

            <div className="field">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Tipo Documento</label>
              <select name="tipoDocumento" required>
                <option value="">Seleccione</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula">Cédula</option>
              </select>
            </div>

            <div className="field">
              <label>Número Documento</label>
              <input type="number" name="numeroDocumento" required />
            </div>

            <div className="field">
              <label>Fecha de Nacimiento</label>
              <input
                type="text"
                name="fechaNacimiento"
                placeholder="DD/MM/AAAA"
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input type="tel" name="telefono" required />
            </div>

            <div className="field">
              <label>Lugar de origen</label>
              <input type="text" name="lugarOrigen" required />
            </div>

            <div className="field">
              <label>Profesión/Carrera</label>
              <input type="text" name="profesion" required />
            </div>

            <div className="field">
              <label>Cuerda</label>
              <select name="cuerda" required>
                <option value="">Seleccione</option>
                <option value="primera">Primera</option>
                <option value="segunda">Segunda</option>
                <option value="tercera">Tercera</option>
              </select>
            </div>

            <div className="field">
              <label>Subí una foto tuya para que podamos reconocerte</label>
              <input type="file" name="foto" accept="image/*" required />
            </div>
          </section>

          <section className="bloque">
            <div className="datos-personales">
              <h2>Queremos saber más de vos</h2>
            </div>

            <div className="field">
              <label>¡Contanos de vos!</label>
              <textarea name="sobreMi" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>
                Hoy estás acá, y es por algo especial que Dios quiere para
                vos... ¿En qué te gustaría crecer?
              </label>
              <textarea name="crecerFe" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>¿Cantás o cantaste alguna vez? ¿Dónde?</label>
              <textarea name="experienciaCanto" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>
                ¿Vas a misa? ¿Conoces la misa de 21hs de Capuchinos?
              </label>
              <textarea name="misaCapuchinos" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>¿Participaste en algún otro grupo de la comunidad?</label>
              <textarea name="otrosGrupos" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>¿Sabés tocar algún instrumento musical?</label>
              <textarea name="instrumentoMusical" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>¿Tenés algún otro talento artístico?</label>
              <textarea name="otroTalento" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>¿Cómo te enteraste de la convocatoria?</label>
              <textarea
                name="enterasteConvocatoria"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="field">
              <label>¿Qué te motiva a ingresar al coro?</label>
              <textarea name="motivacionCoro" rows="3" required></textarea>
            </div>

            <div className="field">
              <label>¿Qué canción vas a cantar?</label>
              <textarea name="cancionElegida" rows="2" required></textarea>
            </div>

            <div className="field">
              <label>Elegí el horario para tu audición</label>
              <div className="row">
                <select name="dia" required>
                  <option value="">Día</option>
                </select>
                <select name="horario" required>
                  <option value="">Horario</option>
                </select>
              </div>
            </div>

            <ul className="info-list">
              <li>
                La audición es individual y consiste en preparar una canción.
              </li>
              <li>Luego se toma el registro vocal (la audición es privada).</li>
              <li>
                No necesitás saber teoría musical, solo tener ganas y
                compromiso.
              </li>
            </ul>

            <div className="field">
              <label>
                <input type="checkbox" name="aceptoCondiciones" required />{' '}
                Acepto los términos de la audición
              </label>
            </div>
          </section>
        </section>

        <button type="submit" className="btn-submit">
          Inscribirme
        </button>
      </form>
    </div>
  );
};

export default FormularioBasico;
