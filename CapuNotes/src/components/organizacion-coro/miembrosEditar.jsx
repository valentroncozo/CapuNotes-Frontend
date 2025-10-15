import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import "../../styles/miembros.css";

export default function MiembrosEditar() {
  const location = useLocation();
  const navigate = useNavigate();
  const miembro = location.state;
  const [form, setForm] = useState({ nombre: "", cuerda: "", area: "" });

  useEffect(() => {
    if (miembro) setForm(miembro);
  }, [miembro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("capunotes_miembros")) || [];
    const updated = stored.map((m) => (m.id === form.id ? form : m));
    localStorage.setItem("capunotes_miembros", JSON.stringify(updated));
    Swal.fire({
      icon: "success",
      title: "Miembro actualizado",
      timer: 1200,
      showConfirmButton: false,
      background: "#11103a",
      color: "#E8EAED",
    });
    navigate("/miembros");
  };

  return (
    <main className="pantalla-miembros">
      <div className="miembros-container">
        <h2 className="miembros-title">Editar Miembro</h2>
        <Form onSubmit={handleGuardar}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cuerda</Form.Label>
            <Form.Control
              type="text"
              name="cuerda"
              value={form.cuerda}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Área</Form.Label>
            <Form.Control
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-3">
            <Button variant="secondary" onClick={() => navigate("/miembros")}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-agregar">
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
