import '@/styles/audicion.css';
import '@/styles/abmc.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TableABMC from '../../common/table.jsx';
import BackButton from '../../common/BackButton.jsx';

import TurnoService from '@/services/turnoServices.js';
import AudicionService from '@/services/audicionService.js';
import aggregateTurnosByDaySimple from '@/services/parsingTurnos.js';

const Audicion = ({ title = 'Audición' }) => {
  const headers = ['Día', 'Cantidad De Turnos', 'Turnos Disponibles']; // Eliminada la columna "Acciones"

  const navigate = useNavigate();

  const [audicion, setAudicion] = useState({});
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);
  const [filtroDia, setFiltroDia] = useState('');

  const load = async () => {
    const audicion = await AudicionService.getActual();

    setAudicion(audicion);

    if (!audicion) {
      setData([]);
    } else {
      const turnos = await TurnoService.listarPorAudicion(audicion.id);
      const aggregated = aggregateTurnosByDaySimple(turnos);

      setData(aggregated);
      setFilteredData(aggregated);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🎯 Acciones por fila: Candidatos y Turnos (coordinadores)
  const actions = [
    {
      title: 'Candidatos',
      className: 'abmc-btn btn-primary',
      label: 'Candidatos',
      onClick: (d) => navigate(`/candidatos?dia=${encodeURIComponent(d.dia)}`),
    },
    {
      title: 'Turnos (Coordinadores)',
      className: 'abmc-btn btn-secondary',
      label: 'Turnos',
      onClick: (d) =>
        navigate(`/candidatos-coord?dia=${encodeURIComponent(d.dia)}`),
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
    const filtered = data.filter((item) =>
      (item.dia || '').toLowerCase().includes(lower)
    );
    setFilteredData(filtered);
  };

  return (
    <main className="audicion-page">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1>{title}</h1>
          <hr className="divisor-amarillo"></hr>
        </header>

        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Filtrar por día..."
            value={filtroDia}
            onChange={handleFilterChange}
            className="abmc-input"
          />

          <button
            className="abmc-btn btn-primary"
            onClick={() => {
              navigate('/audicion/agregar');
            }}
          >
            Agregar Audición
          </button>
        </div>

        <div className="abmc-table-container">
          <TableABMC
            headers={headers}
            data={filteredData}
            actions={actions} // Mantener las acciones pero no mostrar la columna "Acciones"
            columns={['dia', 'cantidadTurnos', 'turnosDisponibles']}
            emptyMenssage={
              filteredData.length === 0 && data.length > 0
                ? 'No se encuentran días que coincidan con el filtro.'
                : 'No se encuentran audiciones actuales.'
            }
          />
        </div>

        <footer className="audicion-footer">
          <div className="content-footer">
            <button className="abmc-btn btn-secondary" onClick={() => {}}>
              Visualizar Cuestionario
            </button>
          </div>

          <div className="content-footer">
            <button className="abmc-btn btn-primary" onClick={() => {}}>
              Publicar Audición
            </button>
            <button className="abmc-btn btn-secondary" onClick={() => {}}>
              Modificar Audición
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Audicion;
