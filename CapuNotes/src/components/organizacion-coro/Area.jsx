import '../../styles/organizacionCoro.css';
import '../../styles/area-card.css';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BackButton from '../utils/BackButton';
import CardArea from './Card-area.jsx';
import { useState } from 'react';
{
  /* --- Ajuste para mantener la flecha blanca y alinear el título "Áreas" con los textos "Nombre" y "Descripción" --- */
}
export default function Area() {
  const [areas, setAreas] = useState([
    {
      id: 1,
      name: "Soprano",
      description: "Voces agudas femeninas"
    },
    {
      id: 2,
      name: "Alto",
      description: "Voces graves femeninas"
    },
    {
      id: 3,
      name: "Tenor",
      description: "Voces agudas masculinas"
    },  
    {
      id: 4,
      name: "Bajo",
      description: "Voces graves masculinas"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',   
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));  
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      const newArea = {
        id: Math.max(...areas.map(area => area.id), 0) + 1,
        name: formData.name.trim(),
        description: formData.description.trim()
      };
      setAreas(prev => [...prev, newArea]);
      setFormData({ name: '', description: '' }); // Limpiar formulario
    }
  };



  return (
    <>  
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
    <main className="organizacion-bg ">
      {/* Botón menú hamburguesa siempre visible */}

          {/* Header */}
          <header className="header-organizacion">
            <BackButton/>
            <h1 className="organizacion-title">Áreas</h1>
          </header>

          {/* Formulario */}
          <Form className="form-area" onSubmit={handleSubmit}>
          <hr className="divisor-amarillo" />
            <Form.Group className="form-group">
              <Form.Label className="text-white">Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control organizacion-input"
                placeholder="Nombre del área"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label text-white">Descripción</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control organizacion-input"
                placeholder="Descripción"
                required
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

          {/* Áreas registradas */}
          <h2 className="areas-title">
          Áreas registradas
            <hr className="divisor-amarillo" />
          </h2>

          <div className="areas-list-scroll">
            {
              areas.map((area) => (
                <CardArea key={area.id} id={area.id} name={area.name} description={area.description} />
              ))
            }
          </div>
    </main>
  </>
  );
}
