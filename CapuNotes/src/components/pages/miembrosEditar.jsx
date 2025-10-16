import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/miembrosEditar.css';
import BackButton from '../common/BackButton';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'capunotes_miembros';
const AREAS_KEY = 'capunotes_areas';
const CUERDAS_KEY = 'capunotes_cuerdas';

export default function MiembrosEditar() {
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
      <Container className="pt-5">
        <div className="formulario-miembros">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <BackButton />
            <h1 className="titulo-formulario-miembros" style={{ margin: 0 }}>Modificación de miembro</h1>
          </div>
          <hr className="divisor-amarillo" />

          <Form onSubmit={handleSubmit} className="d-flex flex-column">
            <Form.Group>
              <label className="form-label text-white">Nombre</label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Apellido</label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Tipo de Documento</label>
              <Form.Select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">...</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Número de Documento</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Fecha de Nacimiento</label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Correo Electrónico</label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Provincia</label>
              <Form.Control
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-agregar-cuerda">
              <label className="label-cuerda">Cuerda</label>
              <Form.Select
                className="select-cuerda"
                name="cuerda"
                value={formData.cuerda}
                onChange={handleChange}
              >
                <option value="">Seleccionar cuerda</option>
                {cuerdasDisponibles.map((c) => (
                  <option key={c.id ?? c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>

              <Button
                variant="warning"
                className="btn-agregar-cuerda"
                onClick={() => navigate('/cuerdas')}
                title="Gestionar cuerdas"
                type="button"
              >
                +
              </Button>
            </Form.Group>

            <Row className="mb-3 align-items-center">
              <Col xs={12}>
                <Form.Group className="form-group-miembro">
                  <label className="form-label text-white">Área</label>
                  <Form.Select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar área</option>
                    {areasDisponibles.map((a) => (
                      <option key={a.id ?? a.nombre} value={a.nombre}>
                        {a.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary w-50 me-2" onClick={() => navigate('/miembros')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-warning w-50">
                Guardar cambios
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </main>
  );
}
