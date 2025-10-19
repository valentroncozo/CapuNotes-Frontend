import '@/styles/audicion.css';
import '@/styles/abmc.css';

import { useState } from 'react'; 

import TableABMC from '../../common/table.jsx';
import BackButton from '../../common/BackButton.jsx';
import { useNavigate } from 'react-router-dom';

const Audicion = ({ title ='Audición'}) => {

  const headers = ['Día','Cantidad De Turnos','Turnos Disponibles','Acciones'];
  const URLCRONOGRAMA = 'audicion/cronograma';

  const navigate = useNavigate();

  const [data, setData] = useState([
    // Datos de ejemplo
    { id: 1, dia: 'Lunes 12', cantidadTurnos: 10, turnosDisponibles: 5 },
    { id: 2, dia: 'Martes 13', cantidadTurnos: 8, turnosDisponibles: 3 },
    { id: 3, dia: 'Lunes 19', cantidadTurnos: 12, turnosDisponibles: 7 },
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [filtroDia, setFiltroDia] = useState('');

  const actions = [{
    title: 'Ver Cronograma',
    className: 'abmc-btn btn-primary',
    label: 'Ver Cronograma',
    onClick:(d) => { navigate(`audiciones/cronograma/${d.id}?dia=${d.dia}`); }
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
                : 'No hay audiciones disponibles.' 
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

