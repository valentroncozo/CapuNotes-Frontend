import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "@/styles/miembros.css";
import "@/styles/abmc.css";
import BackButton from "@/components/common/BackButton.jsx";
import { cuerdasService } from "@/services/cuerdasService.js";
import { areasService } from "@/services/areasService.js";
import { miembrosService } from "@/services/miembrosService.js";


export default function MiembrosAgregar({ title = "Registro de miembro" }) {
  const empty = {
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    provincia: "",
    carreraProfesion: "",
    lugarOrigen: "",
    instrumentoMusical: "",
    cuerda: "",
    area: "",
    estado: "Activo",
  };

  const [miembro, setMiembro] = useState(empty);
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const navigate = useNavigate();

  // 🔹 Cargar cuerdas y áreas desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cuerdas, areas] = await Promise.all([
          cuerdasService.list(),
          areasService.list(),
        ]);
        setCuerdasDisponibles(cuerdas);
        setAreasDisponibles(areas);
      } catch (error) {
        console.error("Error cargando cuerdas o áreas:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "No se pudieron cargar las cuerdas o áreas.",
          background: "#11103a",
          color: "#E8EAED",
        });
      }
    };
    fetchData();
  }, []);

  // 🔹 Actualizar estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!miembro.nombre || !miembro.cuerda) {
      await Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completá al menos Nombre y Cuerda.",
        background: "#11103a",
        color: "#E8EAED",
      });
      return;
    }

    try {
      // Construimos el JSON que tu backend espera:
      const payload = {
        id: {
          nroDocumento: miembro.numeroDocumento,
          tipoDocumento: miembro.tipoDocumento,
        },
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        fechaNacimiento: miembro.fechaNacimiento || null,
        nroTelefono: miembro.telefono || null,
        correo: miembro.correo,
        carreraProfesion: miembro.carreraProfesion || null,
        lugarOrigen: miembro.lugarOrigen || miembro.provincia || null,
        instrumentoMusical: miembro.instrumentoMusical || null,
        activo: miembro.estado === "Activo",
        cuerda: {
          id: parseInt(miembro.cuerda),
        },
        area: {
          id: parseInt(miembro.area),
        },
      };

      await miembrosService.create(payload);

      await Swal.fire({
        icon: "success",
        title: "Miembro registrado",
        text: `Se registró ${miembro.nombre} exitosamente.`,
        timer: 1600,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });

      setMiembro(empty);
      navigate("/miembros");
    } catch (error) {
      console.error("Error registrando miembro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el miembro. Verificá los datos.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
        </div>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          {/* Nombre */}
          <Form.Group className="form-group-miembro">
            <label>Nombre</label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ej: Juan"
              value={miembro.nombre}
              onChange={handleChange}
              className="abmc-input"
            />
          </Form.Group>

          {/* Apellido */}
          <Form.Group className="form-group-miembro">
            <label>Apellido</label>
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Ej: Pérez"
              value={miembro.apellido}
              onChange={handleChange}
              className="abmc-input"
            />
          </Form.Group>

          {/* Tipo de documento */}
          <Form.Group className="form-group-miembro">
            <label>Tipo de Documento</label>
            <Form.Select
              name="tipoDocumento"
              value={miembro.tipoDocumento}
              onChange={handleChange}
              className="abmc-select"
            >
              <option value="">Tipo de documento</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Libreta Cívica">Libreta Cívica</option>
            </Form.Select>
          </Form.Group>

          {/* Nro documento */}
          <Form.Group className="form-group-miembro">
            <label>Número de Documento</label>
            <Form.Control
              type="text"
              name="numeroDocumento"
              placeholder="Ej: 40123456"
              value={miembro.numeroDocumento}
              onChange={handleChange}
              className="abmc-input"
            />
          </Form.Group>

          {/* Cuerda */}
          <Form.Group className="form-group-agregar">
            <label>Cuerda</label>
            <select
              className="abmc-select"
              name="cuerda"
              value={miembro.cuerda}
              onChange={handleChange}
            >
              <option value="">Seleccionar cuerda</option>
              {cuerdasDisponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <Button
              variant="warning"
              className="abmc-btn"
              onClick={() => navigate("/cuerdas")}
              title="Gestionar cuerdas"
              type="button"
            >
              +
            </Button>
          </Form.Group>

          {/* Área */}
          <Form.Group className="form-group-agregar">
            <label>Área</label>
            <select
              name="area"
              className="abmc-select"
              value={miembro.area}
              onChange={handleChange}
            >
              <option value="">Seleccionar área</option>
              {areasDisponibles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>

            <Button
              variant="warning"
              className="abmc-btn"
              onClick={() => navigate("/areas")}
              title="Gestionar áreas"
              type="button"
            >
              +
            </Button>
          </Form.Group>

          {/* Acciones */}
          <Form.Group className="form-group-agregar-acciones">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary btn btn-secondary"
              onClick={() => navigate("/miembros")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="abmc-btn abmc-btn-primary btn btn-primary"
            >
              Agregar
            </button>
          </Form.Group>
        </Form>
      </div>
    </main>
  );
}
