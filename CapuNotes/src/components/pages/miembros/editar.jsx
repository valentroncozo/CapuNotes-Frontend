import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import '@/styles/miembros.css';
import '@/styles/abmc.css';
import BackButton from '@/components/common/BackButton.jsx';
import { cuerdasService } from '@/services/cuerdasService.js';
import { areasService } from '@/services/areasService.js';
import { miembrosService } from '@/services/miembrosService.js';

export default function MiembrosEditar({ title = 'Editar miembro' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const miembroInicial = location.state?.miembro;

  // Guardamos el documento viejo (ID original)
  const docViejo = {
    nro: miembroInicial?.id?.nroDocumento,
    tipo: miembroInicial?.id?.tipoDocumento
  };

  // Estado inicial del formulario
  const [miembro, setMiembro] = useState(() => ({
    nombre: miembroInicial?.nombre || '',
    apellido: miembroInicial?.apellido || '',
    tipoDocumento:
      miembroInicial?.id?.tipoDocumento || miembroInicial?.tipoDocumento || '',
    numeroDocumento:
      miembroInicial?.id?.nroDocumento || miembroInicial?.numeroDocumento || '',
    fechaNacimiento: miembroInicial?.fechaNacimiento || '',
    telefono: miembroInicial?.nroTelefono || miembroInicial?.telefono || '',
    correo: miembroInicial?.correo || '',
    carreraProfesion: miembroInicial?.carreraProfesion || '',
    lugarOrigen: miembroInicial?.lugarOrigen || '',
    instrumentoMusical: miembroInicial?.instrumentoMusical || '',
    cuerda: miembroInicial?.cuerda?.id || '',
    area: miembroInicial?.area?.id || '',
  }));

  const [errores, setErrores] = useState({});
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  // Cargar cuerdas y áreas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cuerdas, areas] = await Promise.all([
          cuerdasService.list(),
          areasService.list(),
        ]);
        setCuerdasDisponibles(cuerdas);
        setAreasDisponibles(areas);
      } catch (error) {
        console.error('Error cargando cuerdas o áreas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: 'No se pudieron cargar las cuerdas o áreas.',
          background: '#11103a',
          color: '#E8EAED',
        });
      }
    };
    fetchData();
  }, []);

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  // Validación
  const validarCampos = () => {
    const requeridos = [
      'nombre',
      'apellido',
      'tipoDocumento',
      'numeroDocumento',
      'cuerda',
    ];
    const nuevosErrores = {};
    requeridos.forEach((campo) => {
      if (!miembro[campo] || String(miembro[campo]).trim() === '') {
        nuevosErrores[campo] = 'Campo obligatorio';
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completá todos los campos obligatorios marcados en amarillo.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonColor: '#7c83ff',
      });
      return;
    }

    try {
      const payload = {
        id: {
          nroDocumento: miembro.numeroDocumento,
          tipoDocumento: miembro.tipoDocumento,
        },
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        fechaNacimiento: miembro.fechaNacimiento || null,
        nroTelefono: miembro.telefono || null,
        correo: miembro.correo || null,
        carreraProfesion: miembro.carreraProfesion || null,
        lugarOrigen: miembro.lugarOrigen || null,
        instrumentoMusical: miembro.instrumentoMusical || null,
        activo: miembroInicial?.activo ?? true,
        cuerda: { id: parseInt(miembro.cuerda) },
        area: miembro.area ? { id: parseInt(miembro.area) } : null,
      };

      await miembrosService.update(docViejo.nro, docViejo.tipo, payload);

      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados',
        text: `Se actualizaron los datos de ${miembro.nombre}.`,
        timer: 1600,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });

      navigate('/miembros');
    } catch (error) {
      console.error('Error actualizando miembro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el miembro.',
        background: '#11103a',
        color: '#E8EAED',
      });
    }
  };

  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
          <p className="aviso-obligatorios">
            Los campos marcados con <span className="required">*</span> son obligatorios.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          {/* Nombre y Apellido */}
          <Form.Group className="form-group-miembro">
            <label>
              Nombre <span className="required">*</span>
            </label>
            <Form.Control
              type="text"
              name="nombre"
              value={miembro.nombre}
              onChange={handleChange}
              className={`abmc-input ${errores.nombre ? 'error' : ''}`}
            />
          </Form.Group>

          <Form.Group className="form-group-miembro">
            <label>
              Apellido <span className="required">*</span>
            </label>
            <Form.Control
              type="text"
              name="apellido"
              value={miembro.apellido}
              onChange={handleChange}
              className={`abmc-input ${errores.apellido ? 'error' : ''}`}
            />
          </Form.Group>

          {/* Tipo y número de documento */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>
                Tipo de Documento <span className="required">*</span>
              </label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className={`abmc-select visible-dropdown ${errores.tipoDocumento ? 'error' : ''}`}
              >
                <option value="">Seleccionar tipo</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </div>

            <div className="mitad">
              <label>
                Número de Documento <span className="required">*</span>
              </label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${errores.numeroDocumento ? 'error' : ''}`}
              />
            </div>
          </div>

          {/* Fecha nacimiento y lugar origen */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Fecha de Nacimiento</label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={miembro.fechaNacimiento}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
            <div className="mitad">
              <label>Lugar de Origen</label>
              <Form.Control
                type="text"
                name="lugarOrigen"
                value={miembro.lugarOrigen}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* Teléfono y Correo */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                value={miembro.telefono}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
            <div className="mitad">
              <label>Correo</label>
              <Form.Control
                type="email"
                name="correo"
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* Profesión e Instrumento */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Carrera / Profesión</label>
              <Form.Control
                type="text"
                name="carreraProfesion"
                value={miembro.carreraProfesion}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
            <div className="mitad">
              <label>Instrumento Musical</label>
              <Form.Control
                type="text"
                name="instrumentoMusical"
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* Cuerda y Área */}
          <div className="form-row-cuerda-area">
            <div className="mitad">
              <label>
                Cuerda <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <select
                  name="cuerda"
                  value={miembro.cuerda}
                  onChange={handleChange}
                  className={`abmc-select ${errores.cuerda ? 'error' : ''}`}
                >
                  <option value="">Seleccionar cuerda</option>
                  {cuerdasDisponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre || c.name || c.descripcion || '—'}
                    </option>
                  ))}
                </select>
                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => navigate('/cuerdas')}
                  type="button"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="mitad">
              <label>Área</label>
              <div className="input-with-button">
                <select
                  name="area"
                  value={miembro.area}
                  onChange={handleChange}
                  className="abmc-select"
                >
                  <option value="">Seleccionar área</option>
                  {areasDisponibles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => navigate('/areas')}
                  type="button"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="acciones-form-miembro derecha">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={() => navigate('/miembros')}
            >
              Cancelar
            </button>
            <button type="submit" className="abmc-btn abmc-btn-primary">
              Guardar cambios
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
