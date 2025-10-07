import { useState } from 'react';
import './organizacionCoro.css';

export default function OrganizacionCoro() {

  return (
    <div className="container-fluid min-vh-100 organizacion-bg text-white p-0">
      {/* Botón menú hamburguesa siempre visible */}
    

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 py-4">
          {/* Header */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <img
              src="/Logo coro sin fondo.jpg"
              alt="Logo"
              className="organizacion-logo"
            />
            <h2 className="organizacion-title mb-0">Áreas</h2>
          </div>
          <hr className="divisor-amarillo" />

          {/* Formulario */}
          <form className="mb-4">
            <div className="mb-3">
              <label className="form-label text-white">Nombre:</label>
              <input
                type="text"
                className="form-control organizacion-input"
                placeholder="Nombre del área"
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Descripción:</label>
              <input
                type="text"
                className="form-control organizacion-input"
                placeholder="Descripción"
              />
            </div>
            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold organizacion-btn"
            >
              Agregar
            </button>
          </form>

          {/* Áreas registradas */}
          <div className="fw-semibold mb-2">Áreas registradas:</div>
          <div className="areas-list-scroll">
            {[1, 2, 3].map((i) => (
              <div className="area-card mb-3" key={i}>
                <div className="fw-bold">Administración</div>
                <div className="area-desc">
                  Aquí va la descripción, aquí va la descripción, aquí va la
                  descripción
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-primary btn-sm flex-fill">
                    Consultar
                  </button>
                  <button className="btn btn-warning btn-sm flex-fill">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
