import '@/styles/abmc.css';
import '@/styles/cuestionario.css';
import { useEffect, useMemo, useState } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import AudicionService from '@/services/audicionService.js';
import preguntasService from '@/services/preguntasService.js';
import Modal from '@/components/common/Modal.jsx'; // <-- uso del modal genérico existente
import TrashIcon from '@/assets/TrashIcon.jsx';


const tipos = [
  { value: 'TEXTO', label: 'Texto' },
  { value: 'OPCION', label: 'Opción' },
  { value: 'MULTIOPCION', label: 'Multiopción' },
];

function opcionToString(opt) {
  if (typeof opt === 'string') return opt;
  if (opt == null) return '';
  return opt.texto ?? opt.text ?? String(opt.id ?? JSON.stringify(opt));
}

export default function CuestionarioConfigPage({ title = 'Configuración de cuestionario' }) {
  const [audicion, setAudicion] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [asignadas, setAsignadas] = useState(() => new Set());
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
      opciones: Array.isArray(p.opciones) ? p.opciones : [],
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
    const saved = await preguntasService.create(nuevo);
    setPreguntas(prev => [{ ...saved, opciones: Array.isArray(saved.opciones) ? saved.opciones : [] }, ...prev]);
    setNuevo({ valor: '', tipo: 'TEXTO', obligatoria: true, opciones: [] });
    setNuevaOpcion('');
  };

  const handleUpdate = async (p) => {
    // normalizar opciones para la API: preferir id, sino texto, sino string
    const opcionesRaw = Array.isArray(p.opciones) ? p.opciones : [];
    const opcionesForPayload = opcionesRaw.map(o => {
      if (o == null) return o;
      if (typeof o === 'string' || typeof o === 'number') return o;
      if (o.id != null) return o.id;
      return o.texto ?? o.text ?? String(o);
    });

    // enviar opciones solo para tipos que las usan
    const payload = { valor: p.valor, tipo: p.tipo, obligatoria: p.obligatoria };
    if (p.tipo === 'OPCION' || p.tipo === 'MULTIOPCION') payload.opciones = opcionesForPayload;

    try {
      const updated = await preguntasService.update(p.id, payload);
      setPreguntas(prev => prev.map(x => x.id === p.id ? { ...updated, opciones: Array.isArray(updated.opciones) ? updated.opciones : opcionesRaw } : x));
    } catch (err) {
      console.error('Error al actualizar pregunta:', err);
      console.error('Response data:', err?.response?.data);
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
    await preguntasService.asignarA_Audicion(audicion.id, [id]);
    setAsignadas(prev => new Set(prev).add(id));
  };

  const handleQuitar = async (id) => {
    if (!audicion?.id) return;
    await preguntasService.quitarDeAudicion(audicion.id, id);
    setAsignadas(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  // función agregada: agrega una opción al objeto "nuevo" (form de nueva pregunta)
  const handleAddOpcion = () => {
    const op = (nuevaOpcion || '').trim();
    if (!op) return;
    setNuevo(prev => ({ ...prev, opciones: [...(prev.opciones || []), op] }));
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
                        }}>Modificar</button>
                        <button type="button" className="abmc-btn abmc-btn-danger" onClick={() => handleDelete(p.id)}> <TrashIcon /></button>
                        {isAsignada ? (
                          <button type="button" className="abmc-btn abmc-btn-danger" onClick={() => handleQuitar(p.id)}>Quitar del cuestionario</button>
                        ) : (
                          <button type="button" className="abmc-btn abmc-btn-primary" onClick={() => handleAsignar(p.id)}>Añadir cuestionario</button>
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
                    setEditing(prev => ({ ...prev, opciones: [...(prev.opciones || []), v] }));
                    setEditOpcionInput('');
                  }}>Agregar opción</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="abmc-btn" type="button" onClick={() => { setIsEditing(false); setEditing(null); }}>Cancelar</button>
              <button className="abmc-btn abmc-btn-primary" type="button" onClick={async () => {
                if (!editing.valor || !editing.valor.trim()) return;
                await handleUpdate(editing);
                setIsEditing(false);
                setEditing(null);
              }}>Guardar</button>
            </div>
          </Modal>
        ) : null}
      </div>
    </main>
  );
}

