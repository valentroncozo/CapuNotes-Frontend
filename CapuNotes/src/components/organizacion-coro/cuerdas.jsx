import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../styles/cuerdas.css";

export default function Cuerdas() {
  const [cuerdas, setCuerdas] = useState([]);
  const [nuevaCuerda, setNuevaCuerda] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("capunotes_cuerdas")) || [];
    setCuerdas(stored);
  }, []);

  const guardarEnLocal = (list) => {
    setCuerdas(list);
    localStorage.setItem("capunotes_cuerdas", JSON.stringify(list));
  };

  const agregarCuerda = (e) => {
    e.preventDefault();
    const nombre = nuevaCuerda.trim();
    if (!nombre) {
      Swal.fire({
        icon: "warning",
        title: "Debe ingresar un nombre",
        background: "#11103a",
        color: "#E8EAED",
      });
      return;
    }
    if (cuerdas.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      Swal.fire({
        icon: "warning",
        title: "Ya existe una cuerda con ese nombre",
        background: "#11103a",
        color: "#E8EAED",
      });
      return;
    }
    const nueva = { id: crypto.randomUUID(), nombre };
    const updated = [...cuerdas, nueva];
    guardarEnLocal(updated);
    setNuevaCuerda("");
  };

  const eliminarCuerda = (id) => {
    Swal.fire({
      title: "¿Eliminar esta cuerda?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
    }).then((res) => {
      if (!res.isConfirmed) return;
      const updated = cuerdas.filter((c) => c.id !== id);
      guardarEnLocal(updated);
    });
  };

  return (
    <main className="lab-page">
      <div className="lab-card">
        <h1 className="lab-title">Cuerdas</h1>

        <form onSubmit={agregarCuerda} className="add-cuerda-form">
          <input
            type="text"
            className="cuerda-input"
            placeholder="Nombre de la cuerda"
            value={nuevaCuerda}
            onChange={(e) => setNuevaCuerda(e.target.value)}
          />
          <button type="submit" className="capu-btn">
            Agregar
          </button>
        </form>

        <table className="cuerda-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuerdas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>
                  <button
                    className="cuerda-edit"
                    onClick={() => eliminarCuerda(c.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cuerdas.length === 0 && (
          <p className="lab-note">No hay cuerdas registradas.</p>
        )}
      </div>
    </main>
  );
}
