import { useState } from 'react';
import './organizacionCoro.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

{
  /* --- Ajuste para mantener la flecha blanca y alinear el título "Áreas" con los textos "Nombre" y "Descripción" --- */
}
export default function OrganizacionCoro() {
  return (
    <div className="container-fluid min-vh-100 organizacion-bg text-white p-0">
      {/* Botón menú hamburguesa siempre visible */}

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 py-4">
          {/* Header */}
          <div className="row mb-2">
            <div className="col-auto">
              <ArrowBackIcon
                onClick={() => console.log('Regresar')}
                className="arrow-back-icon"
                style={{
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '2rem',
                  marginRight: '10px',
                  transition: 'transform 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#e0a800';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#fff';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            <div className="col">
              <h2 className="organizacion-title mb-0 text-center">Áreas</h2>
            </div>
          </div>
          <hr className="divisor-amarillo" />

          {/* Formulario */}
          <form className="mb-4">
            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label text-white">Nombre</label>
                <input
                  type="text"
                  className="form-control organizacion-input"
                  placeholder="Nombre del área"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label text-white">Descripción</label>
                <input
                  type="text"
                  className="form-control organizacion-input"
                  placeholder="Descripción"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-warning w-100 fw-bold organizacion-btn"
                >
                  Agregar
                </button>
              </div>
            </div>
          </form>

          {/* Áreas registradas */}
          <div className="fw-semibold mb-2">Áreas registradas:</div>
          <div className="areas-list-scroll">
            {[1, 2, 3].map((i) => (
              <div className="area-card mb-3" key={i}>
                <div className="row">
                  <div className="col-12 fw-bold">Administración</div>
                </div>
                <div className="row">
                  <div className="col-12 area-desc">
                    Aquí va la descripción, aquí va la descripción, aquí va la
                    descripción
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6">
                    <button className="btn btn-primary btn-sm w-100">
                      Consultar
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-warning btn-sm w-100">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menú hamburguesa */}
      <div>
        <nav
          className="navbar fixed-top w-100 navbar-dark"
          style={{ padding: '10px' }}
        >
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
            <h5 className="offcanvas-title" id="offcanvasMenuLabel">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <a className="nav-link" href="#">
              Inicio
            </a>
            <a className="nav-link" href="#">
              Asistencias
            </a>
            <a className="nav-link" href="#">
              Audiciones
            </a>
            <a className="nav-link" href="#">
              Canciones
            </a>
            <a className="nav-link" href="#">
              Eventos
            </a>
            <a className="nav-link" href="#">
              Fraternidades
            </a>
            <a className="nav-link" href="#">
              Miembros
            </a>
            <a className="nav-link" href="#">
              Organización del Coro
            </a>
            <a className="nav-link" href="#">
              Usuarios y roles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
