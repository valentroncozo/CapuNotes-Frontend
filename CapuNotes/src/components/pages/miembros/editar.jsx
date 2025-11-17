import { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

import "@/styles/miembros.css";
import "@/styles/abmc.css";

import BackButton from "@/components/common/BackButton.jsx";
import GenericEditPopup from "@/components/abmc/GenericEditPopup";

import { cuerdasService } from "@/services/cuerdasService.js";
import { areasService } from "@/services/areasService.js";
import { miembrosService } from "@/services/miembrosService.js";
import { InputMask } from "@react-input/mask";

/* ====================== Helpers ====================== */

const formatearFechaVisual = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha;
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

const normalizarFechaBackend = (fecha) => {
  if (!fecha || fecha.length !== 10) return null;
  const [dd, mm, yyyy] = fecha.split('/');
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

/* ====================== COMPONENTE ====================== */

export default function MiembrosEditar({ title = "Editar miembro" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const miembroInicial = location.state?.miembro;
  const soloVer = location.state?.soloVer === true;

  const geoRef = useRef(null);

  const docViejo = {
    nro: miembroInicial?.id?.nroDocumento,
    tipo: miembroInicial?.id?.tipoDocumento,
  };

  const [miembro, setMiembro] = useState({
    nombre: miembroInicial?.nombre || "",
    apellido: miembroInicial?.apellido || "",
    tipoDocumento: miembroInicial?.id?.tipoDocumento || "",
    numeroDocumento: miembroInicial?.id?.nroDocumento || "",
    fechaNacimiento: formatearFechaVisual(miembroInicial?.fechaNacimiento),
    telefono: miembroInicial?.nroTelefono || "",
    correo: miembroInicial?.correo || "",
    carreraProfesion: miembroInicial?.carreraProfesion || "",
    lugarOrigen: miembroInicial?.lugarOrigen || "",
    instrumentoMusical: miembroInicial?.instrumentoMusical || "",
    cuerda: miembroInicial?.cuerda?.id || "",
    area: miembroInicial?.area?.id || "",
  });

  const [errores, setErrores] = useState({});
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  // POPUPS
  const [showPopupCuerda, setShowPopupCuerda] = useState(false);
  const [showPopupArea, setShowPopupArea] = useState(false);

  // SCHEMAS
  const cuerdaSchema = [
    { key: "name", label: "Nombre", type: "text", required: true },
  ];

  const areaSchema = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "descripcion", label: "Descripción", type: "text", required: true },
  ];

  /* === Cargar datos === */
  const cargarListas = async () => {
    try {
      const [cuerdas, areas] = await Promise.all([
        cuerdasService.list(),
        areasService.list(),
      ]);
      setCuerdasDisponibles(cuerdas);
      setAreasDisponibles(areas);
    } catch (error) {
      console.error("Error cargando cuerdas o áreas:", error);
    }
  };

  useEffect(() => {
    cargarListas();
  }, []);

  /* === Manejo de cambios === */
  const handleChange = (e) => {
    if (soloVer) return;
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  /* === Validación === */
  const validarCampos = () => {
    if (soloVer) return true;
    const requeridos = [
      'nombre',
      'apellido',
      'tipoDocumento',
      'numeroDocumento',
      'cuerda',
    ];
    const err = {};
    requeridos.forEach((campo) => {
      if (!miembro[campo]?.toString().trim()) {
        err[campo] = "Campo obligatorio";
      }
    });
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  /* === Guardar === */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soloVer) return;

    if (!validarCampos()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }

    try {
      const fechaBackend = convertirDDMMYYYYaMMDDYYYY(miembro.fechaNacimiento);
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
        activo: miembroInicial?.activo ?? true,
        cuerda: { id: parseInt(miembro.cuerda) },
        area: miembro.area ? { id: parseInt(miembro.area) } : null,
      };

      await miembrosService.update(docViejo.nro, docViejo.tipo, payload);

      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados',
        background: '#11103a',
        color: '#E8EAED',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/miembros", { state: { recargar: true } });
    } catch (error) {
      console.error('Error actualizando miembro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Revisá los datos.',
        background: '#11103a',
        color: '#E8EAED',
      });
    }
  };

  /* ====================== RENDER ====================== */

  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">

        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">
            {soloVer ? "Ver miembro" : "Editar miembro"}
          </h1>
        </div>

        <p className="aviso-obligatorios alineado-derecha">
          Los campos marcados con <span className="required">*</span> son obligatorios.
        </p>

        <Form onSubmit={handleSubmit} className="abmc-topbar">

          <div className="form-grid-2cols">

            {/* === CAMPOS === */}
            <Form.Group className="form-group-miembro">
              <label>Nombre *</label>
              <Form.Control
                type="text"
                name="nombre"
                value={miembro.nombre}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.nombre ? "error" : ""}`}
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Apellido *</label>
              <Form.Control
                type="text"
                name="apellido"
                value={miembro.apellido}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.apellido ? "error" : ""}`}
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Tipo Documento *</label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-select ${errores.tipoDocumento ? "error" : ""}`}
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Número Documento *</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.numeroDocumento ? "error" : ""}`}
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Fecha Nacimiento</label>
              <InputMask
                mask="DD/DD/DDDD"
                replacement={{ D: /\d/ }}
                value={miembro.fechaNacimiento}
                placeholder="dd/mm/aaaa"
                onChange={(e) => {
                  if (soloVer) return;
                  const fecha = e.target.value;

                  setMiembro((prev) => ({
                    ...prev,
                    fechaNacimiento: fecha,
                  }));

                  if (fecha.length === 10 && !validarEdadDDMMAAAA(fecha)) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Edad no válida',
                      text: 'Debe ser mayor de 17',
                      background: '#11103a',
                      color: '#E8EAED',
                    });

                    setMiembro((prev) => ({
                      ...prev,
                      fechaNacimiento: "",
                    }));
                  }
                }}
                disabled={soloVer}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Lugar Origen</label>
              <input
                type="text"
                className="abmc-input"
                value={miembro.lugarOrigen}
                onChange={(e) =>
                  setMiembro((prev) => ({
                    ...prev,
                    lugarOrigen: e.target.value,
                  }))
                }
                disabled={soloVer}
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                value={miembro.telefono}
                onChange={handleChange}
                disabled={soloVer}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Carrera / Profesión</label>
              <Form.Control
                type="text"
                name="carreraProfesion"
                value={miembro.carreraProfesion}
                onChange={handleChange}
                disabled={soloVer}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Correo</label>
              <Form.Control
                type="email"
                name="correo"
                value={miembro.correo}
                onChange={handleChange}
                disabled={soloVer}
                className="abmc-input"
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Instrumento Musical</label>
              <Form.Control
                type="text"
                name="instrumentoMusical"
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                disabled={soloVer}
                className="abmc-input"
              />
            </Form.Group>

            {/* === CUERDA === */}
            <Form.Group className="form-group-miembro">
              <label>Cuerda *</label>
              <div className="input-with-button">
                <Form.Select
                  name="cuerda"
                  value={miembro.cuerda}
                  onChange={handleChange}
                  disabled={soloVer}
                  className={`abmc-select ${errores.cuerda ? "error" : ""}`}
                >
                  <option value="">Seleccionar cuerda</option>
                  {cuerdasDisponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>

                {!soloVer && (
                  <Button
                    variant="warning"
                    className="abmc-btn"
                    onClick={() => setShowPopupCuerda(true)}
                  >
                    +
                  </Button>
                )}
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
                  disabled={soloVer}
                  className="abmc-select"
                >
                  <option value="">Seleccionar área</option>
                  {areasDisponibles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </Form.Select>

                {!soloVer && (
                  <Button
                    variant="warning"
                    className="abmc-btn"
                    onClick={() => setShowPopupArea(true)}
                  >
                    +
                  </Button>
                )}
              </div>
            </Form.Group>

          </div>

          {!soloVer && (
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
                Guardar cambios
              </button>
            </div>
          )}
        </Form>
      </div>

      {/* === POPUP CUERDA === */}
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
                timer: 1500,
                showConfirmButton: false,
                background: "#11103a",
                color: "#E8EAED",
              });

              setShowPopupCuerda(false);
            } catch (err) {
              const msg = (err.response?.data || "").toLowerCase();
              const duplicado =
                msg.includes("duplicate") ||
                msg.includes("already exists") ||
                msg.includes("unique");

              if (duplicado) {
                return Swal.fire({
                  icon: "warning",
                  title: "Ya existe",
                  text: "Ese nombre de cuerda ya está registrado.",
                  background: "#11103a",
                  color: "#E8EAED",
                });
              }

              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la cuerda.",
                background: "#11103a",
                color: "#E8EAED",
              });
            }
          }}
        />
      )}

      {/* === POPUP ÁREA === */}
      {showPopupArea && (
        <GenericEditPopup
          isOpen={showPopupArea}
          onClose={() => setShowPopupArea(false)}
          entityName="Área"
          schema={areaSchema}
          entity={{}}
          onSave={async (values) => {
            try {
              if (!values.nombre?.trim() || !values.descripcion?.trim()) {
                return Swal.fire({
                  icon: "warning",
                  title: "Campos incompletos",
                  text: "Debés completar nombre y descripción.",
                  background: "#11103a",
                  color: "#E8EAED",
                });
              }

              await areasService.create(values);
              await cargarListas();

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
              const msg = (err.response?.data || "").toLowerCase();
              const duplicado =
                msg.includes("duplicate") ||
                msg.includes("already exists") ||
                msg.includes("unique");

              if (duplicado) {
                return Swal.fire({
                  icon: "warning",
                  title: "Nombre duplicado",
                  text: "Ya existe un área con ese nombre.",
                  background: "#11103a",
                  color: "#E8EAED",
                });
              }

              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el área.",
                background: "#11103a",
                color: "#E8EAED",
              });
            }
          }}
        />
      )}

    </main>
  );
}
