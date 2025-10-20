// src/components/pages/audiciones/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TableABMC from '@/components/common/table.jsx';
import BackButton from '@/components/common/BackButton.jsx';

import { audicionesService } from '@/services/audicionesService.js';

import '@/styles/abmc.css';
import '@/styles/table.css';
import '@/styles/forms.css';

export default function AudicionesIndex({ title = 'Audiciones' }) {
  const navigate = useNavigate();

  const headers = ['Día', 'Cantidad de turnos', 'Turnos disponibles', 'Acciones'];

  const [data, setData] = useState([]);
  const [filtroDia, setFiltroDia] = useState('');

  useEffect(() => {
    (async () => {
      const a = await audicionesService.listAudiciones();
      setData(a);
    })();
  }, []);

  const filteredData = useMemo(() => {
    if (!filtroDia) return data;
    const lower = filtroDia.toLowerCase();
    return data.filter((item) => (item.dia || '').toLowerCase().includes(lower));
  }, [data, filtroDia]);

  const actions = [
    {
      title: 'Ver Candidatos (cronograma)',
      className: 'btn btn-primary',
      label: 'Candidatos',
      onClick: (d) => {
        navigate(`/audiciones/${d.id}/candidatos?dia=${encodeURIComponent(d.dia)}`);
      },
    },
    {
      title: 'Ver Turnos (cronograma para coordinadores)',
      className: 'btn btn-secondary',
      label: 'Turnos',
      onClick: (d) => {
        navigate(`/audiciones/${d.id}/coordinadores?dia=${encodeURIComponent(d.dia)}`);
      },
    },
  ];

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
          <hr className="divisor-amarillo" />
        </header>

        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Filtrar por día…"
            value={filtroDia}
            onChange={(e) => setFiltroDia(e.target.value)}
            className="abmc-input"
            aria-label="Filtrar por día"
          />

          <button
            className="btn btn-primary"
            onClick={() => navigate('/audiciones/agregar')}
          >
            Agregar audición
          </button>
        </div>

        <div className="abmc-table-container">
          <TableABMC
            headers={headers}
            data={filteredData}
            actions={actions}
            columns={['dia', 'cantidadTurnos', 'turnosDisponibles']}
            emptyMenssage={
              filteredData.length === 0 && data.length > 0
                ? 'No se encuentran días que coincidan con el filtro.'
                : 'No hay audiciones disponibles.'
            }
          />
        </div>

        <footer
          className="audicion-footer"
          style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}
        >
          <button className="btn btn-secondary" onClick={() => { /* TODO: abrir vista cuestionario */ }}>
            Visualizar cuestionario
          </button>
          <button className="btn btn-primary" onClick={() => { /* TODO: publicar audición */ }}>
            Publicar audición
          </button>
          <button className="btn btn-secondary" onClick={() => { /* TODO: modificar audición */ }}>
            Modificar audición
          </button>
        </footer>
      </div>
    </main>
  );
}
