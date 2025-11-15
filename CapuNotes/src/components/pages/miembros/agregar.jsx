import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import "@/styles/libreriaGeo.css";
import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '@/styles/miembros.css';
import '@/styles/abmc.css';
import BackButton from '@/components/common/BackButton.jsx';
import { cuerdasService } from '@/services/cuerdasService.js';
import { areasService } from '@/services/areasService.js';
import { miembrosService } from '@/services/miembrosService.js';
import { InputMask } from '@react-input/mask';

// ---- VALIDAR FECHA dd/mm/aaaa IGUAL QUE index.jsx ----
function validarEdadDDMMAAAA(fecha) {
  if (!fecha.includes('/')) return false;

  const [dia, mes, anio] = fecha.split('/');
  const nacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const cumpleEsteAño =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() >= nacimiento.getDate());

  if (!cumpleEsteAño) edad -= 1;

  return edad >= 17;
}

// 👉 Normalizador de fecha para enviar al backend como yyyy-MM-dd
const normalizarFecha = (fecha) => {
  if (!fecha || fecha.length !== 10) return null;
  const [dd, mm, yyyy] = fecha.split('/');
  return `${yyyy}-${mm}-${dd}`;
};

export default function MiembrosAgregar({ title = 'Registro de miembro' }) {
  const navigate = useNavigate();

  const empty = {
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    carreraProfesion: '',
    lugarOrigen: '',
    instrumentoMusical: '',
    cuerda: '',
    area: '',
  };

  const [miembro, setMiembro] = useState(empty);
  const [errores, setErrores] = useState({});
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [lugarOrigenInput, setLugarOrigenInput] = useState('');

  // 🔹 Cargar cuerdas y áreas
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

  // 🔹 Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  // 🔹 Validación antes de enviar
  const validarCampos = () => {
    const camposRequeridos = [
      'nombre',
      'apellido',
      'tipoDocumento',
      'numeroDocumento',
      'cuerda',
    ];
    const nuevosErrores = {};
    camposRequeridos.forEach((campo) => {
      if (!miembro[campo] || String(miembro[campo]).trim() === '') {
        nuevosErrores[campo] = 'Campo obligatorio';
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // 🔹 Enviar datos al backend
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
        fechaNacimiento: normalizarFecha(miembro.fechaNacimiento),
        nroTelefono: miembro.telefono || null,
        correo: miembro.correo || null,
        carreraProfesion: miembro.carreraProfesion || null,
        lugarOrigen: miembro.lugarOrigen || null,
        instrumentoMusical: miembro.instrumentoMusical || null,
        activo: true,
        cuerda: { id: parseInt(miembro.cuerda) },
        area: miembro.area ? { id: parseInt(miembro.area) } : null,
      };

      await miembrosService.create(payload);

      Swal.fire({
        icon: 'success',
        title: 'Miembro registrado',
        text: `Se registró ${miembro.nombre} correctamente.`,
        timer: 1600,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });

      setMiembro(empty);
      navigate('/miembros');
    } catch (error) {
      console.error('Error registrando miembro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el miembro. Verificá los datos.',
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
            Los campos marcados con <span className="required">*</span> son
            obligatorios.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          {/* Nombre */}
          <Form.Group className="form-group-miembro">
            <label>
              Nombre <span className="required">*</span>
            </label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ej: Juan"
              value={miembro.nombre}
              onChange={handleChange}
              className={`abmc-input ${errores.nombre ? 'error' : ''}`}
            />
          </Form.Group>

          {/* Apellido */}
          <Form.Group className="form-group-miembro">
            <label>
              Apellido <span className="required">*</span>
            </label>
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Ej: Pérez"
              value={miembro.apellido}
              onChange={handleChange}
              className={`abmc-input ${errores.apellido ? 'error' : ''}`}
            />
          </Form.Group>

          {/* Tipo y número documento */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>
                Tipo de Documento <span className="required">*</span>
              </label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className={`abmc-select visible-dropdown ${
                  errores.tipoDocumento ? 'error' : ''
                }`}
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
                placeholder="Ej: 40123456"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${
                  errores.numeroDocumento ? 'error' : ''
                }`}
              />
            </div>
          </div>

          {/* Fecha de nacimiento y lugar de origen */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Fecha de Nacimiento</label>
              <div className="abmc-input-wrapper">
                <InputMask
                  mask="DD/DD/DDDD"
                  replacement={{
                    D: /\d/,
                  }}
                  value={miembro.fechaNacimiento}
                  placeholder="dd/mm/aaaa"
                  className="abmc-input"
                  onChange={(e) => {
                    const fecha = e.target.value;

                    setMiembro((prev) => ({
                      ...prev,
                      fechaNacimiento: fecha,
                    }));

                    if (fecha.length === 10) {
                      if (!validarEdadDDMMAAAA(fecha)) {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Edad no válida',
                          text: 'El miembro debe tener al menos 17 años.',
                          confirmButtonText: 'Aceptar',
                          customClass: {
                            confirmButton: 'abmc-btn btn-primary',
                          },
                          buttonsStyling: false,
                          background: '#11103a',
                          color: '#E8EAED',
                        });

                        setMiembro((prev) => ({
                          ...prev,
                          fechaNacimiento: '',
                        }));
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="mitad">
              <label>Lugar de Origen</label>

              <GeoapifyContext apiKey="27d4d3c8bf5147f3ae4cd2f98a44009a">
                <GeoapifyGeocoderAutocomplete
                  placeholder="Ej: Córdoba, Argentina"
                  value={miembro.lugarOrigen}
                  type="city"
                  lang="es"
                  limit={8}
                  onChange={(value) => {
                    if (value) {
                      setMiembro((prev) => ({
                        ...prev,
                        lugarOrigen: value.formatted,
                      }));
                    }
                  }}
                  onSuggestionChange={(value) => {
                    if (!value) return;
                    setLugarOrigenInput(value.formatted);
                  }}
                  className="geoapify-wrapper"
                />
              </GeoapifyContext>
            </div>
          </div>

          {/* Teléfono y correo */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                placeholder="Ej: 3512345678"
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
                placeholder="Ej: nombre@mail.com"
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* Profesión e instrumento */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Carrera / Profesión</label>
              <Form.Control
                type="text"
                name="carreraProfesion"
                placeholder="Ej: Estudiante de música"
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
                placeholder="Ej: Guitarra"
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
                  title="Gestionar cuerdas"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="mitad">
              <label>Área</label>
              <div className="input-with-button">
                <Form.Select
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
                </Form.Select>

                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => navigate('/areas')}
                  title="Gestionar áreas"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="acciones-form-miembro derecha">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={() => navigate('/miembros')}
            >
              Cancelar
            </button>
            <button type="submit" className="abmc-btn abmc-btn-primary">
              Agregar miembro
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
