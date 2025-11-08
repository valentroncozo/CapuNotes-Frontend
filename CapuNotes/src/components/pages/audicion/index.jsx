import '@/styles/audicion.css';
import '@/styles/abmc.css';

import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import TableABMC from '../../common/table.jsx';
import BackButton from '../../common/BackButton.jsx';

import TurnoService from '@/services/turnoServices.js';
import AudicionService from '@/services/audicionService.js';
import PreguntasService from '@/services/preguntasService.js'; // <-- nuevo import (ajusta la ruta si es necesario)
import Swal from 'sweetalert2';

const Audicion = ({ title ='Audición'}) => {

  const headers = ['Día','Cantidad De Turnos','Turnos Disponibles','Acciones'];
  const URLCRONOGRAMA = 'audicion/cronograma';

  const navigate = useNavigate();

  const [audicion, setAudicion] = useState({});
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState(data);
  const [filtroDia, setFiltroDia] = useState('');
  const [esPublicada, setEsPublicada] = useState(false);
  const [formulario, setFormulario] = useState([]);

  const  load = async () => {
    const audicion = await AudicionService.getActual();

    setAudicion(audicion);

    setEsPublicada(audicion?.estado === 'PUBLICADA');

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

  useEffect(() => {
    const fetchData = async () => {
      const encuesta = await preguntasService.getFormulario(perfil.audicionId);
      setFormulario(encuesta);
    };
    fetchData();

  }, []);

  // Selector temporal de rol para redirección
  const handleVerCronograma = async (row) => {
    const diaIso = row?.fecha; // 'YYYY-MM-DD'
    const res = await Swal.fire({
      title: '¿Quién está usando el sistema hoy?',
      showDenyButton: true,
      confirmButtonText: 'Coordinador',
      denyButtonText: 'Administrador',
      background: '#11103a',
      color: '#E8EAED',
      confirmButtonColor: '#ffc107',
      denyButtonColor: '#6c757d',
    });
    if (res.isConfirmed) {
      navigate(`/audicion/candidatos?dia=${encodeURIComponent(diaIso)}`);
    } else if (res.isDenied) {
      navigate(`/candidatos-administracion?dia=${encodeURIComponent(diaIso)}`);
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
      // formulario es un array. Si está vacío, intentar recargar desde API
      let formularioActual = formulario;
      if ((!Array.isArray(formularioActual) || formularioActual.length === 0) && audicion?.id) {
        try {
          const result = await PreguntasService.getFormulario(audicion.id);
          formularioActual = Array.isArray(result) ? result : Array.isArray(result?.preguntas) ? result.preguntas : [];
          setFormulario(formularioActual);
        } catch (err) {
          console.error('Error cargando formulario:', err);
          formularioActual = [];
        }
      }

      const tienePreguntas = Array.isArray(formularioActual) ? formularioActual.length > 0 : false;

      if (!tienePreguntas) {
        await Swal.fire({
          title: 'No se puede publicar',
          text: 'La audición no tiene preguntas asignadas. Asigna al menos una pregunta antes de publicar.',
          icon: 'warning',
          background: '#11103a',
          color: '#E8EAED',
          confirmButtonText: 'Entendido',
        });
        return;
      }

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

      if (res.isConfirmed ) {
        await AudicionService.actualizarParcial(audicion.id, {estado: 'PUBLICADA'});
        Swal.fire({
          title: 'Audición publicada',
          icon: 'success',
          background: '#11103a',
          color: '#E8EAED',
        });
        setEsPublicada(true);
      }
    }

  const  handlerCerrarAudicion = async () => {
    const res = await Swal.fire({
      title: '¿Estás seguro de que quieres cerrar la audición?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Cerrar Audición',
      cancelButtonText: 'Cancelar',
      background: '#11103a',
      color: '#E8EAED',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (res.isConfirmed) {
      await AudicionService.actualizarParcial(audicion.id, {estado: 'CERRADA'});
      Swal.fire({
        title: 'Audición cerrada',
        icon: 'success',
        background: '#11103a',
        color: '#E8EAED',
      });
      setEsPublicada(false);
    }
  }


  return (
      <main className="audicion-page">
        <div className="abmc-card">
          <header className="abmc-header">
            <BackButton />
            <h1 className='abmc-title'>{title}</h1>
            {audicion && (
            <span style={{ 
              marginLeft: 'auto', 
              padding: '4px 12px', 
              borderRadius: '4px', 
              backgroundColor: esPublicada ? '#28a745' : '#ffc107',
              color: esPublicada ? 'white' : 'black',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {esPublicada ? 'PUBLICADA' : 'BORRADOR'}
            </span>
          )}
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
              {!esPublicada ? (
              <button className="abmc-btn btn-primary" onClick={handlerPublicarAudicion}>
                Publicar Audición
              </button>
              ) : ( audicion?.estado === 'PUBLICADA' ? (
                <button className="abmc-btn btn-primary" onClick={() => { handlerCerrarAudicion(); }}>
                  Cerrar Audición
                </button>
              ) : null)}
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