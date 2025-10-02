import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useCrud, useModal, useNotification } from '../hooks';
import * as areasApi from '../services/areas';
import './organizacionCoro.css';

// Reglas de validación para áreas
const areaValidationRules = {
  nombre: {
    required: true,
    label: 'Nombre del área',
    minLength: 2,
    minLengthMessage: 'El nombre debe tener al menos 2 caracteres',
    maxLength: 50,
    maxLengthMessage: 'El nombre no puede exceder 50 caracteres',
  },
  descripcion: {
    required: true,
    label: 'Descripción',
    minLength: 10,
    minLengthMessage: 'La descripción debe tener al menos 10 caracteres',
    maxLength: 500,
    maxLengthMessage: 'La descripción no puede exceder 500 caracteres',
  },
};

// Valores iniciales del formulario de área
const initialAreaValues = {
  nombre: '',
  descripcion: '',
};

const OrganizacionCoro = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();

  // Hook para manejar CRUD de áreas
  const {
    items: areas,
    loading: areasLoading,
    error: areasError,
    fetchItems: fetchAreas,
    createItem: createArea,
    updateItem: updateArea,
    deleteItem: deleteArea,
  } = useCrud(areasApi);

  // Hook para manejar el modal de agregar/editar área
  const {
    isOpen: isModalOpen,
    data: editingArea,
    openModal,
    closeModal,
  } = useModal();

  // Hook para el formulario de área
  const {
    values: areaValues,
    errors: areaErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange: handleAreaChange,
    validate: validateArea,
    reset: resetAreaForm,
    setValue: setAreaValue,
  } = useForm(initialAreaValues, areaValidationRules);

  // Cargar áreas al montar el componente
  React.useEffect(() => {
    loadAreas();
  }, []);

  // Función para cargar áreas
  const loadAreas = async () => {
    try {
      await fetchAreas();
    } catch (error) {
      showError('Error al cargar las áreas del coro');
    }
  };

  // Abrir modal para agregar nueva área
  const handleAgregarArea = () => {
    resetAreaForm();
    openModal(null); // null significa "nueva área"
  };

  // Abrir modal para editar área existente
  const handleEditarArea = (area) => {
    setAreaValue('nombre', area.nombre);
    setAreaValue('descripcion', area.descripcion);
    openModal(area); // pasar el área a editar
  };

  // Manejar envío del formulario de área
  const handleSubmitArea = async (e) => {
    e.preventDefault();

    if (!validateArea()) {
      showWarning('Por favor corrige los errores del formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingArea) {
        // Editando área existente
        await updateArea(editingArea.id, areaValues);
        showSuccess('Área actualizada exitosamente');
      } else {
        // Creando nueva área
        await createArea(areaValues);
        showSuccess('Área creada exitosamente');
      }

      closeModal();
      resetAreaForm();
    } catch (error) {
      showError(
        editingArea ? 'Error al actualizar el área' : 'Error al crear el área'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar eliminación de área
  const handleEliminarArea = async (area) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar el área "${area.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await deleteArea(area.id);
      showSuccess('Área eliminada exitosamente');
    } catch (error) {
      showError('Error al eliminar el área');
    }
  };

  // Navegar de vuelta al menú principal
  const handleVolver = () => {
    navigate('/principal');
  };

  // Navegar al home
  const handleHome = () => {
    window.scrollTo(0, 0);
    navigate('/');
  };

  return (
    <div className="organizacion-container">
      {/* Header */}
      <div className="organizacion-header">
        {/* Botón de menú */}
        <button className="menu-button" onClick={handleVolver}>
          <div className="menu-icon">
            <div className="menu-bar"></div>
            <div className="menu-bar"></div>
            <div className="menu-bar"></div>
          </div>
        </button>

        {/* Centro - Logo + Título */}
        <div className="organizacion-center">
          <img src="/Logo coro sin fondo.jpg" alt="Logo" className="logo" />
          <h1 className="title-secondary">Áreas</h1>
        </div>

        {/* Botón cerrar */}
        <button className="close-btn" onClick={handleHome}>
          ✕
        </button>
      </div>

      {/* Línea divisora */}
      <hr className="divisor-amarillo" />

      {/* Contenido principal */}
      <div className="organizacion-content">
        {/* Formulario para agregar área */}
        <form onSubmit={handleSubmitArea} className="organizacion-form">
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              className={`form-input ${areaErrors.nombre ? 'is-invalid' : ''}`}
              placeholder="Nombre del área"
              value={areaValues.nombre}
              onChange={handleAreaChange}
            />
            {areaErrors.nombre && (
              <div className="invalid-feedback">{areaErrors.nombre}</div>
            )}
          </div>

          <div className="form-group">
            <textarea
              name="descripcion"
              className={`form-input ${
                areaErrors.descripcion ? 'is-invalid' : ''
              }`}
              placeholder="Descripción"
              rows="3"
              value={areaValues.descripcion}
              onChange={handleAreaChange}
            />
            {areaErrors.descripcion && (
              <div className="invalid-feedback">{areaErrors.descripcion}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? editingArea
                ? 'Actualizando...'
                : 'Agregando...'
              : editingArea
              ? 'Actualizar'
              : 'Agregar'}
          </button>
        </form>

        {/* Lista de áreas registradas */}
        <div className="areas-section">
          <h3 className="title-secondary">Áreas registradas:</h3>

          {areasLoading && (
            <div className="loading-message">Cargando áreas...</div>
          )}

          {areasError && (
            <div className="error-message">
              {areasError}
              <button className="btn btn-secondary" onClick={loadAreas}>
                Reintentar
              </button>
            </div>
          )}

          {!areasLoading && !areasError && (
            <div className="areas-list">
              <div className="areas-list-scroll">
                {areas.length === 0 ? (
                  <div className="empty-state">
                    <p>No hay áreas registradas aún.</p>
                    <button
                      className="btn btn-primary"
                      onClick={handleAgregarArea}
                    >
                      Agregar primera área
                    </button>
                  </div>
                ) : (
                  areas.map((area) => (
                    <div key={area.id} className="area-card">
                      <div className="area-content">
                        <h4 className="area-title">{area.nombre}</h4>
                        <p className="area-desc">{area.descripcion}</p>
                      </div>

                      <div className="area-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditarArea(area)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminarArea(area)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar/editar área */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>

            <h2 className="title-primary mb-4">
              {editingArea ? 'Editar Área' : 'Nueva Área'}
            </h2>

            <form onSubmit={handleSubmitArea}>
              <div className="form-group">
                <label className="form-label">Nombre del área</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-input ${
                    areaErrors.nombre ? 'is-invalid' : ''
                  }`}
                  placeholder="Ej: Sopranos, Tenores, etc."
                  value={areaValues.nombre}
                  onChange={handleAreaChange}
                />
                {areaErrors.nombre && (
                  <div className="invalid-feedback">{areaErrors.nombre}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className={`form-input ${
                    areaErrors.descripcion ? 'is-invalid' : ''
                  }`}
                  placeholder="Describe las características de esta área..."
                  rows="4"
                  value={areaValues.descripcion}
                  onChange={handleAreaChange}
                />
                {areaErrors.descripcion && (
                  <div className="invalid-feedback">
                    {areaErrors.descripcion}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingArea
                      ? 'Actualizando...'
                      : 'Creando...'
                    : editingArea
                    ? 'Actualizar'
                    : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizacionCoro;
