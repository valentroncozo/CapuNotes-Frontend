import './organizacionCoro.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
{
  /* --- Ajuste para mantener la flecha blanca y alinear el título "Áreas" con los textos "Nombre" y "Descripción" --- */
}
export default function OrganizacionCoro() {
  return (
    <>  
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
          <div className="fw-semibold mb-2">Áreas registradas</div>
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
    </div>
  </>
  );
}
