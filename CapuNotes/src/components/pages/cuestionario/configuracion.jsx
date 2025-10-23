import '@/styles/abmc.css';
import '@/styles/cuestionario.css';
import { useEffect, useMemo, useState } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import AudicionService from '@/services/audicionService.js';
import preguntasService from '@/services/preguntasService.js';

const tipos = [
  { value: 'TEXTO', label: 'Texto' },
  { value: 'OPCION', label: 'Opción' },
  { value: 'MULTIOPCION', label: 'Multiopción' },
];

export default function CuestionarioConfigPage({ title = 'Configuración de cuestionario' }) {
  const [audicion, setAudicion] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [asignadas, setAsignadas] = useState(() => new Set());
  const [nuevo, setNuevo] = useState({ valor: '', tipo: 'TEXTO', obligatoria: true, opciones: [] });

  const assignedIds = useMemo(() => new Set(asignadas), [asignadas]);

  const load = async () => {
    const a = await AudicionService.getActual();
    setAudicion(a);
    const all = await preguntasService.list();
    setPreguntas(all);
    if (a?.id) {
      const form = await preguntasService.getFormulario(a.id);
      setAsignadas(new Set(form.map(p => p.id)));
    } else {
      setAsignadas(new Set());
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!nuevo.valor.trim()) return;
    const saved = await preguntasService.create(nuevo);
    setPreguntas(prev => [saved, ...prev]);
    setNuevo({ valor: '', tipo: 'TEXTO', obligatoria: true, opciones: [] });
  };

  const handleUpdate = async (p) => {
    const payload = { valor: p.valor, tipo: p.tipo, obligatoria: p.obligatoria, opciones: p.opciones || [] };
    const updated = await preguntasService.update(p.id, payload);
    setPreguntas(prev => prev.map(x => x.id === p.id ? updated : x));
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
        </div>

        <div className="abmc-table-container">
          <table className="abmc-table abmc-table-rect">
            <thead className="abmc-thead">
              <tr>
                <th>Preguntas de conocimiento personal</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preguntas.map((p) => {
                const isAsignada = assignedIds.has(p.id);
                return (
                  <tr key={p.id} className="abmc-row">
                    <td>
                      <input className="abmc-input" value={p.valor || ''} onChange={(e) => setPreguntas(prev => prev.map(x => x.id === p.id ? { ...x, valor: e.target.value } : x))} />
                    </td>
                    <td>
                      <select className="abmc-select" value={p.tipo} onChange={(e) => setPreguntas(prev => prev.map(x => x.id === p.id ? { ...x, tipo: e.target.value } : x))}>
                        {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="abmc-actions">
                        <button type="button" className="abmc-btn abmc-btn-secondary" onClick={() => handleUpdate(p)}>Modificar</button>
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
      </div>
    </main>
  );
}

