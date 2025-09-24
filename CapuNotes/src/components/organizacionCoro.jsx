import { useEffect, useState } from "react";
import "./organizacionCoro.css";
import Menu from "./menu.jsx";
import AreaModal from "./modificarArea.jsx";
import { useNavigate } from "react-router-dom";
import { areasApi } from "../services/areas"; // 👈 importamos API

export default function OrganizacionCoro({ onClose }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    navigate("/menu");
  };
  
  const handleGuardarCambios = async (updatedArea) => {
  try {
    await areasApi.actualizar(selectedArea.name, {
      name: updatedArea.name,
      description: updatedArea.description,
    });
    await cargarAreas();
    setShowModal(false);
    setSelectedArea(null);
  } catch (err) {
    console.error("Error al actualizar área:", err);
    alert("No se pudo actualizar el área");
  }
};


  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // Estado de áreas
  const [areas, setAreas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Cargar áreas al inicio
  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    try {
      const data = await areasApi.listar();
      setAreas(data);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await areasApi.crear({ name: nombre, description: descripcion });
      setNombre("");
      setDescripcion("");
      cargarAreas(); // refrescar lista
    } catch (err) {
      console.error("Error al crear área:", err);
      alert("No se pudo crear el área");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta área?")) return;
    try {
      await areasApi.eliminarPorId(id);
      cargarAreas();
    } catch (err) {
      console.error("Error al eliminar área:", err);
    }
  };

  return (
    <div className="container-fluid min-vh-100 organizacion-bg text-white p-0">
      {/* Botón cerrar */}
      <button className="menu-close" onClick={handleClose}>
        ✕
      </button>

      {/* Menú hamburguesa */}
      <button
        className="btn btn-link position-absolute top-0 start-0 m-3 p-0 z-3"
        onClick={() => setMenuAbierto(true)}
      >
        <span className="menu-bar d-block mb-1"></span>
        <span className="menu-bar d-block mb-1"></span>
        <span className="menu-bar d-block"></span>
      </button>

      {menuAbierto && <Menu onClose={() => setMenuAbierto(false)} />}

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
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white">Nombre:</label>
              <input
                type="text"
                className="form-control organizacion-input"
                placeholder="Nombre del área"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Descripción:</label>
              <input
                type="text"
                className="form-control organizacion-input"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
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
            {areas.map((area) => (
              <div className="area-card mb-3" key={area.id}>
                <div className="fw-bold">{area.name}</div>
                <div className="area-desc">{area.description}</div>
                <div className="btn-container">
                  <button
                    className="btn-card"
                    onClick={() => {
                      setSelectedArea(area);
                      setShowModal(true);
                    }}
                  >
                    Consultar
                  </button>
                  <button
                    className="btn-card"
                    onClick={() => handleEliminar(area.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AreaModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedArea(null);
        }}
        area={selectedArea}
        onSave={handleGuardarCambios}   // 👈 nuevo
      />

    </div>
  );
}
