import React, { useState, useEffect } from "react";
import "../../styles/cuerdas.css";
import { PlusCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// Clave de persistencia
const STORAGE_KEY = 'capunotes_cuerdas';

export default function Cuerda({ cuerdas = [] }) {
  const [nombre, setNombre] = useState("");
  const [listaCuerdas, setListaCuerdas] = useState(cuerdas);
  const [show] = useState(true); // Control del modal
  // Para notificar al padre (si es necesario)
  const onGuardar = null; // Aquí podrías pasar una función si es necesario
  // Navegación
  const navigate = useNavigate();

  // 1. Cargar datos al iniciar el modal
    useEffect(() => {
        if (show) {
            const cuerdasGuardadas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            setListaCuerdas(cuerdasGuardadas);
        }
    }, [show]);

  // 2. Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const existe = listaCuerdas.some(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (!existe) {
      const nuevaCuerda = {
      id: Date.now(), // o usar crypto.randomUUID() si querés algo más robusto
      nombre: nombre.trim()
      };
            const nuevaLista = [...listaCuerdas, nuevaCuerda];
            
            // 2. Guardar en localStorage y actualizar estado
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaLista));
            setListaCuerdas(nuevaLista); 
            
            // 3. Notificar al padre (opcional, si necesita recargar el select)
            onGuardar && onGuardar(nuevaLista);
            setNombre("");
    }
  };

  // boton de eliminar
  const handleEliminar = (id) => {
  const confirmacion = window.confirm("¿Eliminar esta cuerda?");
  if (!confirmacion) return;

    const actualizadas = listaCuerdas.filter((c) => c.id !== id);
    setListaCuerdas(actualizadas);
    localStorage.setItem("capunotes_cuerdas", JSON.stringify(actualizadas));
  };

  return (
    <div className="lab-page">
      {/* Botón menú hamburguesa */}
      <div>
        {/* Añadimos 'navbar-dark' para el ícono blanco.
        Usamos 'backgroundColor' en 'style' para forzar el color exacto. 
      */}
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
      {/* Botón cerrar sesión CORREGIDO */}
      <button
          type="button"
          className="nav-link" // Mantenemos nav-link para el estilo de color y btn
          // ✅ CORRECCIÓN: Quitamos los estilos en línea que fuerzan el padding y el textAlign
          // Dejamos solo los estilos esenciales que no pueden ir en CSS
          style={{ color: '#E8EAED', background: 'transparent', border: 'none' }} 
          data-bs-dismiss="offcanvas"
          onClick={() => { if (onLogout) onLogout(); }}
      >
          Cerrar sesión
      </button>
    </div>
    <div className="offcanvas-body">
      <Link className="nav-link" to="/inicio" >
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

        {/* Esto es solo para que el contenido no quede debajo de la navbar */}
        <div style={{ marginTop: '60px' }}></div>
      </div>
      {/* === Fin NavBar estándar requerido (según guía) === */}

        <div className="lab-page-content"> 
            <div className="lab-card">
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
                        <Button onClick={() => handleEliminar(c.id)}>Eliminar</Button>
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