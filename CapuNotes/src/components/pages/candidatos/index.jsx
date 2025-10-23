import '@/styles/abmc.css';
import '@/styles/table.css';
import BackButton from '@/components/common/BackButton.jsx';
import { useEffect, useMemo, useState } from 'react';
import { candidatosService } from '@/services/candidatosService.js';
import InscripcionView from '@/components/common/InscripcionView.jsx';
import InfoIcon from '@/assets/InfoIcon.jsx';

export default function CandidatosPage({ title = 'Candidatos' }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [viewRow, setViewRow] = useState(null);

  useEffect(() => { (async () => { setRows(await candidatosService.list()); })(); }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter(r => `${r.apellido || ''}, ${r.nombre || ''}`.toLowerCase().includes(t));
  }, [rows, q]);

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

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Hora</th>
              <th>Apellido, Nombre</th>
              <th>Canción</th>
              <th style={{ textAlign: 'center' }}>Inscripción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="abmc-row">
                <td>{r.hora || '—'}</td>
                <td>{`${r.apellido || ''}, ${r.nombre || ''}`}</td>
                <td>{r.cancion || '—'}</td>
                <td className="abmc-actions">
                  <button className="btn-accion btn-accion--icon" title="Ver inscripción" onClick={() => setViewRow(r)}>
                    <InfoIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewRow && (
        <InscripcionView data={viewRow.inscripcion} open={true} onClose={() => setViewRow(null)} editable={true} onSaveCuerda={() => {}} />
      )}
    </main>
  );
}
