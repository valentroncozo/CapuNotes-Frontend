import React, { useState } from "react";
import "./cuerdas.css";
import { PlusCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from "react-bootstrap";


export default function Cuerda({ cuerdas = [] }) {
  const [nombre, setNombre] = useState("");
  const [listaCuerdas, setListaCuerdas] = useState(cuerdas);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const existe = listaCuerdas.some(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (!existe) {
      const nuevaLista = [...listaCuerdas, { nombre }];
      setListaCuerdas(nuevaLista);
      setNombre("");
    }
  };

  return (
    <div className="lab-page">
      {/* === NavBar estándar requerido (según guía) === */}
      <div>
        <nav className="navbar fixed-top w-100 navbar-dark" style={{ padding: "10px" }}>
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
            </div>
            <div className="offcanvas-body">
              <a className="nav-link" href="#">Inicio</a>
              <a className="nav-link" href="#">Asistencias</a>
              <a className="nav-link" href="#">Audiciones</a>
              <a className="nav-link" href="#">Canciones</a>
              <a className="nav-link" href="#">Eventos</a>
              <a className="nav-link" href="#">Fraternidades</a>
              <a className="nav-link" href="#">Miembros</a>
              <a className="nav-link" href="#">Organización del Coro</a>
              <a className="nav-link" href="#">Usuarios y roles</a>
            </div>
          </div>
      </div>
      {/* === Fin NavBar estándar requerido (según guía) === */}

        {/* ✅ USAR UN SOLO CONTENEDOR PRINCIPAL QUE APLIQUE EL ESPACIO */} 
        <div className="lab-page-content"> 
            <div className="lab-card">
            {/* 🎯 EL ENCABEZADO CON LA FLECHA QUEDA AQUÍ ABAJO */}
            <div className="cuerda-header-flex">
                <Button variant="link" className="p-0 back-btn-inline" onClick={() => navigate(-1)} title="Volver">
                    <ArrowBackIcon 
                        style={{ color: '#fff', fontSize: '28px' }} 
                    /> 
                </Button>
            </div>
            
            <h2 className="lab-title">Laboratorio: Edición de Cuerdas</h2>

            <p className="lab-note">
              Probá el pop-up para modificar el nombre de una cuerda.
            </p>

            <form className="lab-row add-cuerda-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="cuerda-input"
                    placeholder="Ej: Soprano, Tenor..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required // Agregamos required para mejorar la usabilidad
                />
                <button type="submit" className="capu-btn">
                    <PlusCircleFill size={16} style={{ marginRight: '5px' }} />
                    Agregar
                </button>
            </form>

            <div className="cuerda-table-wrapper">
              <table className="cuerda-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaCuerdas.map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{c.nombre}</td>
                      <td>
                        <button className="cuerda-edit">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  );
}