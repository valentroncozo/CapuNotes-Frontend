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
import { formatearFechaDdMmAIso } from "@/components/common/datetime.js";
import { useRef } from "react";


/* ============================
   Helpers
============================ */

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
  )
    edad--;
  return edad >= 17;
}

const soloLetras = (str) => /^[A-Za-zÀ-ÿ\s]+$/.test(str);

/* ============================
   COMPONENTE
============================ */

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

  const [showPopupCuerda, setShowPopupCuerda] = useState(false);
  const [showPopupArea, setShowPopupArea] = useState(false);

  const cuerdaSchema = [
    { key: "name", label: "Nombre", type: "text", required: true },
  ];

  const areaSchema = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "descripcion", label: "Descripción", type: "text", required: true },
  ];

  /* ============================
     Cargar listas
  ============================ */

  const cargarListas = async () => {
    try {
      const [cuerdas, areas] = await Promise.all([
        cuerdasService.list(),
        areasService.list(),
      ]);

      setCuerdasDisponibles(
        [...cuerdas].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        )
      );

      setAreasDisponibles(
        [...areas].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        )
      );
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

  /* ============================
     Manejo de inputs
  ============================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));

    if (
      ["nombre", "apellido", "carreraProfesion", "instrumentoMusical"].includes(
        name
      )
    ) {
      if (value.trim() !== "" && !soloLetras(value)) {
        setErrores((prev) => ({
          ...prev,
          [name]: "No se admiten caracteres especiales o números.",
        }));
      }
    }
  };

  /* ============================
     VALIDACIÓN FINAL
  ============================ */

  const validarCampos = () => {
    const nuevosErrores = {};

    // Obligatorios
    if (!miembro.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!miembro.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!miembro.tipoDocumento) nuevosErrores.tipoDocumento = "Debe seleccionar un tipo.";
    if (!miembro.numeroDocumento.trim()) nuevosErrores.numeroDocumento = "Debe ingresar un número.";
    if (!miembro.cuerda) nuevosErrores.cuerda = "Debe seleccionar una cuerda.";

    // Letras válidas
    ["nombre", "apellido", "carreraProfesion", "instrumentoMusical"].forEach((f) => {
      if (miembro[f] && !soloLetras(miembro[f])) {
        nuevosErrores[f] = "Solo se permiten letras.";
      }
    });

    // Fecha válida
    if (miembro.fechaNacimiento && miembro.fechaNacimiento.length === 10) {
      if (!validarEdadDDMMAAAA(miembro.fechaNacimiento)) {
        nuevosErrores.fechaNacimiento = "Debe tener al menos 17 años.";
      }
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return false;
    }

    return true;
  };
  /* ============================
     SUBMIT
  ============================ */

  const formRef = useRef(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ejecutamos validación
    if (!validarCampos()) {
      const primerError = formRef.current.querySelector(".error");

      if (primerError) {
        // El contenedor real que scrollea es #root (igual que en Editar)
        const contenedor = document.getElementById("root");

        const rect = primerError.getBoundingClientRect();
        const offset = rect.top + contenedor.scrollTop - window.innerHeight / 3;

        contenedor.scrollTo({
          top: offset,
          behavior: "smooth",
        });

        primerError.focus({ preventScroll: true });
      }

      // MOSTRAR el swal DESPUÉS del scroll
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Revisá los campos obligatorios.",
        background: "#11103a",
        color: "#E8EAED",
        timer: 1500,
        showConfirmButton: false,
      });

      return;
    }

    // === LÓGICA DE GUARDADO (La tuya, igual que antes) ===

    try {
      const payload = {
        tipoDocumento: miembro.tipoDocumento,
        nroDocumento: miembro.numeroDocumento,
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        fechaNacimiento: normalizarFechaBackend(miembro.fechaNacimiento),
        correo: miembro.correo || null,
        nroTelefono: miembro.telefono || null,
        carreraProfesion: miembro.carreraProfesion || null,
        lugarOrigen: miembro.lugarOrigen || null,
        instrumentoMusical: miembro.instrumentoMusical || null,
        idCuerda: parseInt(miembro.cuerda),
        idArea: miembro.area ? parseInt(miembro.area) : null,
        activo: true,
      };

      await miembrosService.create(payload);

      Swal.fire({
        icon: "success",
        title: "Miembro registrado",
        timer: 1200,
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


  /* ============================
     RENDER
  ============================ */

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

        <Form ref={formRef} onSubmit={handleSubmit} className="abmc-topbar">

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
              {errores.nombre && <p className="input-hint">{errores.nombre}</p>}
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
              {errores.apellido && <p className="input-hint">{errores.apellido}</p>}
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
              {errores.tipoDocumento && (
                <p className="input-hint">{errores.tipoDocumento}</p>
              )}
            </Form.Group>

            {/* === NUMERO DOCUMENTO === */}
            <Form.Group className="form-group-miembro">
              <label>Número Documento <span className="required">*</span></label>
              <Form.Control
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${errores.numeroDocumento ? "error" : ""}`}
              />
              {errores.numeroDocumento && (
                <p className="input-hint">{errores.numeroDocumento}</p>
              )}
            </Form.Group>

            {/* === FECHA NAC === */}
            <Form.Group className="form-group-miembro">
              <label>Fecha Nacimiento</label>
              <InputMask
                mask="DD/DD/DDDD"
                replacement={{ D: /\d/ }}
                value={miembro.fechaNacimiento}
                placeholder="dd/mm/aaaa"
                className={`abmc-input ${errores.fechaNacimiento ? "error" : ""}`}
                onChange={(e) => {
                  const fecha = e.target.value;
                  setMiembro((prev) => ({ ...prev, fechaNacimiento: fecha }));

                  if (fecha.length === 10 && !validarEdadDDMMAAAA(fecha)) {
                    setErrores((prev) => ({
                      ...prev,
                      fechaNacimiento: "Debe tener al menos 17 años.",
                    }));
                  } else {
                    setErrores((prev) => ({ ...prev, fechaNacimiento: "" }));
                  }
                }}
              />
              {errores.fechaNacimiento && (
                <p className="input-hint">{errores.fechaNacimiento}</p>
              )}
            </Form.Group>

            {/* === LUGAR ORIGEN === */}
            <Form.Group className="form-group-miembro">
              <label>Lugar Origen</label>
              <Form.Control
                name="lugarOrigen"
                value={miembro.lugarOrigen}
                onChange={handleChange}
                className={`abmc-input ${errores.lugarOrigen ? "error" : ""}`}
              />
              {errores.lugarOrigen && <p className="input-hint">{errores.lugarOrigen}</p>}
            </Form.Group>

            {/* === TELEFONO === */}
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
                className={`abmc-input ${errores.carreraProfesion ? "error" : ""}`}
              />
              {errores.carreraProfesion && (
                <p className="input-hint">{errores.carreraProfesion}</p>
              )}
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
                className={`abmc-input ${errores.instrumentoMusical ? "error" : ""}`}
              />
              {errores.instrumentoMusical && (
                <p className="input-hint">{errores.instrumentoMusical}</p>
              )}
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
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>

                <Button
                  variant="warning"
                  className="abmc-btn"
                  onClick={() => setShowPopupCuerda(true)}
                >
                  +
                </Button>
              </div>

              {errores.cuerda && <p className="input-hint">{errores.cuerda}</p>}
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
                  +
                </Button>
              </div>
            </Form.Group>

          </div>

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
      {/* Popup Cuerda */}
      {showPopupCuerda && (
        <GenericEditPopup
          isOpen={showPopupCuerda}
          onClose={() => setShowPopupCuerda(false)}
          entityName="Cuerda"
          schema={[{ key: "name", label: "Nombre", type: "text", required: true }]}
          entity={{}}
          onSave={async (values) => {
            try {
              // Crear cuerda
              const nueva = await cuerdasService.create({ nombre: values.name });

              // Recargar listas
              await cargarListas();

              // Seleccionar automáticamente la nueva cuerda
              setMiembro((prev) => ({
                ...prev,
                cuerda: nueva.id, // <--- ¡ACÁ!
              }));

              Swal.fire({
                icon: "success",
                title: "Cuerda creada",
                timer: 1500,
                showConfirmButton: false,
                background: "#11103a",
                color: "#E8EAED",
              });

              setShowPopupCuerda(false);
            } catch (err) {
              const msg = String(err.response?.data || "").trim();
              if (msg.startsWith("Ya existe una cuerda con ese nombre")) {
                return Swal.fire({
                  icon: "warning",
                  title: "Duplicado",
                  text: "Ya existe una cuerda con ese nombre",
                  background: "#11103a",
                  color: "#E8EAED",
                  confirmButtonColor: "#DE9205",
                  confirmButtonText: "Aceptar",
                });
              }
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la cuerda.",
                background: "#11103a",
                color: "#E8EAED",
                confirmButtonColor: "#DE9205",
                confirmButtonText: "Aceptar",
              });
            }
          }}
        />
      )}


      {/* POPUP ÁREA */}
      {showPopupArea && (
        <GenericEditPopup
          isOpen={showPopupArea}
          onClose={() => setShowPopupArea(false)}
          entityName="Área"
          schema={areaSchema}
          entity={{}}
          onSave={async (values) => {
            try {
              // Validación local (igual que antes)
              if (!values.nombre?.trim() || !values.descripcion?.trim()) {
                return Swal.fire({
                  icon: "warning",
                  title: "Campos incompletos",
                  text: "Debés completar nombre y descripción.",
                  background: "#11103a",
                  color: "#E8EAED",
                  confirmButtonColor: "#DE9205",
                  confirmButtonText: "Aceptar",
                });
              }

              // Crear el área (el backend devuelve el id)
              const nueva = await areasService.create(values);

              // Recargar lista de áreas
              await cargarListas();

              // Seleccionar automáticamente el área recién creada
              setMiembro((prev) => ({
                ...prev,
                area: nueva.id,
              }));

              Swal.fire({
                icon: "success",
                title: "Área creada",
                timer: 1500,
                showConfirmButton: false,
                background: "#11103a",
                color: "#E8EAED",
              });

              setShowPopupArea(false);
            } catch (err) {
              const msg = String(err.response?.data || "").trim();

              // 🔥 Detectar duplicado EXACTO del backend:
              // "Ya existe un área con el nombre 'Marketing'"
              if (msg.startsWith("Ya existe un área con el nombre")) {
                return Swal.fire({
                  icon: "warning",
                  title: "Duplicado",
                  text: "Ya existe dicha área",
                  background: "#11103a",
                  color: "#E8EAED",
                  confirmButtonColor: "#DE9205",
                  confirmButtonText: "Aceptar",
                });
              }

              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el área.",
                background: "#11103a",
                color: "#E8EAED",
                confirmButtonColor: "#DE9205",
                confirmButtonText: "Aceptar",
              });
            }
          }}
        />
      )}


    </main>
  );
}



