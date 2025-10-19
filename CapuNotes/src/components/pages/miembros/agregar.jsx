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
  const navigate = useNavigate();

  const empty = {
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    telefono: "",
    correo: "",
    carreraProfesion: "",
    lugarOrigen: "",
    instrumentoMusical: "",
    cuerda: "",
    area: "",
  };

  const [miembro, setMiembro] = useState(empty);
  const [errores, setErrores] = useState({});
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  // 🔹 Cargar cuerdas y áreas
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

  // 🔹 Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔹 Validación antes de enviar
  const validarCampos = () => {
    const camposRequeridos = [
      "nombre",
      "apellido",
      "tipoDocumento",
      "numeroDocumento",
      "cuerda",
    ];
    const nuevosErrores = {};
    camposRequeridos.forEach((campo) => {
      if (!miembro[campo] || String(miembro[campo]).trim() === "") {
        nuevosErrores[campo] = "Campo obligatorio";
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // 🔹 Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completá todos los campos obligatorios marcados en amarillo.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }

    try {
      const payload = {
        id: {
          nroDocumento: miembro.numeroDocumento,
          tipoDocumento: miembro.tipoDocumento,
        },
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        fechaNacimiento: miembro.fechaNacimiento || null,
        nroTelefono: miembro.telefono || null,
        correo: miembro.correo || null,
        carreraProfesion: miembro.carreraProfesion || null,
        lugarOrigen: miembro.lugarOrigen || null,
        instrumentoMusical: miembro.instrumentoMusical || null,
        activo: true,
        cuerda: { id: parseInt(miembro.cuerda) },
        area: miembro.area ? { id: parseInt(miembro.area) } : null,
      };

      await miembrosService.create(payload);

      Swal.fire({
        icon: "success",
        title: "Miembro registrado",
        text: `Se registró ${miembro.nombre} correctamente.`,
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
          <p className="aviso-obligatorios">Los campos marcados con <span className="required">*</span> son obligatorios.</p>
        </div>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          {/* Nombre */}
          <Form.Group className="form-group-miembro">
            <label>
              Nombre <span className="required">*</span>
            </label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ej: Juan"
              value={miembro.nombre}
              onChange={handleChange}
              className={`abmc-input ${errores.nombre ? "error" : ""}`}
            />
          </Form.Group>

          {/* Apellido */}
          <Form.Group className="form-group-miembro">
            <label>
              Apellido <span className="required">*</span>
            </label>
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Ej: Pérez"
              value={miembro.apellido}
              onChange={handleChange}
              className={`abmc-input ${errores.apellido ? "error" : ""}`}
            />
          </Form.Group>

          {/* Tipo y número documento */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>
                Tipo de Documento <span className="required">*</span>
              </label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className={`abmc-select visible-dropdown ${errores.tipoDocumento ? "error" : ""}`}>

                <option value="">Seleccionar tipo</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </div>

            <div className="mitad">
              <label>
                Número de Documento <span className="required">*</span>
              </label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                placeholder="Ej: 40123456"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${errores.numeroDocumento ? "error" : ""}`}
              />
            </div>
          </div>

          {/* Fecha de nacimiento y lugar de origen */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Fecha de Nacimiento</label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={miembro.fechaNacimiento}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>

            <div className="mitad">
              <label>Lugar de Origen</label>
              <Form.Control
                type="text"
                name="lugarOrigen"
                placeholder="Ej: Córdoba"
                value={miembro.lugarOrigen}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* Teléfono y correo */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                placeholder="Ej: 3512345678"
                value={miembro.telefono}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>

            <div className="mitad">
              <label>Correo</label>
              <Form.Control
                type="email"
                name="correo"
                placeholder="Ej: nombre@mail.com"
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* Profesión e instrumento */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Carrera / Profesión</label>
              <Form.Control
                type="text"
                name="carreraProfesion"
                placeholder="Ej: Estudiante de música"
                value={miembro.carreraProfesion}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>

            <div className="mitad">
              <label>Instrumento Musical</label>
              <Form.Control
                type="text"
                name="instrumentoMusical"
                placeholder="Ej: Guitarra"
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>


          {/* Cuerda y Área */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>
                Cuerda <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <select
                  name="cuerda"
                  value={miembro.cuerda}
                  onChange={handleChange}
                  className={`abmc-select ${errores.cuerda ? "error" : ""}`}
                >
                  <option value="">Seleccionar cuerda</option>
                  {cuerdasDisponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre || c.name || c.descripcion || "—"}
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
              </div>
            </div>


            <div className="mitad">
              <label>Área</label>
              <div className="input-with-button">
                <Form.Select
                  name="area"
                  value={miembro.area}
                  onChange={handleChange}
                  className="abmc-select"
                >
                  <option value="">Seleccionar área</option>
                  {areasDisponibles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </Form.Select>

                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => navigate("/areas")}
                  title="Gestionar áreas"
                  type="button"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="acciones-form-miembro derecha">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={() => navigate("/miembros")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="abmc-btn abmc-btn-primary"
            >
              Agregar miembro
            </button>
          </div>
        </Form>
      </div >
    </main >
  );
}
