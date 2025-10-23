import '@/styles/abmc.css';
import '@/styles/table.css';
import BackButton from '@/components/common/BackButton.jsx';
import { useEffect, useState } from 'react';
import historialService from '@/services/historialService.js';

export default function HistorialCandidatosPage({ title = 'Historial de Candidatos' }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { (async () => {
    try { setRows(await historialService.list()); } catch (e) { setError('Servicio de historial no disponible.'); }
  })(); }, []);

  const filtered = rows.filter(r => `${r.apellido || ''}, ${r.nombre || ''}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
        </div>

        <div className="abmc-topbar">
          <input className="abmc-input" placeholder="Buscar por apellido o nombre" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {error ? (
          <p style={{ padding: 16, color: 'red' }}>{error}</p>
        ) : (
          <table className="abmc-table abmc-table-rect">
            <thead className="abmc-thead">
              <tr className="abmc-row">
                <th>Apellido, Nombre</th>
                <th>Audición</th>
                <th>Canción</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="abmc-row">
                  <td>{`${r.apellido || ''}, ${r.nombre || ''}`}</td>
                  <td>{r.fechaAudicion || '—'}</td>
                  <td>{r.cancion || '—'}</td>
                  <td>{r.resultado?.estado || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
