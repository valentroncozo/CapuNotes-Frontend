import '@/styles/abmc.css';
import '@/styles/cuestionario.css';
import { useEffect, useMemo, useState } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import AudicionService from '@/services/audicionService.js';
import preguntasService from '@/services/preguntasService.js';
import Modal from '@/components/common/Modal.jsx'; // <-- uso del modal genérico existente
import TrashIcon from '@/assets/TrashIcon.jsx';
import EditIcon from '@/assets/EditIcon';


const tipos = [
  { value: 'TEXTO', label: 'Texto' },
  { value: 'OPCION', label: 'Opción' },
  { value: 'MULTIOPCION', label: 'Multiopción' },
];

function opcionToString(opt) {
  if (typeof opt === 'string') return opt;
  if (opt == null) return '';
  return opt.valor ?? opt.texto ?? opt.text ?? String(opt.id ?? JSON.stringify(opt));
}

function normalizeOption(o) {
  if (o == null) return o;
  if (typeof o === 'object') return { ...o, valor: String(o.valor ?? o.texto ?? o.text ?? (o.id != null ? o.id : '')) };
  return { valor: String(o) };
}

export default function CuestionarioConfigPage({ title = 'Configuración de cuestionario' }) {
  const [audicion, setAudicion] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [asignadas, setAsignadas] = useState(() => new Set());
  // estado inicial asegurando `activa: true`
  const [nuevo, setNuevo] = useState({ valor: '', tipo: 'TEXTO', obligatoria: true, activa: true, opciones: [] });

  // nuevo estado agregado para el input de nueva opción en el topbar
  const [nuevaOpcion, setNuevaOpcion] = useState('');

  // estados para edición en modal
  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editOpcionInput, setEditOpcionInput] = useState('');

  const assignedIds = useMemo(() => new Set(asignadas), [asignadas]);

  const load = async () => {
    const a = await AudicionService.getActual();
    setAudicion(a);
    const all = await preguntasService.list();
    // Normalizar estructura mínima para evitar undefined en render
    setPreguntas((all || []).map(p => ({
      ...p,
      opciones: Array.isArray(p.opciones) ? p.opciones.map(normalizeOption) : [],
      tipo: p.tipo ?? 'TEXTO'
    })));
    if (a?.id) {
      const form = await preguntasService.getFormulario(a.id);
      setAsignadas(new Set((form || []).map(p => p.id)));
    } else {
      setAsignadas(new Set());
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!nuevo.valor.trim()) return;

    // Asegurar que `activa` sea boolean y por defecto true
    const activa = nuevo.activa == null ? true : Boolean(nuevo.activa);

    // construir payload: backend espera lista de strings para opciones
    const createPayload = { 
      valor: nuevo.valor, 
      tipo: nuevo.tipo, 
      obligatoria: Boolean(nuevo.obligatoria), 
      activa: activa // <-- asegurar que se setea la propiedad aquí
    };

    if (nuevo.tipo === 'OPCION' || nuevo.tipo === 'MULTIOPCION') {
      createPayload.opciones = (nuevo.opciones || []).map(o => String(o?.valor ?? o)).filter(s => s !== '');
    }

    // DEBUG: mostrar JSON exacto que se enviará
    console.log('Creating pregunta with JSON payload:', JSON.stringify(createPayload));

    const saved = await preguntasService.create(createPayload);

    setPreguntas(prev => [{ 
      ...saved, 
      opciones: Array.isArray(saved.opciones) ? saved.opciones.map(normalizeOption) : []
    }, ...prev]);

    // reset explícito conservando activa:true
    setNuevo({ valor: '', tipo: 'TEXTO', activa: true, obligatoria: true, opciones: [] });
    setNuevaOpcion('');
  };

  const handleUpdate = async (p) => {
    // normalizar opciones a objetos internos
    const opcionesRaw = (Array.isArray(p.opciones) ? p.opciones : []).map(normalizeOption);

    // convertir a strings, trim, filtrar vacíos y eliminar duplicados (preservando orden)
    const opcionesStrings = opcionesRaw
      .map(o => String(o?.valor ?? o?.texto ?? o?.text ?? o?.id ?? ''))
      .map(s => s.trim())
      .filter(s => s !== '');

    const opcionesClean = opcionesStrings.filter((v, i, a) => a.indexOf(v) === i);
    if (opcionesStrings.length !== opcionesClean.length) {
      console.warn('Se eliminaron opciones duplicadas o vacías antes de enviar:', { before: opcionesStrings, after: opcionesClean });
    }

    // armar payload (enviar opciones solo si corresponde)
    const payload = { valor: p.valor, tipo: p.tipo, obligatoria: p.obligatoria };
    if (p.tipo === 'OPCION' || p.tipo === 'MULTIOPCION') {
      payload.opciones = opcionesClean;
    }

    // log claro del payload JSON enviado
    console.log('Updating pregunta payload (clean):', { id: p.id, payload });

    try {
      const updated = await preguntasService.update(p.id, payload);

      // normalizar respuesta y preservar mapping lo mejor posible
      const updatedOpciones = Array.isArray(updated.opciones) ? updated.opciones : opcionesRaw;
      const mergedOpciones = updatedOpciones.map((uo, idx) => {
        if (uo == null) return uo;
        if (typeof uo === 'object') return normalizeOption(uo);
        const found = opcionesRaw.find(or => {
          if (or == null) return false;
          if (typeof or === 'object' && or.id != null) return String(or.id) === String(uo);
          return String(or.valor ?? or) === String(uo);
        });
        if (found) return found;
        if (!isNaN(Number(uo)) && opcionesRaw.length === updatedOpciones.length) {
          const original = opcionesRaw[idx];
          const valor = opcionToString(original);
          return { id: uo, valor };
        }
        return { valor: String(uo) };
      });

      setPreguntas(prev => prev.map(x => x.id === p.id ? { ...updated, opciones: mergedOpciones } : x));
      return updated;
    } catch (err) {
      console.error('Error al actualizar pregunta (primera tentativa):', err);
      console.error('Response data:', err?.response?.data);

      // fallback: intentar enviar ids/valores originales pero usando las opciones limpiadas
      if (payload.opciones && payload.opciones.length) {
        try {
          const altOpciones = opcionesRaw.map(o => (o?.id ? String(o.id) : String(o.valor ?? o))).filter(s => s.trim() !== '');
          const altPayload = { valor: p.valor, tipo: p.tipo, obligatoria: p.obligatoria, opciones: altOpciones };
          console.log('Reintentando update con payload alternativo:', { id: p.id, altPayload });
          const updatedAlt = await preguntasService.update(p.id, altPayload);

          const updatedOpciones = Array.isArray(updatedAlt.opciones) ? updatedAlt.opciones : opcionesRaw;
          const mergedOpciones = updatedOpciones.map((uo, idx) => {
            if (uo == null) return uo;
            if (typeof uo === 'object') return normalizeOption(uo);
            const found = opcionesRaw.find(or => {
              if (or == null) return false;
              if (typeof or === 'object' && or.id != null) return String(or.id) === String(uo);
              return String(or.valor ?? or) === String(uo);
            });
            if (found) return found;
            if (!isNaN(Number(uo)) && opcionesRaw.length === updatedOpciones.length) {
              const original = opcionesRaw[idx];
              const valor = opcionToString(original);
              return { id: uo, valor };
            }
            return { valor: String(uo) };
          });

          setPreguntas(prev => prev.map(x => x.id === p.id ? { ...updatedAlt, opciones: mergedOpciones } : x));
          return updatedAlt;
        } catch (err2) {
          console.error('Fallback update también falló:', err2);
          console.error('Response data (fallback):', err2?.response?.data);
        }
      }

      throw err;
    }
  };

  // intento genérico y tolerante de borrado en el service (prueba distintas firmas)
  const callDeleteService = async (id) => {
    const methods = ['remove', 'delete', 'eliminar', 'deletePregunta', 'destroy', 'deleteById'];
    for (const m of methods) {
      if (typeof preguntasService[m] === 'function') {
        // intentar firmas comunes
        const attempts = [
          () => preguntasService[m](id),
          () => preguntasService[m]({ id }),
          () => preguntasService[m](id, { data: { id } }), // axios.delete(url, { data })
        ];
        for (const attempt of attempts) {
          try {
            return await attempt();
          } catch (err) {
            const status = err?.response?.status;
            if (status && status !== 400 && status !== 404) throw err;
            // otherwise continue to next attempt
          }
        }
        throw new Error(`No se pudo eliminar usando preguntasService.${m} (probadas firmas comunes).`);
      }
    }
    throw new Error('Método de eliminación no encontrado en preguntasService');
  };

  const handleDelete = async (id) => {
    try {
      await callDeleteService(id);
      setPreguntas(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error('Error eliminando pregunta:', err);
      if (err?.response) {
        console.error('Response status:', err.response.status, 'data:', err.response.data);
      }
      if (err?.response?.status === 404) {
        console.warn(`Pregunta ${id} no encontrada en servidor (404). Se elimina localmente.`);
        setPreguntas(prev => prev.filter(x => x.id !== id));
        return;
      }
      if (err?.response?.status === 400) {
        console.warn(`Bad Request (400) al eliminar pregunta ${id}. Revisa la firma del servicio o el payload en el backend.`);
        return;
      }
    }
  };

  const handleAsignar = async (id) => {
    if (!audicion?.id) return;
    if(!audicion?.estado !== 'BORRADOR') {
      Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pueden asignar preguntas a una audición que no está en estado Borrador.",
              background: "#11103a",
              color: "#E8EAED",
              confirmButtonColor: "#7c83ff",
            });
      return;
    }
    await preguntasService.asignarA_Audicion(audicion.id, [id]);
    setAsignadas(prev => new Set(prev).add(id));
  };

  const handleQuitar = async (id) => {
    if (!audicion?.id) return;
    if(!audicion?.estado !== 'BORRADOR') {
      Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pueden eliminar preguntas a una audición que no está en estado Borrador.",
              background: "#11103a",
              color: "#E8EAED",
              confirmButtonColor: "#7c83ff",
            });
      return;
    }
    await preguntasService.quitarDeAudicion(audicion.id, id);
    setAsignadas(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  // función agregada: agrega una opción al objeto "nuevo" (form de nueva pregunta)
  const handleAddOpcion = () => {
    const op = (nuevaOpcion || '').trim();
    if (!op) return;
    setNuevo(prev => ({ ...prev, opciones: [...(prev.opciones || []), { valor: op }] }));
    setNuevaOpcion('');
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
          <hr className="divisor-amarillo" />
        </header>

        <div className="abmc-topbar">
          <input className="abmc-input" placeholder="Nueva pregunta" value={nuevo.valor} onChange={(e) => setNuevo({ ...nuevo, valor: e.target.value })} />
          <select className="abmc-select" value={nuevo.tipo} onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}>
            {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button className="abmc-btn abmc-btn-primary" type="button" onClick={handleCreate}>Agregar pregunta</button>

          {nuevo.tipo === 'OPCION' || nuevo.tipo === 'MULTIOPCION' ? (
            <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
              <input className="abmc-input" placeholder="Nueva opción" value={nuevaOpcion} onChange={(e) => setNuevaOpcion(e.target.value)} />
              <button className="abmc-btn abmc-btn-primary" type="button" onClick={handleAddOpcion}>Agregar opción</button>
            </div>
          ) : null}

        </div>

        <div className="abmc-table-container">
          <table className="abmc-table abmc-table-rect">
            <thead className="abmc-thead">
              <tr>
                <th>Preguntas</th>
                <th>Tipo</th>
                <th>Opciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preguntas.map((p, idx) => {
                const isAsignada = assignedIds.has(p.id);
                return (
                  <tr key={p.id ?? `row-${idx}`} className="abmc-row">
                    <td>
                      <input className="abmc-input" value={p.valor || ''} onChange={(e) => setPreguntas(prev => prev.map(x => x.id === p.id ? { ...x, valor: e.target.value } : x))} />
                    </td>
                    <td>
                      <select className="abmc-select" value={p.tipo} onChange={(e) => setPreguntas(prev => prev.map(x => x.id === p.id ? { ...x, tipo: e.target.value } : x))}>
                        {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </td>
                    <td>
                      {(p.opciones || []).length > 0 ? (
                        <select className="abmc-select">
                          {(p.opciones || []).map((o, i) => {
                            const val = opcionToString(o);
                            return <option key={`${val}-${i}`} value={val}>{val}</option>;
                          })}
                        </select>
                      ) : (
                        <span style={{ color: '#888' }}>—</span>
                      )}
                    </td>

                    <td>
                      <div className="abmc-actions">
                        <button type="button" className="abmc-btn btn-secondary" onClick={() => {
                          // abrir modal con copia de la pregunta
                          setEditing({ ...p, opciones: Array.isArray(p.opciones) ? [...p.opciones] : [] });
                          setEditOpcionInput('');
                          setIsEditing(true);
                        }}><EditIcon /></button>
                        <button type="button" className="abmc-btn abmc-btn-danger" onClick={() => handleDelete(p.id)}> <TrashIcon /></button>
                        {isAsignada ? (
                          <button type="button" className="abmc-btn abmc-btn-danger" title="Quitar del cuestionario" onClick={() => handleQuitar(p.id)}>-</button>
                        ) : (
                          <button type="button" className="abmc-btn abmc-btn-primary" title="Añadir al cuestionario" onClick={() => handleAsignar(p.id)}>+</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal de edición — ahora usando Modal genérico */}
        {isEditing && editing ? (
          <Modal isOpen={isEditing} title="Editar pregunta" onClose={() => { setIsEditing(false); setEditing(null); }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="abmc-input" style={{ flex: 1 }} value={editing.valor || ''} onChange={(e) => setEditing(prev => ({ ...prev, valor: e.target.value }))} />
              <select className="abmc-select" value={editing.tipo} onChange={(e) => setEditing(prev => ({ ...prev, tipo: e.target.value }))}>
                {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong>Opciones</strong>
              {(editing.opciones || []).length > 0 ? (
                <ul style={{ paddingLeft: 18 }}>
                  {(editing.opciones || []).map((o, i) => (
                    <li key={i} style={{ marginBottom: 4, justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                      {opcionToString(o)}
                      <button type="button" className="abmc-btn abmc-btn-danger" style={{ marginLeft: 8 }} onClick={() => {
                        setEditing(prev => ({ ...prev, opciones: prev.opciones.filter((_, idx) => idx !== i) }));
                      }}><TrashIcon /></button>
                    </li>
                  ))}
                </ul>
              ) : <div style={{ color: '#888' }}>—</div>}
              {(editing.tipo === 'OPCION' || editing.tipo === 'MULTIOPCION') && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input className="abmc-input" placeholder="Nueva opción" value={editOpcionInput} onChange={(e) => setEditOpcionInput(e.target.value)} />
                  <button className="abmc-btn abmc-btn-primary" type="button" onClick={() => {
                    const v = (editOpcionInput || '').trim();
                    if (!v) return;
                    setEditing(prev => ({ ...prev, opciones: [...(prev.opciones || []), { valor: v }] }));
                    setEditOpcionInput('');
                  }}>Agregar opción</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="abmc-btn" type="button" onClick={() => { setIsEditing(false); setEditing(null); }}>Cancelar</button>
              <button className="abmc-btn abmc-btn-primary" type="button" onClick={async () => {
                if (!editing.valor || !editing.valor.trim()) return;
                try {
                  await handleUpdate(editing);
                  setIsEditing(false);
                  setEditing(null);
                } catch (err) {
                  console.error('No se pudo guardar la pregunta:', err);
                  // Mensaje simple al usuario (puedes usar Swal si lo importas)
                  alert('Error al guardar la pregunta. Revisa la consola para más detalles.');
                }
              }}>Guardar</button>
            </div>
          </Modal>
        ) : null}
      </div>
    </main>
  );
}

