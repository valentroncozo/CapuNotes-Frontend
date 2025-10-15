import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../../styles/miembros.css";

export default function Miembros() {
  const navigate = useNavigate();
  const [miembros, setMiembros] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("capunotes_miembros")) || [];
    setMiembros(stored);
  }, []);

  const handleEliminar = (id) => {
    const updated = miembros.filter((m) => m.id !== id);
    setMiembros(updated);
    localStorage.setItem("capunotes_miembros", JSON.stringify(updated));
  };

  const miembrosFiltrados = miembros.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="pantalla-miembros">
      <div className="miembros-container">
        <h2 className="miembros-title">Miembros</h2>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button
            className="btn-agregar"
            onClick={() => navigate("/miembros/agregar")}
          >
            + Agregar
          </Button>
        </div>

        {miembrosFiltrados.length === 0 ? (
          <p>No hay miembros registrados.</p>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla-miembros">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cuerda</th>
                  <th>Área</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {miembrosFiltrados.map((m) => (
                  <tr key={m.id}>
                    <td className="miembro-nombre">{m.nombre}</td>
                    <td>{m.cuerda}</td>
                    <td>{m.area}</td>
                    <td className="acciones">
                      <Button
                        className="btn-accion"
                        onClick={() => navigate("/miembros/editar", { state: m })}
                      >
                        Editar
                      </Button>
                      <Button
                        className="btn-accion eliminar"
                        onClick={() => handleEliminar(m.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
