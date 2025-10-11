import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './cuerdas.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Cuerdas() {
  const [ nombre, setNombre ] = useState('');

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Por favor ingresá un nombre válido.');
      return;
    }

  const cuerdasGuardadas = JSON.parse(localStorage.getItem('capunotes_cuerdas')) || [];
  const nuevaLista = cuerdasGuardadas.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())
    ? cuerdasGuardadas
    : [...cuerdasGuardadas, { nombre }];
  localStorage.setItem('capunotes_cuerdas', JSON.stringify(nuevaLista));

    localStorage.setItem('capunotes_cuerdas', JSON.stringify(nuevaLista));
      Swal.fire({
        icon: 'success',
        title: 'Cuerda guardada',
        text: `"${nombre}" fue agregada correctamente.`,
        confirmButtonColor: '#ffc107',
      });
      setNombre('');

      if (!nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingresá un nombre válido.',
        confirmButtonColor: '#ffc107',
      });
    }
  };

  return (
    <div>
      {/* Navbar */}
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

      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <Link className="nav-link" to="/inicio">
            Inicio
          </Link>
          <Link className="nav-link" to="/asistencias">
            Asistencias
          </Link>
          <Link className="nav-link" to="/audiciones">
            Audiciones
          </Link>
          <Link className="nav-link" to="/canciones">
            Canciones
          </Link>
          <Link className="nav-link" to="/eventos">
            Eventos
          </Link>
          <Link className="nav-link" to="/fraternidades">
            Fraternidades
          </Link>
          <Link className="nav-link" to="/miembros">
            Miembros
          </Link>
          <Link className="nav-link" to="/organizacion-coro">
            Organización del Coro 
          </Link>
          <Link className="nav-link" to="/usuarios-roles">
            Usuarios y roles
          </Link>
        </div>
      </div>
      
      {/* Esto evita que el contenido quede debajo del navbar */}
      <div style={{ marginTop: '100px', padding: '20px' }}>
        <h2 className="text-center mb-4">Cuerdas del Coro</h2>
      </div>
          <div className="pantalla-cuerdas">
            <form className="formulario-cuerda" onSubmit={handleGuardar}>
            <div className="mb-3">
              <label className="form-label">Ingrese nombre de Cuerda</label>
              <input
                type="text"
                className="input-cuerda"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Soprano, Tenor, Barítono..."
              />
            </div>

            <div className="d-flex justify-content-between gap-2">
              <button type="button" className="btn btn-secundario w-50" onClick={() => setNombre('')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-warning w-50">
                Guardar
              </button>
            </div>
            </form>
          </div>
    </div>
  );
}
