import '../../styles/organizacionCoro.css';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BackButton from '../utils/BackButton';

{
  /* --- Ajuste para mantener la flecha blanca y alinear el título "Áreas" con los textos "Nombre" y "Descripción" --- */
}
export default function Area() {
  return (
    <>  

          {/* Botón menú hamburguesa */}
          <div>
            {/* Añadimos 'navbar-dark' para el ícono blanco.
            Usamos 'backgroundColor' en 'style' para forzar el color exacto. 
          */}
            <nav
              className="navbar  navbar-dark"
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
          </div>
    <main className="organizacion-bg ">
      {/* Botón menú hamburguesa siempre visible */}

          {/* Header */}
          <header className="header-organizacion">
           
            <BackButton />
        
            <h1 className="organizacion-title">Áreas</h1>
          </header>

          <Form className="form-area">
          <hr className="divisor-amarillo" />
            <Form.Group className="form-group mb-3">
              <Form.Label className="text-white">Nombre</Form.Label>
              <Form.Control
                type="text"
                className="form-control organizacion-input"
                placeholder="Nombre del área"
              />
            </Form.Group>
            <Form.Group className="form-group mb-3">
              <Form.Label className="form-label text-white">Descripción</Form.Label>
              <Form.Control
                type="text"
                className="form-control organizacion-input"
                placeholder="Descripción"
              />
            </Form.Group>
            <Button
              type="submit"
              className="organizacion-btn"
            >
              Agregar
            </Button>
          <hr className="divisor-amarillo" />
          </Form>
          {/* Formulario */}
          {/* Áreas registradas */}
          <h2 className="organizacion-title">
            Áreas registradas
            <hr className="divisor-amarillo" />
          </h2>
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
    </main>
  </>
  );
}
