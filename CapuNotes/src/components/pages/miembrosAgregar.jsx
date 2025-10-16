import React, { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../styles/miembrosAgregar.css';
import BackButton from '../common/BackButton';

const STORAGE_KEY = 'capunotes_miembros';
const AREAS_KEY = 'capunotes_areas';
const CUERDAS_KEY = 'capunotes_cuerdas';

export default function MiembrosAgregar() {
  const empty = {
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
  };

  const [miembro, setMiembro] = useState(empty);
  const [listaMiembros, setListaMiembros] = useState([]);
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cuerdasGuardadas = JSON.parse(localStorage.getItem(CUERDAS_KEY)) || [];
    setCuerdasDisponibles(cuerdasGuardadas);
    const areasGuardadas = JSON.parse(localStorage.getItem(AREAS_KEY)) || [];
    setAreasDisponibles(areasGuardadas);
    const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setListaMiembros(guardados);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!miembro.nombre || !miembro.cuerda) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor completá al menos Nombre y Cuerda.',
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }

    const nuevo = { ...miembro, id: crypto?.randomUUID?.() || Date.now() };
    const actualizados = [...listaMiembros, nuevo];
    setListaMiembros(actualizados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));

    await Swal.fire({
      icon: 'success',
      title: 'Miembro registrado',
      text: `Se registró ${miembro.nombre} exitosamente.`,
      timer: 1600,
      showConfirmButton: false,
      background: '#11103a',
      color: '#E8EAED',
    });

    setMiembro(empty);
    navigate('/miembros');
  };

  return (
    <main className="pantalla-miembros">
      <Container className="pt-5">
        <div className="formulario-miembros">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <BackButton />
            <h1 className="titulo-formulario-miembros" style={{ margin: 0 }}>Registro de miembro</h1>
          </div>
          <hr className="divisor-amarillo" />

          <Form onSubmit={handleSubmit} className="d-flex flex-column">
            <label className="form-label text-white">Nombre</label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ej: Juan"
              value={miembro.nombre}
              onChange={handleChange}
              className="form-control"
            />

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Apellido</label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Ej: Pérez"
                value={miembro.apellido}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Tipo de Documento</label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tipo de documento</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Número de Documento</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                placeholder="Ej: 40123456"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Fecha de Nacimiento</label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={miembro.fechaNacimiento}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Correo Electrónico</label>
              <Form.Control
                type="email"
                name="correo"
                placeholder="Ej: juanperez@mail.com"
                value={miembro.correo}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Teléfono</label>
              <Form.Control
                type="tel"
                name="telefono"
                placeholder="Ej: +54 11 1234-5678"
                value={miembro.telefono}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label className="form-label text-white">Provincia</label>
              <Form.Control
                type="text"
                name="provincia"
                placeholder="Ej: Buenos Aires"
                value={miembro.provincia}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="form-group-agregar-cuerda">
              <label className="label-cuerda">Cuerda</label>
              <Form.Select
                className="select-cuerda"
                name="cuerda"
                value={miembro.cuerda}
                onChange={handleChange}
              >
                <option value="">Seleccionar cuerda</option>
                {cuerdasDisponibles.map((c) => (
                  <option key={c.id ?? c.nombre} value={c.nombre}>{c.nombre}</option>
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

            <Form.Group className="form-group-miembro">
              <label className="label-cuerda">Área</label>
              <Form.Select
                name="area"
                value={miembro.area}
                onChange={handleChange}
              >
                <option value="">Seleccionar área</option>
                {areasDisponibles.map((a) => (
                  <option key={a.id ?? a.nombre} value={a.nombre}>{a.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary w-50 me-2" onClick={() => navigate('/miembros')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-warning w-50">
                Agregar
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </main>
  );
}
