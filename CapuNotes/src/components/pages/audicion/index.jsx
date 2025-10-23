import '@/styles/audicion.css';
import '@/styles/abmc.css';

import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import TableABMC from '../../common/table.jsx';
import BackButton from '../../common/BackButton.jsx';

import TurnoService from '@/services/turnoServices.js';
import AudicionService from '@/services/audicionService.js';
import aggregateTurnosByDaySimple from '@/services/ParsingTurnos.js';

const Audicion = ({ title ='Audición'}) => {

  const headers = ['Día','Cantidad De Turnos','Turnos Disponibles','Acciones'];
  const URLCRONOGRAMA = 'audicion/cronograma';

  const navigate = useNavigate();

  const [setAudicion] = useState({});
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);
  const [filtroDia, setFiltroDia] = useState('');


  const  load = async () => {
    const audicion = await AudicionService.getActual();

    setAudicion(audicion);

    if (!audicion) {
      setData([]);
    } else {
      const turnos = await TurnoService.listarPorAudicion(audicion.id);
      const aggregated = aggregateTurnosByDaySimple(turnos);

      console.log('Aggregated turnos by day:', aggregated);

      setData(aggregated);
      setFilteredData(aggregated);
    }
  };

  useEffect(() => { load(); }, []);

  // Botones que peuden figurar en la tabla
  const actions = [{
    title: 'Ver Cronograma',
    className: 'abmc-btn btn-primary',
    label: 'Ver Cronograma',
    onClick:(d) => { navigate(`${URLCRONOGRAMA}/${d.id}?dia=${d.dia}`); }
  }];

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFiltroDia(value);

    if(!value){
      setFilteredData(data);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = data.filter(item => (item.dia || '').toLowerCase().includes(lower));
    setFilteredData(filtered);
  };

  return (
      <main className="audicion-page">
        <div className="abmc-card">
          <header className="abmc-header">
            <BackButton />
            <h1>{title}</h1>
            <hr className='divisor-amarillo'></hr>
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
                onClick={() => { navigate('/audicion/agregar'); }}
              >
                Agregar Audición
              </button>
          </div>

          <div className="abmc-table-container">
            <TableABMC
              headers={headers}
              data={filteredData}
              actions={actions}
              columns={['dia', 'cantidadTurnos', 'turnosDisponibles']}  
              emptyMenssage={ filteredData.length === 0 && data.length > 0 
                ? 'No se encuentran días que coincidan con el filtro.' 
                : 'No se encuentran audiciones actuales.' 
              }
            />
          </div>

          <footer className="audicion-footer">

            <div className='content-footer'>
              <button className="abmc-btn btn-secondary" onClick={() => {}}>
                Visualizar Cuestionario
              </button>
            </div>

            <div className='content-footer'>
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
  )
};

export default Audicion;

