import '../../styles/organizacionCoro.css';
import '../../styles/area-card.css';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BackButton from '../utils/BackButton';
import CardArea from './Card-area.jsx';
import { useEffect, useState } from 'react';
import useAreas from '../../hooks/useAreas';
import AreaEditPopup from '../popUp/AreaEditPopup.jsx';

// ✅ validaciones centralizadas
import { validateAreaFields, hasErrors } from "../utils/validators";

export default function Area({ onLogout }) {
  const { areas, loading, error, addArea, editArea, removeArea } = useAreas();

  // formulario alta
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [fieldErrors, setFieldErrors] = useState({ nombre: null, descripcion: null });

  // popup edición
  const [openEdit, setOpenEdit] = useState(false);
  const [areaSel, setAreaSel] = useState(null);

  // error general (API/operación)
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormError(error || '');
  }, [error]);

  const runValidation = (nextState) => {
    const nextErrors = validateAreaFields(nextState);
    setFieldErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const draft = { ...formData, [name]: value };
    setFormData(draft);
    // validación en vivo
    runValidation(draft);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const ok = runValidation(formData);
    if (!ok) return;
    try {
      await addArea({ nombre: formData.nombre, descripcion: formData.descripcion });
      setFormData({ nombre: '', descripcion: '' });
      setFieldErrors({ nombre: null, descripcion: null });
    } catch (err) {
      setFormError(err.message || 'No se pudo crear el área.');
    }
  };

  const handleEditOpen = (area) => {
    setAreaSel(area);
    setOpenEdit(true);
  };

  const handleEditSave = async ({ id, nombre, descripcion }) => {
    setFormError('');
    try {
      await editArea({ id, nombre, descripcion });
    } catch (err) {
      setFormError(err.message || 'No se pudo actualizar el área.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta área?')) return;
    setFormError('');
    try {
      await removeArea(id);
    } catch (err) {
      setFormError(err.message || 'No se pudo eliminar el área.');
    }
  };

  return (
    <>
      <div>
        <nav className="navbar fixed-top w-100 navbar-dark" style={{ padding: '10px' }}>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasMenu"
          aria-labelledby="offcanvasMenuLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>

            <button
              type="button"
              className="nav-link"
              style={{ color: '#E8EAED', background: 'transparent', border: 'none' }}
              data-bs-dismiss="offcanvas"
              onClick={() => { onLogout?.(); }}
            >
              Cerrar sesión
            </button>
          </div>

          <div className="offcanvas-body">
            <Link className="nav-link" to="/inicio">Inicio</Link>
            <Link className="nav-link" to="/asistencias">Asistencias</Link>
            <Link className="nav-link" to="/audiciones">Audiciones</Link>
            <Link className="nav-link" to="/canciones">Canciones</Link>
            <Link className="nav-link" to="/eventos">Eventos</Link>
            <Link className="nav-link" to="/fraternidades">Fraternidades</Link>
            <Link className="nav-link" to="/miembros">Miembros</Link>
            <Link className="nav-link" to="/organizacion-coro">Organización del Coro</Link>
            <Link className="nav-link" to="/usuarios-roles">Usuarios y roles</Link>
          </div>
        </div>

        <div style={{ marginTop: '60px' }}></div>
      </div>

      <main className="organizacion-bg">
        <header className="header-organizacion">
          <BackButton />
          <h1 className="organizacion-title">Áreas</h1>
        </header>

        {/* Formulario alta */}
        <Form className="form-area" onSubmit={handleSubmit} noValidate>
          <hr className="divisor-amarillo" />

          <Form.Group className="form-group">
            <Form.Label className="text-white">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="form-control organizacion-input"
              placeholder="Nombre del área"
              maxLength={80}
              isInvalid={!!fieldErrors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label text-white">Descripción</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control organizacion-input"
              placeholder="Descripción"
              maxLength={300}
              isInvalid={!!fieldErrors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.descripcion}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="organizacion-btn">Agregar</Button>
          <hr className="divisor-amarillo" />

          {formError && (
            <div
              style={{
                background: 'rgba(255,193,7,.12)',
                border: '1px solid rgba(255,193,7,.35)',
                color: '#E8EAED',
                borderRadius: '16px',
                padding: '10px 12px',
                fontSize: '.9rem',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              {formError}
            </div>
          )}
        </Form>

        {/* Listado */}
        <h2 className="areas-title">
          Áreas registradas
          <hr className="divisor-amarillo" />
        </h2>

        <div className="areas-list-scroll">
          {loading ? (
            <p style={{ color: '#E8EAED' }}>Cargando...</p>
          ) : areas.length === 0 ? (
            <p style={{ color: '#E8EAED' }}>No hay áreas registradas</p>
          ) : (
            areas.map((a) => (
              <CardArea
                key={a.id}
                id={a.id}
                nombre={a.nombre}
                descripcion={a.descripcion}
                onEdit={handleEditOpen}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      {/* Popup edición */}
      <AreaEditPopup
        isOpen={openEdit}
        onClose={() => { setOpenEdit(false); setAreaSel(null); }}
        area={areaSel}
        onSave={handleEditSave}
      />
    </>
  );
}
