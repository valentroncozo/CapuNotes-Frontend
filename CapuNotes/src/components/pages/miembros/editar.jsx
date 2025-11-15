import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import '@/styles/miembros.css';
import '@/styles/abmc.css';
import BackButton from '@/components/common/BackButton.jsx';
import { cuerdasService } from '@/services/cuerdasService.js';
import { areasService } from '@/services/areasService.js';
import { miembrosService } from '@/services/miembrosService.js';
import { InputMask } from '@react-input/mask';

/* ============================================================
   NORMALIZAR FECHA PARA EDITAR
   ============================================================ */

// yyyy-MM-dd → dd/MM/yyyy
const formatearFechaVisual = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha; // ya viene formateada

  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

// dd/MM/yyyy → yyyy-MM-dd
const normalizarFechaBackend = (fecha) => {
  if (!fecha || fecha.length !== 10) return null;
  const [dd, mm, yyyy] = fecha.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

/* ============================================================
   VALIDAR EDAD
   ============================================================ */
function validarEdadDDMMAAAA(fecha) {
  if (!fecha.includes('/')) return false;

  const [dia, mes, anio] = fecha.split('/');
  const nacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const cumpleEsteAño =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() >= nacimiento.getDate());

  if (!cumpleEsteAño) edad -= 1;

  return edad >= 17;
}

export default function MiembrosEditar({ title = "Editar miembro" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const miembroInicial = location.state?.miembro;

  // Documento original
  const docViejo = {
    nro: miembroInicial?.id?.nroDocumento,
    tipo: miembroInicial?.id?.tipoDocumento,
  };

  /* ============================================================
     ESTADO INICIAL DEL FORMULARIO
     ============================================================ */
  const [miembro, setMiembro] = useState(() => ({
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
  }));

  const [errores, setErrores] = useState({});
  const [cuerdasDisponibles, setCuerdasDisponibles] = useState([]);
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  /* ============================================================
     CARGAR CUERDAS Y ÁREAS
     ============================================================ */
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
      }
    };
    fetchData();
  }, []);

  /* ============================================================
     MANEJO CAMBIOS
     ============================================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMiembro((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  /* ============================================================
     VALIDACIÓN
     ============================================================ */
  const validarCampos = () => {
    const requeridos = [
      "nombre",
      "apellido",
      "tipoDocumento",
      "numeroDocumento",
      "cuerda",
    ];

    const nuevosErrores = {};
    requeridos.forEach((campo) => {
      if (!miembro[campo] || miembro[campo].toString().trim() === "") {
        nuevosErrores[campo] = "Campo obligatorio";
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /* ============================================================
     SUBMIT
     ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        background: "#11103a",
        color: "#E8EAED",
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
        icon: "success",
        title: "Cambios guardados",
        background: "#11103a",
        color: "#E8EAED",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/miembros");
    } catch (error) {
      console.error("Error actualizando miembro:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Revisá los datos.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  /* ============================================================
     RENDER DEL FORMULARIO
     ============================================================ */
  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
        </div>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          {/* === Nombre === */}
          <Form.Group className="form-group-miembro">
            <label>Nombre *</label>
            <Form.Control
              type="text"
              name="nombre"
              value={miembro.nombre}
              onChange={handleChange}
              className={`abmc-input ${errores.nombre ? "error" : ""}`}
            />
          </Form.Group>

          {/* === Apellido === */}
          <Form.Group className="form-group-miembro">
            <label>Apellido *</label>
            <Form.Control
              type="text"
              name="apellido"
              value={miembro.apellido}
              onChange={handleChange}
              className={`abmc-input ${errores.apellido ? "error" : ""}`}
            />
          </Form.Group>

          {/* === Documento === */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Tipo Documento *</label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className={`abmc-select ${
                  errores.tipoDocumento ? "error" : ""
                }`}
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </div>

            <div className="mitad">
              <label>Número Documento *</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${
                  errores.numeroDocumento ? "error" : ""
                }`}
              />
            </div>
          </div>

          {/* === Fecha nacimiento === */}
          <div className="form-row-miembros">
            <div className="mitad">
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
                      text: "Debe ser mayor de 17",
                      background: "#11103a",
                      color: "#E8EAED",
                    });
                    setMiembro((prev) => ({ ...prev, fechaNacimiento: "" }));
                  }
                }}
              />
            </div>

            {/* === Lugar origen === */}
            <div className="mitad">
              <label>Lugar Origen</label>
              <GeoapifyContext apiKey="27d4d3c8bf5147f3ae4cd2f98a44009a">
                <GeoapifyGeocoderAutocomplete
                  placeholder="Ej: Córdoba, Argentina"
                  type="city"
                  value={miembro.lugarOrigen}
                  onChange={(value) => {
                    setMiembro((prev) => ({
                      ...prev,
                      lugarOrigen: value?.formatted || "",
                    }));
                  }}
                  lang="es"
                  limit={8}
                  className="abmc-input geoapify-wrapper"
                />
              </GeoapifyContext>
            </div>
          </div>

          {/* === Teléfono y correo === */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
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
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* === Profesión y instrumento === */}
          <div className="form-row-miembros">
            <div className="mitad">
              <label>Carrera / Profesión</label>
              <Form.Control
                type="text"
                name="carreraProfesion"
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
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                className="abmc-input"
              />
            </div>
          </div>

          {/* === Cuerda y área === */}
          <div className="form-row-cuerda-area">
            <div className="mitad">
              <label>Cuerda *</label>
              <select
                name="cuerda"
                value={miembro.cuerda}
                onChange={handleChange}
                className={`abmc-select ${errores.cuerda ? "error" : ""}`}
              >
                <option value="">Seleccionar cuerda</option>
                {cuerdasDisponibles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mitad">
              <label>Área</label>
              <select
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
              </select>
            </div>
          </div>

          <div className="acciones-form-miembro derecha">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={() => navigate("/miembros")}
            >
              Cancelar
            </button>
            <button type="submit" className="abmc-btn abmc-btn-primary">
              Guardar cambios
            </button>
          </div>

        </Form>
      </div>
    </main>
  );
}
