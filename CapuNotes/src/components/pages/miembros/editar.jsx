import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import "@/styles/libreriaGeo.css";
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

/* ====================== Helpers ====================== */

const formatearFechaVisual = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha;
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

const normalizarFechaBackend = (fecha) => {
  if (!fecha || fecha.length !== 10) return null;
  const [dd, mm, yyyy] = fecha.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

function validarEdadDDMMAAAA(fecha) {
  if (!fecha.includes('/')) return false;
  const [dia, mes, anio] = fecha.split('/');
  const nacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  if (
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())
  ) edad--;
  return edad >= 17;
}

/* ====================== COMPONENTE ====================== */

export default function MiembrosEditar({ title = "Editar miembro" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const miembroInicial = location.state?.miembro;

  // 👉 FLAG PARA SABER SI ES SOLO VER
  const soloVer = location.state?.soloVer === true;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!soloVer) {
      setMiembro((prev) => ({ ...prev, [name]: value }));
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validarCampos = () => {
    if (soloVer) return true;
    const requeridos = ["nombre", "apellido", "tipoDocumento", "numeroDocumento", "cuerda"];
    const nuevosErrores = {};
    requeridos.forEach((c) => {
      if (!miembro[c]?.toString().trim()) {
        nuevosErrores[c] = "Campo obligatorio";
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soloVer) return;

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

      navigate("/miembros", { state: { recargar: true } });
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

  return (
    <main className="pantalla-miembros">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">
            {soloVer ? "Ver miembro" : "Editar miembro"}
          </h1>
        </div>

        <Form onSubmit={handleSubmit} className="abmc-topbar">
          <div className="form-grid-2cols">

            {/* ====== TODOS LOS INPUTS CON disabled={soloVer} ====== */}

            <Form.Group className="form-group-miembro">
              <label>Nombre *</label>
              <Form.Control
                type="text"
                name="nombre"
                value={miembro.nombre}
                onChange={handleChange}
                className={`abmc-input ${errores.nombre ? "error" : ""}`}
                disabled={soloVer}
              />
            </Form.Group>

            <Form.Group className="form-group-miembro">
              <label>Apellido *</label>
              <Form.Control
                type="text"
                name="apellido"
                value={miembro.apellido}
                onChange={handleChange}
                className={`abmc-input ${errores.apellido ? "error" : ""}`}
                disabled={soloVer}
              />
            </Form.Group>

            <div className="form-group-miembro">
              <label>Tipo Documento *</label>
              <Form.Select
                name="tipoDocumento"
                value={miembro.tipoDocumento}
                onChange={handleChange}
                className={`abmc-select ${errores.tipoDocumento ? "error" : ""}`}
                disabled={soloVer}
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Libreta Cívica">Libreta Cívica</option>
              </Form.Select>
            </div>

            <div className="form-group-miembro">
              <label>Número Documento *</label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={miembro.numeroDocumento}
                onChange={handleChange}
                className={`abmc-input ${errores.numeroDocumento ? "error" : ""}`}
                disabled={soloVer}
              />
            </div>

            <div className="form-group-miembro">
              <label>Fecha Nacimiento</label>
              <InputMask
                mask="DD/DD/DDDD"
                replacement={{ D: /\d/ }}
                value={miembro.fechaNacimiento}
                placeholder="dd/mm/aaaa"
                className="abmc-input"
                disabled={soloVer}
                onChange={(e) => {
                  if (soloVer) return;
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

            <div className="form-group-miembro">
              <label>Lugar Origen</label>

              <div className={soloVer ? "solo-ver-geo" : ""}>
                <GeoapifyContext apiKey="27d4d3c8bf5147f3ae4cd2f98a44009a">
                  <div className="geoapify-wrapper">
                    <GeoapifyGeocoderAutocomplete
                      placeholder="Ej: Córdoba, Argentina"
                      type="city"
                      lang="es"
                      limit={8}
                      className="geoapify-autocomplete"
                      countryCodes={['ar']}
                      debounceDelay={300}
                      onPlaceSelect={(feature) => {
                        if (soloVer) return;
                        const p = feature?.properties;
                        if (!p) return;

                        const formatted =
                          p.formatted ||
                          p.formatted_address ||
                          [p.city || p.town || p.village, p.state, p.country]
                            .filter(Boolean)
                            .join(", ");

                        setMiembro((prev) => ({
                          ...prev,
                          lugarOrigen: formatted || "",
                        }));
                      }}
                    />
                  </div>
                </GeoapifyContext>
              </div>
            </div>

            <div className="form-group-miembro">
              <label>Teléfono</label>
              <Form.Control
                type="text"
                name="telefono"
                value={miembro.telefono}
                onChange={handleChange}
                className="abmc-input"
                disabled={soloVer}
              />
            </div>

            <div className="form-group-miembro">
              <label>Carrera / Profesión</label>
              <Form.Control
                type="text"
                name="carreraProfesion"
                value={miembro.carreraProfesion}
                onChange={handleChange}
                className="abmc-input"
                disabled={soloVer}
              />
            </div>

            <div className="form-group-miembro">
              <label>Correo</label>
              <Form.Control
                type="email"
                name="correo"
                value={miembro.correo}
                onChange={handleChange}
                className="abmc-input"
                disabled={soloVer}
              />
            </div>

            <div className="form-group-miembro">
              <label>Instrumento Musical</label>
              <Form.Control
                type="text"
                name="instrumentoMusical"
                value={miembro.instrumentoMusical}
                onChange={handleChange}
                className="abmc-input"
                disabled={soloVer}
              />
            </div>

            <div className="form-group-miembro">
              <label>Cuerda *</label>
              <select
                name="cuerda"
                value={miembro.cuerda}
                onChange={handleChange}
                className={`abmc-select ${errores.cuerda ? "error" : ""}`}
                disabled={soloVer}
              >
                <option value="">Seleccionar cuerda</option>
                {cuerdasDisponibles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-miembro">
              <label>Área</label>
              <select
                name="area"
                value={miembro.area}
                onChange={handleChange}
                className="abmc-select"
                disabled={soloVer}
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

          {/* === Botones === */}
          {!soloVer && (
            <div className="acciones-form-miembro derecha">
              <button
                type="button"
                className="abmc-btn abmc-btn-secondary"
                onClick={() => navigate("/miembros", { state: { recargar: true } })}
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
    </main>
  );
}
