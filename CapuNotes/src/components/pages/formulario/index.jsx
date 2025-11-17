import { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { InputMask } from '@react-input/mask';

// 2️⃣ Importaciones de componentes internos
import BackButton from '../../common/BackButton.jsx';
import PreguntaTexto from './preguntas/preguntaTexto.jsx';
import PreguntaOpcion from './preguntas/preguntaOpcion.jsx';
import PreguntaMultiOpcion from './preguntas/preguntaMultiOpcion.jsx';

// 3️⃣ Importaciones de servicios / lógica
import AudicionService from '@/services/audicionService.js';
import inscripcionService from '@/services/incripcionService.js';

// 4️⃣ Importaciones de tus estilos personalizados (DEBE IR AL FINAL)
import '@/styles/abmc.css';
import '@/styles/formulario.css';
import { ca } from 'date-fns/locale';

const Formulario = ({ title = 'Inscripción a Audiciones CoroCapuchinos' }) => {
  // Estados para datos dinámicos
  const [audicionId, setAudicionId] = useState(null);
  const [audicion, setAudicion] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [respuestas, setRespuestas] = useState([]);
  const [candidato, setCandidato] = useState({
    nroDocumento: '',
    tipoDocumento: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    email: '',
    telefono: '',
    cuerda: '',
    carrera_profesion: '',
        lugar_origen: '', // Se mantiene para sincronizar con Geoapify
    instrumento_musical: '',
  });
  // Estado controlado para el input de lugar de origen
  const [lugarOrigenInput, setLugarOrigenInput] = useState('');

  // estado para filtrar turnos por día y seleccionar turno
  const [filterDia, setFilterDia] = useState('');
  const [selectedTurnoId, setSelectedTurnoId] = useState('');
  const [cancion, setCancion] = useState('');

  // Estado para manejar el componente DatePicker
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  // Cargar datos de la audición actual
  useEffect(() => {
    const loadEncuesta = async () => {
      try {
        setLoading(true);
        const audicion = await AudicionService.getActual();
        if (!audicion?.id) {
          Swal.fire({
            icon: 'warning',
            title: 'No hay audiciones activas',
            text: 'No se encontró una audición activa en este momento.',
            background: '#11103a',
            color: '#E8EAED',
          });
          return;
        }

        setAudicionId(audicion.id);
        setAudicion(audicion);
        const encuesta = await inscripcionService.getEncuesta(audicion.id);

        setPreguntas(encuesta.preguntas || []);
        setCuerdas(encuesta.cuerdas || []);
        setTurnos(encuesta.turnos || []);
      } catch (error) {
        console.error('Error cargando encuesta:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el formulario de inscripción.',
          background: '#11103a',
          color: '#E8EAED',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEncuesta();
  }, []);

  // Calcular días únicos de los turnos
  const dias = useMemo(() => {
    const fechasUnicas = new Set();
    turnos.forEach((t) => {
      if (t.fecha) fechasUnicas.add(t.fecha);
    });
    return Array.from(fechasUnicas).sort();
  }, [turnos]);

  const handleChange = (preguntaId, nuevoValor) => {
    setRespuestas((prevRespuestas) => {
      const existe = prevRespuestas.find(
        (res) => res.preguntaId === preguntaId
      );
      if (existe) {
        return prevRespuestas.map((res) =>
          res.preguntaId === preguntaId ? nuevoValor : res
        );
      }
      return [...prevRespuestas, nuevoValor];
    });
  };

  // cuando cambia el día resetear turno seleccionado
  useEffect(() => {
    setSelectedTurnoId('');
  }, [filterDia]);

  // turnos filtrados según filterDia (solo DISPONIBLES)
  const availableTurnos = useMemo(() => {
    const filtered = filterDia
      ? turnos.filter((t) => t.fecha === filterDia && t.estado === 'DISPONIBLE')
      : turnos.filter((t) => t.estado === 'DISPONIBLE');
    return filtered;
  }, [turnos, filterDia]);

  // build payload only on submit to avoid sync loops
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita que se recargue la página

    // ✅ Validar fecha de nacimiento (mínimo 18 años)
    if (!fechaNacimiento) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha de nacimiento faltante',
        text: 'Debes ingresar tu fecha de nacimiento.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false, // Desactiva el estilo por defecto
        customClass: {
          confirmButton: 'abmc-btn btn-primary', // Tu clase personalizada
        },
      });
      return;
    }

    const partes = fechaNacimiento.split('/');
    if (partes.length !== 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato inválido',
        text: 'Por favor ingresa la fecha con formato dd/mm/aaaa.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false, // Desactiva el estilo por defecto
        customClass: {
          confirmButton: 'abmc-btn btn-primary', // Tu clase personalizada
        },
      });
      return;
    }

    const [dia, mes, anio] = partes.map(Number);
    const fechaNacimientoDate = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    if (fechaNacimientoDate > hoy) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha inválida',
        text: 'La fecha de nacimiento no puede ser posterior al día de hoy.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false, // Desactiva el estilo por defecto
        customClass: {
          confirmButton: 'abmc-btn btn-primary', // Tu clase personalizada
        },
      });
      return;
    }

    const diferencia = hoy - fechaNacimientoDate;
    const edadEnAnios = diferencia / (1000 * 60 * 60 * 24 * 365.25);

    if (edadEnAnios < 17) {
      Swal.fire({
        icon: 'warning',
        title: 'Edad no válida',
        text: 'Debes tener al menos 17 años para poder registrarte.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false, // Desactiva el estilo por defecto
        customClass: {
          confirmButton: 'abmc-btn btn-primary', // Tu clase personalizada
        },
      });
      return;
    }

    if (!audicionId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró una audición activa.',
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }

    // validaciones básicas del candidato
    const missingFields = [];
    if (!candidato.nombre || String(candidato.nombre).trim() === '')
      missingFields.push('Nombre');
    if (!candidato.apellido || String(candidato.apellido).trim() === '')
      missingFields.push('Apellido');
    if (
      !candidato.tipoDocumento ||
      String(candidato.tipoDocumento).trim() === ''
    )
      missingFields.push('Tipo de documento');
    if (!candidato.nroDocumento || String(candidato.nroDocumento).trim() === '')
      missingFields.push('Nro de documento');
    if (
      !candidato.fechaNacimiento ||
      String(candidato.fechaNacimiento).trim() === ''
    )
      missingFields.push('Fecha de nacimiento');
    if (!candidato.email || String(candidato.email).trim() === '')
      missingFields.push('Email');
    if (!candidato.telefono || String(candidato.telefono).trim() === '')
      missingFields.push('Teléfono');
    if (!candidato.lugar_origen || String(candidato.lugar_origen).trim() === '')
      missingFields.push('Lugar de origen');

    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Complete los campos requeridos',
        html: missingFields.join('<br/>'),
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }

    // validar turno y canción
    if (selectedTurnoId === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Turno faltante',
        text: 'Seleccione un turno de audición.',
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }
    if (!cancion || String(cancion).trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Canción faltante',
        text: 'Ingrese la canción que va a interpretar.',
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }

    // 🔄 Convertir dd/mm/aaaa → yyyy-mm-dd (formato LocalDate que Spring SI acepta)
    let fechaNacimientoBackend = null;

    if (candidato.fechaNacimiento) {
      const [dd, mm, yyyy] = candidato.fechaNacimiento.split('/');
      if (dd && mm && yyyy) {
        fechaNacimientoBackend = `${yyyy}-${mm}-${dd}`;
      }
    }

    // validar preguntas obligatorias
    const requiredPreguntas = preguntas.filter((p) => p.obligatoria);
    const missingPreguntas = [];
    requiredPreguntas.forEach((p) => {
      const resp = respuestas.find((r) => r.preguntaId === p.id);
      if (!resp) {
        missingPreguntas.push(p.valor);
        return;
      }
      if (p.tipo === 'TEXTO') {
        if (!resp.valorTexto || String(resp.valorTexto).trim() === '')
          missingPreguntas.push(p.valor);
      } else if (p.tipo === 'OPCION') {
        if (
          resp.opcionSeleccionadaId == null ||
          resp.opcionSeleccionadaId === ''
        )
          missingPreguntas.push(p.valor);
      } else if (p.tipo === 'MULTIOPCION') {
        if (
          !Array.isArray(resp.opcionesSeleccionadasIds) ||
          resp.opcionesSeleccionadasIds.length === 0
        )
          missingPreguntas.push(p.valor);
      }
    });

    if (missingPreguntas.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Complete las preguntas obligatorias',
        html: missingPreguntas.join('<br/>'),
        background: '#11103a',
        color: '#E8EAED',
      });
      return;
    }

    const payload = {
      candidato: {
        ...candidato,
        fechaNacimiento: fechaNacimientoBackend,

        // 🔥 Campos opcionales vacíos → null
        email: candidato.email.trim() === '' ? null : candidato.email,
        cuerda: candidato.cuerda.trim() === '' ? null : candidato.cuerda,
        carrera_profesion:
          candidato.carrera_profesion.trim() === ''
            ? null
            : candidato.carrera_profesion,
        lugar_origen:
          candidato.lugar_origen.trim() === '' ? null : candidato.lugar_origen,
        instrumento_musical:
          candidato.instrumento_musical.trim() === ''
            ? null
            : candidato.instrumento_musical,
      },
      respuestas,
      turnoId: Number(selectedTurnoId),
      cancion,
    };

    console.log('Payload completo:', payload);

    try {
      // Enviar inscripción al backend
      await inscripcionService.enviarEncuesta(audicionId, payload);

      Swal.fire({
        icon: 'success',
        title: '¡Inscripción exitosa!',
        text: 'Tu inscripción ha sido registrada correctamente.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        // Limpiar formulario o redirigir
        window.location.reload();
      });
    } catch (error) {
      console.error('Error enviando inscripción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al inscribirse',
        text:
          error.message ||
          'No se pudo completar la inscripción. Por favor, intente nuevamente.',
        background: '#11103a',
        color: '#E8EAED',
      });
    }
  };

  return audicion && audicion.estado !== 'PUBLICADA' ? (
    <main className="encuesta-container">
      <div
        className="abmc-card"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>
          Las inscripciones para esta audición están cerradas en este momento.
        </p>
      </div>
    </main>
  ) : (
    <main className="encuesta-container">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className="abmc-title" style={{ marginBottom: '2rem' }}>
            {title}
          </h1>
        </header>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Cargando formulario...</p>
          </div>
        ) : (
          <form className="cuestionario-formulario">
            <section className="container-candidato">
              <h2>
                Datos Personales <span>* Campos obligatorios</span>{' '}
              </h2>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>
                    Nombre <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.nombre}
                    onChange={(e) =>
                      setCandidato({ ...candidato, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group-miembro">
                  <label>
                    Apellido <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.apellido}
                    onChange={(e) =>
                      setCandidato({ ...candidato, apellido: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>
                    Tipo de Documento{' '}
                    <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <select
                    className="abmc-select"
                    value={candidato.tipoDocumento}
                    onChange={(e) =>
                      setCandidato({
                        ...candidato,
                        tipoDocumento: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">-</option>
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group-miembro">
                  <label>
                    Nro de Documento{' '}
                    <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.nroDocumento}
                    onChange={(e) =>
                      setCandidato({
                        ...candidato,
                        nroDocumento: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>
                    Fecha de Nacimiento (dd/mm/aaaa){' '}
                    <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>

                  <InputMask
                    mask="99/99/9999"
                    replacement={{ 9: /\d/ }}
                    value={fechaNacimiento}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFechaNacimiento(value);
                      setCandidato({ ...candidato, fechaNacimiento: value });
                    }}
                    className="abmc-input"
                    placeholder="dd/mm/aaaa"
                    required
                  />
                </div>
                <div className="form-group-miembro">
                  <label>Lugar de Origen</label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.lugar_origen}
                    onChange={(e) =>
                      setCandidato({
                        ...candidato,
                        lugar_origen: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>
                    Email <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="abmc-input"
                    value={candidato.email}
                    onChange={(e) =>
                      setCandidato({ ...candidato, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group-miembro">
                  <label>
                    Teléfono <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.telefono}
                    onChange={(e) =>
                      setCandidato({ ...candidato, telefono: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>Carrera/Profesión</label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.carrera_profesion}
                    onChange={(e) =>
                      setCandidato({
                        ...candidato,
                        carrera_profesion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group-miembro">
                  <label>¿Sabes tocar algún instrumento musical?</label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={candidato.instrumento_musical}
                    onChange={(e) =>
                      setCandidato({
                        ...candidato,
                        instrumento_musical: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>¿Conoces tu rango vocal?</label>
                  <select
                    className="abmc-input"
                    value={candidato.cuerda}
                    onChange={(e) =>
                      setCandidato({ ...candidato, cuerda: e.target.value })
                    }
                  >
                    <option value="">-</option>
                    {cuerdas.map((cuerda) => (
                      <option key={cuerda.id} value={cuerda.name}>
                        {cuerda.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-miembro">
                  <label>
                    <strong>Canción</strong> que vas a interpretar en la
                    audición <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="abmc-input"
                    value={cancion}
                    onChange={(e) => setCancion(e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>
            <hr className="divider" />

            <section className="preguntas-container">
              <h2>Preguntas</h2>
              {preguntas.map((pregunta, index) =>
                pregunta.tipo === 'TEXTO' ? (
                  <PreguntaTexto
                    key={pregunta.id}
                    pregunta={pregunta}
                    index={index}
                    handleChange={handleChange}
                  />
                ) : pregunta.tipo === 'OPCION' ? (
                  <PreguntaOpcion
                    key={pregunta.id}
                    pregunta={pregunta}
                    index={index}
                    respuestas={respuestas}
                    handleChange={handleChange}
                  />
                ) : pregunta.tipo === 'MULTIOPCION' ? (
                  <PreguntaMultiOpcion
                    pregunta={pregunta}
                    key={pregunta.id}
                    index={index}
                    respuestas={respuestas}
                    handleChange={handleChange}
                  />
                ) : null
              )}
            </section>
            <hr className="divider" />
            <section className="container-turno">
              <h2>Seleccionar Turno de Audición </h2>
              <div className="mitad">
                <div className="form-group-miembro">
                  <label>
                    Día de Audición{' '}
                    <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <select
                    className="abmc-select"
                    value={filterDia}
                    onChange={(e) => setFilterDia(e.target.value)}
                    required
                  >
                    <option value="">-</option>
                    {dias.map((dia, index) => (
                      <option key={index} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group-miembro">
                  <label>
                    Horario de Audición{' '}
                    <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <select
                    className="abmc-select"
                    value={selectedTurnoId}
                    onChange={(e) => setSelectedTurnoId(e.target.value)}
                    required
                  >
                    <option value="">-</option>
                    {availableTurnos.map((turno) => (
                      <option key={turno.id} value={String(turno.id)}>
                        {turno.diaString} - {turno.horaInicio}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <button
              type="button"
              className="abmc-btn btn-primary"
              onClick={handleSubmit}
            >
              Inscribir
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Formulario;
