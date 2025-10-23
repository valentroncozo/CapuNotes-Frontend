import '@/styles/abmc.css';
import '@/styles/table.css';
import BackButton from '@/components/common/BackButton.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { audicionesService } from '@/services/audicionesService.js';
import InscripcionView from '@/components/common/InscripcionView.jsx';
import InfoIcon from '@/assets/InfoIcon.jsx';

export default function CandidatosCoordinadoresPage({ title = 'Candidatos (Coordinadores)' }) {
  const [dias, setDias] = useState([]);
  const [diaSel, setDiaSel] = useState('-');
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [viewRow, setViewRow] = useState(null);

  const [sp] = useSearchParams();
  useEffect(() => { (async () => {
    const ds = await audicionesService.listDias();
    setDias(ds);
    const qp = sp.get('dia');
    setDiaSel((qp && ds.includes(qp)) ? qp : (ds[0] || '-'));
  })(); }, [sp]);
  useEffect(() => { (async () => { if (diaSel && diaSel !== '-') setRows(await audicionesService.listTurnos(diaSel)); })(); }, [diaSel]);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const t = q.toLowerCase();
    return rows.filter(r => `${r.apellido || ''}, ${r.nombre || ''}`.toLowerCase().includes(t) || String(r.cancion||'').toLowerCase().includes(t));
  }, [rows, q]);

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
        </div>

        <div className="abmc-topbar">
          <input className="abmc-input" placeholder="Buscar por apellido o canción" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="abmc-input" value={diaSel} onChange={(e) => setDiaSel(e.target.value)}>
            <option value="-">-</option>
            {dias.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
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
                  <button className="btn-accion btn-accion--icon" title="Ver inscripción" disabled={!r.inscripcion} onClick={() => setViewRow(r)}>
                    <InfoIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewRow && (
        <InscripcionView data={viewRow.inscripcion} open={true} onClose={() => setViewRow(null)} editable={false} />
      )}
    </main>
  );
}
