import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '@/styles/miembros.css';
import '@/styles/abmc.css';
import BackButton from "@/components/common/BackButton.jsx";


const STORAGE_KEY = 'capunotes_miembros';
const AREAS_KEY = 'capunotes_areas';
const CUERDAS_KEY = 'capunotes_cuerdas';

export default function MiembrosAgregar({title = "Registro de miembro"}) {
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
      <div className="abmc-card">
          <div className="abmc-header">
            <BackButton />
            <h1 className="abmc-title">{title}</h1>
          </div>
  
          <Form onSubmit={handleSubmit} className="abmc-topbar">

            <Form.Group className="form-group-miembro">
              <label>Nombre</label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Ej: Juan"
                value={miembro.nombre}
              onChange={handleChange}
              className="abmc-input"
            />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Apellido</label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Ej: Pérez"
                value={miembro.apellido}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Tipo de Documento</label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className="abmc-select"
              >
                <option value="">Tipo de documento</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Número de Documento</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                placeholder="Ej: 40123456"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Fecha de Nacimiento</label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={miembro.fechaNacimiento}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Correo Electrónico</label>
              <Form.Control
                type="email"
                name="correo"
                placeholder="Ej: juanperez@mail.com"
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Teléfono</label>
              <Form.Control
                type="tel"
                name="telefono"
                placeholder="Ej: +54 11 1234-5678"
                value={miembro.telefono}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Provincia</label>
              <Form.Control
                type="text"
                name="provincia"
                placeholder="Ej: Buenos Aires"
                value={miembro.provincia}
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
                Agregar
              </button>
            </Form.Group>
          </Form>
      </div>
    </main>
  );
}