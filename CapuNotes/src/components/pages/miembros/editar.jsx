import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from "@/components/common/BackButton.jsx";
import Swal from 'sweetalert2';

import '@/styles/miembros.css';
import '@/styles/abmc.css';

const STORAGE_KEY = 'capunotes_miembros';
const AREAS_KEY = 'capunotes_areas';
const CUERDAS_KEY = 'capunotes_cuerdas';

export default function MiembrosEditar({ title = "Editar miembro" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const miembro = location.state?.miembro;

  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    provincia: '',
    cuerda: '',
    area: '',
    estado: 'Activo',
  });

  useEffect(() => {
    const cuerdasGuardadas = JSON.parse(localStorage.getItem(CUERDAS_KEY)) || [];
    setCuerdasDisponibles(cuerdasGuardadas);
    const areasGuardadas = JSON.parse(localStorage.getItem(AREAS_KEY)) || [];
    setAreasDisponibles(areasGuardadas);
  }, []);

  useEffect(() => {
    if (miembro) {
      setFormData({
        id: miembro.id ?? null,
        nombre: miembro.nombre || '',
        apellido: miembro.apellido || '',
        tipoDocumento: miembro.tipoDocumento || '',
        numeroDocumento: miembro.numeroDocumento || '',
        fechaNacimiento: miembro.fechaNacimiento || '',
        correo: miembro.correo || '',
        telefono: miembro.telefono || '',
        provincia: miembro.provincia || '',
        cuerda: miembro.cuerda || '',
        area: miembro.area || '',
        estado: miembro.estado || 'Activo',
      });
    }
  }, [miembro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const miembros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const actualizados = miembros.map((m) =>
      (m.id ?? m.nombre) === (formData.id ?? miembro?.id ?? miembro?.nombre)
        ? { ...m, ...formData }
        : m
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));

    await Swal.fire({
      icon: 'success',
      title: 'Miembro actualizado',
      timer: 1200,
      showConfirmButton: false,
      background: '#11103a',
      color: '#E8EAED',
    });

    navigate('/miembros');
  };

  if (!miembro) {
    return (
      <main className="pantalla-miembros">
        <Container className="pt-5">
          <p>No se encontró el miembro a editar.</p>
          <Button variant="secondary" onClick={() => navigate('/miembros')}>Volver</Button>
        </Container>
      </main>
    );
  }

  return (
    <main className="pantalla-miembros">
        <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">{title}</h1>
          </div>

          <Form onSubmit={handleSubmit} className="abmc-topbar">
            <Form.Group className='form-group-miembro'>
              <label>Nombre</label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Apellido</label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Tipo de Documento</label>
              <Form.Select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="abmc-select"
              >
                <option value="">...</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Número de Documento</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Fecha de Nacimiento</label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Correo Electrónico</label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Provincia</label>
              <Form.Control
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-agregar">
                <label>Cuerda</label>
                <select
                  className="abmc-select"
                  name="cuerda"
                  value={miembro.cuerda}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar cuerda</option>
                  {cuerdasDisponibles.map((c) => (
                    <option key={c.id ?? c.nombre} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>

                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => navigate('/cuerdas')}
                  title="Gestionar cuerdas"
                  type="button"
                >
                  +
                </Button>
              </Form.Group>

              <Form.Group className="form-group-agregar">
                <label>Área</label>
                <select
                  name="area"
                  className="abmc-select"
                  value={miembro.area}
                  onChange={handleChange}
                  >
                  <option value="">Seleccionar área</option>
                  {areasDisponibles.map((a) => (
                    <option key={a.id ?? a.nombre} value={a.nombre}>{a.nombre}</option>
                  ))}
                </select>

                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => navigate('/areas')}
                  title="Gestionar áreas"
                  type="button"
                >
                  +
                </Button>
            </Form.Group>

            <Form.Group className="form-group-agregar-acciones">
              <button type="button" className="abmc-btn abmc-btn-secondary btn btn-secondary" onClick={() => navigate('/miembros')}>
                Cancelar
              </button>
              <button type="submit" className="abmc-btn abmc-btn-primary btn btn-primary">
                Modificar
              </button>
            </Form.Group>
          </Form>

        </div>
    </main>
  );
}