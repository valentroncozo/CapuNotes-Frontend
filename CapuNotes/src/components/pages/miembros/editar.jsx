import { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

import "@/styles/miembros.css";
import "@/styles/abmc.css";
import { areaSchema } from "@/schemas/areas";

import BackButton from "@/components/common/BackButton.jsx";
import GenericEditPopup from "@/components/abmc/GenericEditPopup";

import { cuerdasService } from "@/services/cuerdasService.js";
import { areasService } from "@/services/areasService.js";
import { miembrosService } from "@/services/miembrosService.js";
import { InputMask } from "@react-input/mask";
import { isoToDdMmYyyy } from "@/components/common/datetime.js";

/* ================= Helpers ================= */

const soloLetras = (t) =>
  /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]*$/.test(t);

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

/* ================= COMPONENTE ================= */

export default function MiembrosEditar() {
  const navigate = useNavigate();
  const location = useLocation();

  const formRef = useRef(null); // ⬅️ AGREGADO

  const miembroInicial = location.state?.miembro;
  const soloVer = location.state?.soloVer === true;

  const docViejo = {
    nro: miembroInicial?.nroDocumento,
    tipo: miembroInicial?.tipoDocumento,
  };

  const [miembro, setMiembro] = useState({
    nombre: miembroInicial?.nombre || "",
    apellido: miembroInicial?.apellido || "",
    tipoDocumento: miembroInicial?.tipoDocumento || "",
    numeroDocumento: miembroInicial?.nroDocumento || "",

    fechaNacimiento: miembroInicial?.fechaNacimiento
      ? isoToDdMmYyyy(miembroInicial.fechaNacimiento)
      : "",

    telefono: miembroInicial?.nroTelefono || "",
    correo: miembroInicial?.correo || "",
    carreraProfesion: miembroInicial?.carreraProfesion || "",
    lugarOrigen: miembroInicial?.lugarOrigen || "",
    instrumentoMusical: miembroInicial?.instrumentoMusical || "",

    cuerda: miembroInicial?.idCuerda || "",
    area: miembroInicial?.idArea || "",
  });

  const [errores, setErrores] = useState({});
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  const [showPopupCuerda, setShowPopupCuerda] = useState(false);
  const [showPopupArea, setShowPopupArea] = useState(false);

  /* ==================== CARGAR LISTAS ==================== */

  const cargarListas = async () => {
    try {
      const [cuerdas, areas] = await Promise.all([
        cuerdasService.list(),
        areasService.list(),
      ]);

      setCuerdasDisponibles(
        cuerdas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
      );

      setAreasDisponibles(
        areas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
      );
    } catch (err) {
      console.error("Error cargando listas", err);
    }
  };

  useEffect(() => {
    cargarListas();
  }, []);

  /* =================== HANDLE INPUT =================== */

  const handleChange = (e) => {
    if (soloVer) return;

    const { name, value } = e.target;

    const noTrim = ["numeroDocumento", "cuerda", "area"];

    setMiembro((prev) => ({
      ...prev,
      [name]: noTrim.includes(name) ? value : value.trim(),
    }));

    if (!value || value === "") {
      setErrores((prev) => ({ ...prev, [name]: "Campo obligatorio" }));
    } else {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* =================== VALIDAR =================== */

  const validarCampos = () => {
    if (soloVer) return true;

    const nuevos = {};

    ["nombre", "apellido", "tipoDocumento", "numeroDocumento", "cuerda"].forEach(
      (c) => {
        if (!miembro[c]) nuevos[c] = "Campo obligatorio";
      }
    );

    if (miembro.fechaNacimiento && miembro.fechaNacimiento.length === 10) {
      if (!validarEdadDDMMAAAA(miembro.fechaNacimiento)) {
        nuevos.fechaNacimiento = "Debe tener al menos 17 años.";
      }
    }

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      return false;
    }

    return true;
  };

  /* =================== SUBMIT =================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {

      const primerError = formRef.current.querySelector(".error");

      if (primerError) {
        const contenedor = document.getElementById("root");

        const rect = primerError.getBoundingClientRect();
        const offset = rect.top + contenedor.scrollTop - window.innerHeight / 3;

        contenedor.scrollTo({
          top: offset,
          behavior: "smooth"
        });

        primerError.focus({ preventScroll: true });
      }

      // ahora sí mostrar el Swal
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

        activo: miembroInicial?.activo ?? true,

        idCuerda: miembro.cuerda ? parseInt(miembro.cuerda) : miembroInicial.idCuerda,
        idArea: miembro.area ? parseInt(miembro.area) : null,
      };

      await miembrosService.update(
        docViejo.nro,
        docViejo.tipo,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        timer: 1200,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });

      navigate("/miembros", { state: { recargar: true } });
    } catch (err) {
      console.error("Error actualizando:", err);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err.response?.data || "Revisá los datos.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  /* =================== UI =================== */

  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">
            {soloVer ? "Ver miembro" : "Editar miembro"}
          </h1>
        </div>

        {!soloVer && (
          <p className="aviso-obligatorios alineado-derecha">
            Los campos marcados con <span className="required">*</span> son obligatorios.
          </p>
        )}

        {/* ⬅️ Formulario con ref */}
        <Form ref={formRef} onSubmit={handleSubmit} className="abmc-topbar">
          <div className="form-grid-2cols">
            {/* ---------------- Campos personales ---------------- */}

            <Form.Group className="form-group-miembro">
              <label>
                Nombre <span className="required">*</span>
              </label>
              <Form.Control
                name="nombre"
                value={miembro.nombre}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.nombre ? "error" : ""}`}
              />
              {errores.nombre && (
                <p className="input-hint">{errores.nombre}</p>
              )}
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>
                Apellido <span className="required">*</span>
              </label>
              <Form.Control
                name="apellido"
                value={miembro.apellido}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.apellido ? "error" : ""}`}
              />
              {errores.apellido && (
                <p className="input-hint">{errores.apellido}</p>
              )}
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>
                Tipo Documento <span className="required">*</span>
              </label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-select ${errores.tipoDocumento ? "error" : ""
                  }`}
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

            <Form.Group className="form-group-miembro">
              <label>
                Número Documento <span className="required">*</span>
              </label>
              <Form.Control
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.numeroDocumento ? "error" : ""
                  }`}
              />
              {errores.numeroDocumento && (
                <p className="input-hint">{errores.numeroDocumento}</p>
              )}
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Fecha Nacimiento</label>
              <InputMask
                mask="DD/DD/DDDD"
                replacement={{ D: /\d/ }}
                value={miembro.fechaNacimiento}
                onChange={(e) =>
                  setMiembro((p) => ({
                    ...p,
                    fechaNacimiento: e.target.value,
                  }))
                }
                disabled={soloVer}
                className={`abmc-input ${errores.fechaNacimiento ? "error" : ""
                  }`}
              />
              {errores.fechaNacimiento && (
                <p className="input-hint">{errores.fechaNacimiento}</p>
              )}
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Lugar Origen</label>
              <Form.Control
                name="lugarOrigen"
                value={miembro.lugarOrigen}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.lugarOrigen ? "error" : ""
                  }`}
              />
              {errores.lugarOrigen && (
                <p className="input-hint">{errores.lugarOrigen}</p>
              )}
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Teléfono</label>
              <Form.Control
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
                name="carreraProfesion"
                value={miembro.carreraProfesion}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.carreraProfesion ? "error" : ""
                  }`}
              />
              {errores.carreraProfesion && (
                <p className="input-hint">{errores.carreraProfesion}</p>
              )}
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
                name="instrumentoMusical"
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                disabled={soloVer}
                className={`abmc-input ${errores.instrumentoMusical ? "error" : ""
                  }`}
              />
              {errores.instrumentoMusical && (
                <p className="input-hint">{errores.instrumentoMusical}</p>
              )}
            </Form.Group>

            {/* ---------------- CUERDA ---------------- */}

            <Form.Group className="form-group-miembro">
              <label>
                Cuerda <span className="required">*</span>
              </label>
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
                      {c.nombre}
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
              {errores.cuerda && (
                <p className="input-hint">{errores.cuerda}</p>
              )}
            </Form.Group>

            {/* ---------------- ÁREA ---------------- */}

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
              const nueva = await cuerdasService.create({
                nombre: values.name,
              });

              await cargarListas();
              setMiembro((prev) => ({ ...prev, cuerda: nueva.id }));

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
              const msg = String(err.response?.data || "");

              if (msg.startsWith("Ya existe una cuerda")) {
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
              if (!values.nombre?.trim() || !values.descripcion?.trim()) {
                return Swal.fire({
                  icon: "warning",
                  title: "Campos incompletos",
                  text: "Debés completar nombre y descripción.",
                  background: "#11103a",
                  color: "#E8EAED",
                });
              }

              const nueva = await areasService.create(values);

              await cargarListas();
              setMiembro((prev) => ({ ...prev, area: nueva.id }));

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

              if (msg.startsWith("Ya existe un área")) {
                return Swal.fire({
                  icon: "warning",
                  title: "Duplicado",
                  text: msg,
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

