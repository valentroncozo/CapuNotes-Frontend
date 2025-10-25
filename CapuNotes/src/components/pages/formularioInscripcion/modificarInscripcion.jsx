import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IMaskInput } from 'react-imask';
import '@/styles/formulario-inscripcion.css';
import BackButton from '../../common/BackButton.jsx';

const ModificarInscripcion = ({ candidatoSeleccionado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    lugarOrigen: '',
    profesion: '',
    cuerda: '',
    foto: null,
    sobreMi: '',
    crecerFe: '',
    experienciaCanto: '',
    misaCapuchinos: '',
    otrosGrupos: '',
    instrumentoMusical: '',
    otroTalento: '',
    enterasteConvocatoria: '',
    motivacionCoro: '',
    cancionElegida: '',
    dia: '',
    horario: '',
    aceptoCondiciones: false,
  });

  const [preview, setPreview] = useState(null);

  // Si se pasa un candidato, se precargan sus datos
  useEffect(() => {
    if (candidatoSeleccionado) {
      setFormData((prev) => ({
        ...prev,
        ...candidatoSeleccionado,
      }));
      if (candidatoSeleccionado.foto) {
        setPreview(candidatoSeleccionado.foto);
      }
    }
  }, [candidatoSeleccionado]);

  // Maneja cualquier cambio en inputs normales
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Maneja archivos arrastrados o seleccionados
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (formData.foto) {
        alert('Solo podés subir una imagen. Eliminá la actual para cambiarla.');
        return;
      }
      setFormData((prev) => ({ ...prev, foto: file }));
      setPreview(URL.createObjectURL(file));
    },
    [formData.foto]
  );

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, foto: null }));
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // Limpieza de la URL de la imagen al desmontar
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos modificados:', formData);
    alert('Cambios guardados (simulación)');
  };

  return (
    <div className="formulario-container">
      <header className="abmc-header">
        <BackButton />
        <div className="abmc-title">
          <h1>Modificar inscripción</h1>
        </div>
      </header>

      <hr className="divisor-amarillo" />

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
              />
            </div>

            <div className="field">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </div>

            <div className="documento-row">
              <div className="field">
                <label>Tipo Documento</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Cédula">Cédula</option>
                </select>
              </div>

              <div className="field">
                <label>Número Documento</label>
                <input
                  type="number"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Fecha de Nacimiento</label>
              <IMaskInput
                mask="00/00/0000"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onAccept={(value) =>
                  setFormData({ ...formData, fechaNacimiento: value })
                }
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="field">
              <label>Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Lugar de origen</label>
              <input
                type="text"
                name="lugarOrigen"
                value={formData.lugarOrigen}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Profesión/Carrera</label>
              <input
                type="text"
                name="profesion"
                value={formData.profesion}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Cuerda</label>
              <select
                name="cuerda"
                value={formData.cuerda}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option value="Soprano">Soprano</option>
                <option value="Contralto">Contralto</option>
                <option value="Tenor">Tenor</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>

            <div className="field">
              <label>Foto</label>
              {!preview ? (
                <div
                  {...getRootProps()}
                  className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                  <input {...getInputProps()} name="foto" />
                  <p>Arrastrá una imagen o hacé clic para seleccionar</p>
                </div>
              ) : (
                <div className="preview-container">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="btn-submit"
                    onClick={handleRemoveImage}
                  >
                    Quitar imagen
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="bloque">
            <div className="datos-personales">
              <h2>Queremos saber más de vos</h2>
            </div>

            <div className="field">
              <label>¡Contanos de vos!</label>
              <textarea
                name="sobreMi"
                rows="3"
                value={formData.sobreMi}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿En qué te gustaría crecer?</label>
              <textarea
                name="crecerFe"
                rows="3"
                value={formData.crecerFe}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Cantás o cantaste alguna vez? ¿Dónde?</label>
              <textarea
                name="experienciaCanto"
                rows="3"
                value={formData.experienciaCanto}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>
                ¿Vas a misa? ¿Conoces la misa de 21hs de Capuchinos?
              </label>
              <textarea
                name="misaCapuchinos"
                rows="3"
                value={formData.misaCapuchinos}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Participaste en algún otro grupo de la comunidad?</label>
              <textarea
                name="otrosGrupos"
                rows="3"
                value={formData.otrosGrupos}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Sabés tocar algún instrumento musical?</label>
              <textarea
                name="instrumentoMusical"
                rows="3"
                value={formData.instrumentoMusical}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Tenés algún otro talento artístico?</label>
              <textarea
                name="otroTalento"
                rows="3"
                value={formData.otroTalento}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Cómo te enteraste de la convocatoria?</label>
              <textarea
                name="enterasteConvocatoria"
                rows="3"
                value={formData.enterasteConvocatoria}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Qué te motiva a ingresar al coro?</label>
              <textarea
                name="motivacionCoro"
                rows="3"
                value={formData.motivacionCoro}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>¿Qué canción vas a cantar?</label>
              <textarea
                name="cancionElegida"
                rows="2"
                value={formData.cancionElegida}
                onChange={handleChange}
              />
            </div>

            <div className="horario-row">
              <div className="field">
                <label>Día</label>
                <input
                  type="text"
                  name="dia"
                  value={formData.dia}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Horario</label>
                <input
                  type="text"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                />
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
                <input
                  type="checkbox"
                  name="aceptoCondiciones"
                  checked={formData.aceptoCondiciones}
                  onChange={handleChange}
                />{' '}
                Acepto los términos de la audición
              </label>
            </div>
          </section>
        </section>

        <button type="submit" className="btn-submit">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default ModificarInscripcion;
