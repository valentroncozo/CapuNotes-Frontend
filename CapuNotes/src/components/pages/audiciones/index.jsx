// src/components/pages/audiciones/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TableABMC from '@/components/common/table.jsx';
import BackButton from '@/components/common/BackButton.jsx';

import '@/styles/abmc.css';
import '@/styles/table.css';
import '@/styles/forms.css';

export default function AudicionesIndex({ title = 'Audiciones' }) {
  const navigate = useNavigate();

  const headers = ['Día', 'Cantidad de turnos', 'Turnos disponibles', 'Acciones'];

  // Datos mock para el primer armado visual
  const [data] = useState([
    { id: 1, dia: 'Viernes 14', cantidadTurnos: 10, turnosDisponibles: 5 },
    { id: 2, dia: 'Sábado 15',  cantidadTurnos:  8, turnosDisponibles: 3 },
    { id: 3, dia: 'Domingo 16', cantidadTurnos: 12, turnosDisponibles: 7 },
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [filtroDia, setFiltroDia] = useState('');

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

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFiltroDia(value);

    if (!value) {
      setFilteredData(data);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = data.filter((item) => (item.dia || '').toLowerCase().includes(lower));
    setFilteredData(filtered);
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
          <input
            type="text"
            placeholder="Filtrar por día…"
            value={filtroDia}
            onChange={handleFilterChange}
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
