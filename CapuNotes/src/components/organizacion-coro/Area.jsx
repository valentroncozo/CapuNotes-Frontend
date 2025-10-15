// src/components/organizacion-coro/Area.jsx
import '../../styles/organizacionCoro.css';
import '../../styles/area-card.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BackButton from '../utils/BackButton';
import CardArea from './Card-area.jsx';
import { useEffect, useState } from 'react';
import useAreas from '../../hooks/useAreas';
import AreaEditPopup from '../popUp/AreaEditPopup.jsx';
import { validateAreaFields, hasErrors } from '../utils/validators';

// ✅ confirm lindo y consistente
import Swal from 'sweetalert2';

export default function Area() {
  const { areas, loading, error, addArea, editArea, removeArea } = useAreas();

  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [fieldErrors, setFieldErrors] = useState({ nombre: null, descripcion: null });

  const [openEdit, setOpenEdit] = useState(false);
  const [areaSel, setAreaSel] = useState(null);

  const [formError, setFormError] = useState('');

  useEffect(() => { setFormError(error || ''); }, [error]);

  const runValidation = (nextState) => {
    const nextErrors = validateAreaFields(nextState);
    setFieldErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const draft = { ...formData, [name]: value };
    setFormData(draft);
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
    const result = await Swal.fire({
      title: '¿Eliminar esta área?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#11103a',
      color: '#E8EAED',
    });

    if (!result.isConfirmed) return;

    setFormError('');
    try {
      await removeArea(id);
      await Swal.fire({
        title: 'Eliminado',
        text: 'El área fue eliminada correctamente.',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: err.message || 'No se pudo eliminar el área.',
        icon: 'error',
        confirmButtonColor: '#ffc107',
        background: '#11103a',
        color: '#E8EAED',
      });
    }
  };

  return (
    <>
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
