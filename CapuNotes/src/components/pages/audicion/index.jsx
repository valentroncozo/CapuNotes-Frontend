import '@/styles/audicion.css';
import '@/styles/abmc.css';

import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import TableABMC from '../../common/table.jsx';
import BackButton from '../../common/BackButton.jsx';

import TurnoService from '@/services/turnoServices.js';
import AudicionService from '@/services/audicionService.js';
import Swal from 'sweetalert2';

const Audicion = ({ title ='Audición'}) => {

  const headers = ['Día','Cantidad De Turnos','Turnos Disponibles','Acciones'];
  const URLCRONOGRAMA = 'audicion/cronograma';

  const navigate = useNavigate();

  const [audicion, setAudicion] = useState({});
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);
  const [filtroDia, setFiltroDia] = useState('');


  const  load = async () => {
    const audicion = await AudicionService.getActual();

    setAudicion(audicion);

    if (!audicion) {
      setData([]);
    } else {
      // Delegar agregación al backend
      const resumen = await TurnoService.listarResumenPorDia(audicion.id);

      // enriquecer con etiqueta 'dia' para la UI evitando desfases de zona horaria
      const parseLocalDate = (yyyyMmDd) => {
        const [y, m, d] = String(yyyyMmDd).split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
      };
      const formatDia = (isoDate) => {
        const d = parseLocalDate(isoDate);
        const nombreDia = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(d);
        return `${nombreDia.charAt(0).toUpperCase()}${nombreDia.slice(1)} ${d.getDate()}`;
      };

      const rows = (resumen || []).map(r => ({
        fecha: r.fecha,
        dia: formatDia(r.fecha),
        cantidadTurnos: r.cantidadTurnos,
        turnosDisponibles: r.turnosDisponibles
      }));

      setData(rows);
      setFilteredData(rows);
    }
  };

  useEffect(() => { load(); }, []);

  // Selector temporal de rol para redirección
  const handleVerCronograma = async (row) => {
    const diaIso = row?.fecha; // 'YYYY-MM-DD'
    const res = await Swal.fire({
      title: '¿Quién está usando el sistema hoy?',
      showDenyButton: true,
      confirmButtonText: 'Coordinador',
      denyButtonText: 'Evaluador',
      background: '#11103a',
      color: '#E8EAED',
      confirmButtonColor: '#ffc107',
      denyButtonColor: '#6c757d',
    });
    if (res.isConfirmed) {
      navigate(`/candidatos-coordinadores?dia=${encodeURIComponent(diaIso)}`);
    } else if (res.isDenied) {
      navigate(`/candidatos?dia=${encodeURIComponent(diaIso)}`);
    }
  };

  // Botones que pueden figurar en la tabla
  const actions = [{
    title: 'Ver Cronograma',
    className: 'abmc-btn btn-primary',
    label: 'Ver Cronograma',
    onClick: (row) => handleVerCronograma(row),
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

  const  handlerPublicarAudicion = async () => {
    const res = await Swal.fire({
      title: '¿Estás seguro de que quieres publicar la audición?',
      showCancelButton: true,
      confirmButtonText: 'Publicar',
      cancelButtonText: 'Cancelar',
      background: '#11103a',
      color: '#E8EAED',
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
    });

    if (res.isConfirmed) {
      await AudicionService.actualizarParcial(audicion.id, {estado: 'PUBLICADA'});
      Swal.fire({
        title: 'Audición publicada',
        icon: 'success',
        background: '#11103a',
        color: '#E8EAED',
      });
    }
  }

  return (
      <main className="audicion-page">
        <div className="abmc-card">
          <header className="abmc-header">
            <BackButton />
            <h1 className='abmc-title'>{title}</h1>
          </header>
            <hr className='divider'></hr>
    
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
              <button className="abmc-btn btn-secondary" onClick={() => { navigate('/cuestionario/preview'); }}>
                Visualizar Cuestionario
              </button>
            </div>

            <div className='content-footer'>
              <button className="abmc-btn btn-primary" onClick={handlerPublicarAudicion}>
                Publicar Audición
              </button>
              <button className="abmc-btn btn-secondary" onClick={() => { navigate('/audicion/editar'); }}>
                Modificar Audición
              </button>
            </div>

          </footer>
        </div>


      </main>
  )
};

export default Audicion;