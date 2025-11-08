import '@/styles/abmc.css';
import '@/styles/formulario.css';
import BackButton from '../../common/BackButton.jsx';
import PreguntaTexto from './preguntas/preguntaTexto.jsx';
import PreguntaOpcion from './preguntas/preguntaOpcion.jsx';
import PreguntaMultiOpcion from './preguntas/preguntaMultiOpcion.jsx';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import AudicionService from '@/services/audicionService.js';
import preguntasService from '@/services/preguntasService.js';


export default function FormularioConsulta({ title = 'Consulta de Inscripción' }) {
  const { id: inscripcionIdParam } = useParams();
  const inscripcionId = inscripcionIdParam ?? null;
  const [audicionId, setAudicionId] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [candidato, setCandidato] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [seleccionTurno, setSeleccionTurno] = useState(null);
  const [cantidadAudiciones, setCantidadAudiciones] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

          
       if (inscripcionId) {
          const perfil = await AudicionService.getPerfilInscripcion(inscripcionId);
          console.log('Perfil de inscripción cargado:', perfil);
          setCantidadAudiciones(perfil?.cantidadAudiciones ?? null);
          setCandidato(perfil?.candidato ?? null);

          // normalizar respuestas: mapear sobre las preguntas de la encuesta
          const raw = perfil?.respuestas ?? [];

          // crear mapa de respuestas por id (usar preguntaId si existe) y por texto para buscar coincidencias
          const rawById = new Map();
          raw.forEach(r => {
            if (r?.preguntaId != null) rawById.set(String(r.preguntaId), r);
            if (r?.id != null) rawById.set(String(r.id), r);
          });

        // 2) encuesta (preguntas, turnos, cuerdas)
        const encuesta = await preguntasService.getFormulario(perfil.audicionId);
        console.log('Encuesta cargada:', encuesta);
          
        setPreguntas(encuesta || []);
        setTurnos(encuesta.turnos || []);
        setCuerdas(encuesta.cuerdas || []);

          const rawByText = new Map(raw.map(r => [String(r.pregunta ?? '').trim().toLowerCase(), r]));

          const normalized = (encuesta || []).map(p => {
            // buscar por id primero, luego por texto (valor)
            const keyId = String(p.id);
            const keyText = String(p.valor ?? '').trim().toLowerCase();
            const r = rawById.get(keyId) ?? rawByText.get(keyText) ?? null;
            if (!r) return null;
            return {
              preguntaId: p.id,
              valorTexto: r.respuesta ?? null,
              opcionSeleccionadaId: r.opcionSeleccionada?.id ?? null,
              opcionesSeleccionadasIds: Array.isArray(r.opcionesSeleccionadas)
                ? r.opcionesSeleccionadas.map(o => (o?.id ?? o))
                : []
            };
          }).filter(Boolean);

          // log para depurar respuestas que no se pudieron emparejar
          const unmatched = raw.filter(r => {
            const idMatch = normalized.some(n => String(n.preguntaId) === String(r.preguntaId) || String(n.preguntaId) === String(r.id));
            const textMatch = normalized.some(n => {
              const rawText = String(r.pregunta ?? '').trim().toLowerCase();
              const p = encuesta?.find(q => String(q.id) === String(n.preguntaId));
              return p && String(p.valor ?? '').trim().toLowerCase() === rawText;
            });
            return !idMatch && !textMatch;
          });
          if (unmatched.length) console.warn('Respuestas sin match en encuesta:', unmatched);

          setRespuestas(normalized);

          // normalizar turno si viene en perfil
          if (perfil?.turnoId) {
            const t = (encuesta.turnos || []).find(x => String(x.id) === String(perfil.turnoId));
            setSeleccionTurno(t ? `${t.diaString || t.fecha || ''} ${t.horaInicio || ''}` : null);
          } else if (perfil?.turnoDia || perfil?.turnoHora) {
            setSeleccionTurno(`${perfil.turnoDia ?? ''} ${perfil.turnoHora ?? ''}`.trim());
          }
        }
      } catch (err) {
        console.error('Error cargando consulta:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos. Revisa la consola.' });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [inscripcionId]);

  const lookupRespuesta = (preguntaId) => respuestas.find(r => String(r.preguntaId) === String(preguntaId)) ?? null;



  return (
    <main className="encuesta-container">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className='abmc-title'>{title}</h1>
        </header>
        <hr className='divider' />

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Cargando consulta...</p>
          </div>
        ) : (
          <form className='cuestionario-formulario' onSubmit={(e) => e.preventDefault()}>
            <section className='container-candidato'>
              <h2>Datos Personales   <span>Inscripciones anteriores: {Number(cantidadAudiciones)-1} </span></h2>
            
              <div className='mitad'>
                <div className='form-group-miembro'>
                  <label>Nombre</label>
                  <input type="text" className='abmc-input' value={candidato?.nombre ?? ''} disabled />
                </div>
                <div className='form-group-miembro'>
                  <label>Apellido</label>
                  <input type="text" className='abmc-input' value={candidato?.apellido ?? ''} disabled />
                </div>
              </div>

              <div className='mitad'>
                <div className='form-group-miembro'>
                  <label>Tipo de Documento</label>
                  <input type="text" className='abmc-input' value={candidato?.tipoDocumento ?? ''} disabled />
                </div>
                <div className='form-group-miembro'>
                  <label>Nro de Documento</label>
                  <input type="text" className='abmc-input' value={candidato?.nroDocumento ?? ''} disabled />
                </div>
              </div>

              <div className='mitad'>
                <div className='form-group-miembro'>
                  <label>Fecha de Nacimiento</label>
                  <input type="date" className='abmc-input' value={candidato?.fechaNacimiento ?? ''} disabled />
                </div>
                <div className='form-group-miembro'>
                  <label>Lugar de Origen</label>
                  <input type="text" className='abmc-input' value={candidato?.lugarOrigen ?? ''} disabled />
                </div>
              </div>

              <div className='mitad'>
                <div className='form-group-miembro'>
                  <label>Email</label>
                  <input type="email" className='abmc-input' value={candidato?.email ?? ''} disabled />
                </div>
                <div className='form-group-miembro'>
                  <label>Teléfono</label>
                  <input type="text" className='abmc-input' value={candidato?.telefono ?? ''} disabled />
                </div>
              </div>
            </section>

            <hr className='divider' />

            <section className='preguntas-container'>
              <h2>Preguntas</h2>
              {preguntas.map((pregunta) => {
                const resp = lookupRespuesta(pregunta.id);
                // reutilizar tus componentes pasando la respuesta y disabled
                if (pregunta.tipo === 'TEXTO') {
                  return <PreguntaTexto key={pregunta.id} pregunta={pregunta} res={resp} disabled={true} />;
                }
                if (pregunta.tipo === 'OPCION') {
                  return <PreguntaOpcion key={pregunta.id} pregunta={pregunta} res={resp} disabled={true} />;
                }
                if (pregunta.tipo === 'MULTIOPCION') {
                  return <PreguntaMultiOpcion key={pregunta.id} pregunta={pregunta} res={resp} disabled={true} />;
                }
                return null;
              })}
            </section>



          
          </form>
        )}
      </div>
    </main>
  );
}