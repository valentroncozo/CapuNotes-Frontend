import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "@/styles/miembros.css";
import "@/styles/abmc.css";

import BackButton from "@/components/common/BackButton.jsx";
import GenericEditPopup from "@/components/abmc/GenericEditPopup";

import { cuerdasService } from "@/services/cuerdasService.js";
import { areasService } from "@/services/areasService.js";
import { miembrosService } from "@/services/miembrosService.js";

import { InputMask } from "@react-input/mask";

/* ============================================
   Helpers
============================================ */

const normalizarFechaBackend = (fecha) => {
  if (!fecha || fecha.length !== 10) return null;
  const [dd, mm, yyyy] = fecha.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

function validarEdadDDMMAAAA(fecha) {
  if (!fecha.includes("/")) return false;
  const [dia, mes, anio] = fecha.split("/");
  const nacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  if (
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }
  return edad >= 17;
}

/* ============================================
   COMPONENTE
============================================ */

export default function MiembrosAgregar() {
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

  // POPUPS
  const [showPopupCuerda, setShowPopupCuerda] = useState(false);
  const [showPopupArea, setShowPopupArea] = useState(false);

  /* === SCHEMAS === */
  const cuerdaSchema = [
    { key: "name", label: "Nombre", type: "text", required: true },
  ];

  const areaSchema = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "descripcion", label: "Descripción", type: "text", required: true },
  ];

  /* === Cargar cuerdas y áreas === */
  const cargarListas = async () => {
    try {
      const [cuerdas, areas] = await Promise.all([
        cuerdasService.list(),
        areasService.list(),
      ]);

      setCuerdasDisponibles(cuerdas);
      setAreasDisponibles(areas);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar listas",
        text: "No se pudieron cargar cuerdas y áreas.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  useEffect(() => {
    cargarListas();
  }, []);

  /* === Manejo de inputs === */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  /* === Validación === */
  const validarCampos = () => {
    const requeridos = [
      "nombre",
      "apellido",
      "tipoDocumento",
      "numeroDocumento",
      "cuerda",
    ];

    const nuevosErrores = {};
    requeridos.forEach((c) => {
      if (!miembro[c]?.toString().trim()) {
        nuevosErrores[c] = "Campo obligatorio";
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /* === Submit === */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completá todos los campos obligatorios.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }

    try {
      const payload = {
        id: {
          nroDocumento: miembro.numeroDocumento,
          tipoDocumento: miembro.tipoDocumento,
        },
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        fechaNacimiento: normalizarFechaBackend(miembro.fechaNacimiento),
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
        timer: 1600,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });

      navigate("/miembros", { state: { recargar: true } });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el miembro.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  /* ============================================
     RENDER
  ============================================ */

  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">

        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Registro de miembro</h1>
        </div>

        <p className="aviso-obligatorios alineado-derecha">
          Los campos marcados con <span className="required">*</span> son obligatorios.
        </p>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          <div className="form-grid-2cols">

            {/* === NOMBRE === */}
            <Form.Group className="form-group-miembro">
              <label>Nombre <span className="required">*</span></label>
              <Form.Control
                name="nombre"
                value={miembro.nombre}
                onChange={handleChange}
                className={`abmc-input ${errores.nombre ? "error" : ""}`}
              />
            </Form.Group>

            {/* === APELLIDO === */}
            <Form.Group className="form-group-miembro">
              <label>Apellido <span className="required">*</span></label>
              <Form.Control
                name="apellido"
                value={miembro.apellido}
                onChange={handleChange}
                className={`abmc-input ${errores.apellido ? "error" : ""}`}
              />
            </Form.Group>

            {/* === TIPO DOCUMENTO === */}
            <Form.Group className="form-group-miembro">
              <label>Tipo Documento <span className="required">*</span></label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className={`abmc-select ${errores.tipoDocumento ? "error" : ""}`}
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </Form.Group>

            {/* === NÚMERO DOCUMENTO === */}
            <Form.Group className="form-group-miembro">
              <label>Número Documento <span className="required">*</span></label>
              <Form.Control
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${errores.numeroDocumento ? "error" : ""}`}
              />
            </Form.Group>

            {/* === FECHA NAC === */}
            <Form.Group className="form-group-miembro">
              <label>Fecha Nacimiento</label>
              <InputMask
                mask="DD/DD/DDDD"
                replacement={{ D: /\d/ }}
                value={miembro.fechaNacimiento}
                placeholder="dd/mm/aaaa"
                className="abmc-input"
                onChange={(e) => {
                  const fecha = e.target.value;
                  setMiembro((prev) => ({ ...prev, fechaNacimiento: fecha }));
                  if (fecha.length === 10 && !validarEdadDDMMAAAA(fecha)) {
                    Swal.fire({
                      icon: "warning",
                      title: "Edad no válida",
                      text: "Debe tener al menos 17 años",
                      background: "#11103a",
                      color: "#E8EAED",
                    });
                    setMiembro((prev) => ({ ...prev, fechaNacimiento: "" }));
                  }
                }}
              />
            </Form.Group>

            {/* === LUGAR ORIGEN === */}
            <Form.Group className="form-group-miembro">
              <label>Lugar Origen</label>
              <Form.Control
                name="lugarOrigen"
                value={miembro.lugarOrigen}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            {/* === TELÉFONO === */}
            <Form.Group className="form-group-miembro">
              <label>Teléfono</label>
              <Form.Control
                name="telefono"
                value={miembro.telefono}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            {/* === CARRERA === */}
            <Form.Group className="form-group-miembro">
              <label>Carrera / Profesión</label>
              <Form.Control
                name="carreraProfesion"
                value={miembro.carreraProfesion}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            {/* === CORREO === */}
            <Form.Group className="form-group-miembro">
              <label>Correo</label>
              <Form.Control
                name="correo"
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            {/* === INSTRUMENTO === */}
            <Form.Group className="form-group-miembro">
              <label>Instrumento Musical</label>
              <Form.Control
                name="instrumentoMusical"
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                className="abmc-input"
              />
            </Form.Group>

            {/* === CUERDA === */}
            <Form.Group className="form-group-miembro">
              <label>Cuerda <span className="required">*</span></label>
              <div className="input-with-button">
                <Form.Select
                  name="cuerda"
                  value={miembro.cuerda}
                  onChange={handleChange}
                  className={`abmc-select ${errores.cuerda ? "error" : ""}`}
                >
                  <option value="">Seleccionar cuerda</option>
                  {cuerdasDisponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>

                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => setShowPopupCuerda(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                </Button>
              </div>
            </Form.Group>

            {/* === ÁREA === */}
            <Form.Group className="form-group-miembro">
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
                  onClick={() => setShowPopupArea(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                </Button>
              </div>
            </Form.Group>
          </div>

          {/* === ACCIONES === */}
          <div className="acciones-form-miembro derecha">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={() =>
                navigate("/miembros", { state: { recargar: true } })
              }
            >
              Cancelar
            </button>

            <button type="submit" className="abmc-btn abmc-btn-primary">
              Agregar miembro
            </button>
          </div>
        </Form>
      </div>

      {/* 🔶 POPUP CUERDA */}
      {showPopupCuerda && (
        <GenericEditPopup
          isOpen={showPopupCuerda}
          onClose={() => setShowPopupCuerda(false)}
          entityName="Cuerda"
          schema={cuerdaSchema}
          entity={{}}
          onSave={async (values) => {
            try {
              if (!values.name?.trim()) {
                return Swal.fire({
                  icon: "warning",
                  title: "Campo obligatorio",
                  text: "Debés completar el nombre de la cuerda.",
                  background: "#11103a",
                  color: "#E8EAED",
                });
              }

              await cuerdasService.create({ name: values.name });
              await cargarListas();

              Swal.fire({
                icon: "success",
                title: "Cuerda creada",
                text: "La cuerda se creó correctamente.",
                timer: 1500,
                showConfirmButton: false,
                background: "#11103a",
                color: "#E8EAED",
              });

              setShowPopupCuerda(false);
            } catch (err) {

              // === Detectar clave duplicada ===
              const mensaje = err.response?.data || "";

              const esDuplicado =
                mensaje.toLowerCase().includes("duplicate") ||
                mensaje.toLowerCase().includes("already exists") ||
                mensaje.toLowerCase().includes("unique constraint");

              if (esDuplicado) {
                return Swal.fire({
                  icon: "warning",
                  title: "Ya existe",
                  text: "Ese nombre de cuerda ya está registrado.",
                  background: "#11103a",
                  color: "#E8EAED",
                  confirmButtonColor: "#ffc107",
                });
              }

              // === ERROR GENÉRICO ===
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la cuerda.",
                background: "#11103a",
                color: "#E8EAED",
                confirmButtonColor: "#ffc107",
              });
            }
          }}

        />
      )}

      {/* 🔶 POPUP ÁREA */}
      {showPopupArea && (
        <GenericEditPopup
          isOpen={showPopupArea}
          onClose={() => setShowPopupArea(false)}
          entityName="Área"
          schema={areaSchema}
          entity={{}}
          onSave={async (values) => {
            try {
              // --- Validación ---
              if (!values.nombre?.trim() || !values.descripcion?.trim()) {
                return Swal.fire({
                  icon: "warning",
                  title: "Campos incompletos",
                  text: "Debés completar nombre y descripción.",
                  background: "#11103a",
                  color: "#E8EAED",
                  confirmButtonColor: "#ffc107",
                });
              }

              // --- Crear ---
              await areasService.create(values);
              await cargarListas();

              Swal.fire({
                icon: "success",
                title: "Área creada",
                text: "El área se creó correctamente.",
                background: "#11103a",
                color: "#E8EAED",
                timer: 1500,
                showConfirmButton: false,
              });

              setShowPopupArea(false);
            } catch (err) {
              const msg = (err.response?.data || "").toLowerCase();
              const duplicado =
                msg.includes("duplicate") ||
                msg.includes("already exists") ||
                msg.includes("unique constraint");

              if (duplicado) {
                return Swal.fire({
                  icon: "warning",
                  title: "Nombre duplicado",
                  text: "Ya existe un área con ese nombre.",
                  background: "#11103a",
                  color: "#E8EAED",
                  confirmButtonColor: "#ffc107",
                });
              }

              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el área.",
                background: "#11103a",
                color: "#E8EAED",
                confirmButtonColor: "#ffc107",
              });
            }
          }}
        />
      )}

    </main>
  );
}


