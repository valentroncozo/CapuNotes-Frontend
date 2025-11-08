// src/components/pages/audicion/index.jsx
import '@/styles/audicion.css';
import '@/styles/abmc.css';
import '@/styles/audicion-agregar.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import TableABMC from '../../common/table.jsx';
import BackButton from '../../common/BackButton.jsx';
import TurnoService from '@/services/turnoServices.js';
import AudicionService from '@/services/audicionService.js';
import PreguntasService from '@/services/preguntasService.js'; // <-- nuevo import (ajusta la ruta si es necesario)
import Swal from 'sweetalert2';

const Audicion = ({ title = 'Audición' }) => {
  const headers = [
    'Fecha',
    'Hora',
    'Cantidad de turnos',
    'Turnos disponibles',
    'Acciones',
  ];

  const navigate = useNavigate();
  const [audicion, setAudicion] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filtroDia, setFiltroDia] = useState('');
  const [esPublicada, setEsPublicada] = useState(false);
  const [formulario, setFormulario] = useState([]);

  const load = async () => {
    const audicionActual = await AudicionService.getActual();
    setAudicion(audicionActual);
    setEsPublicada(audicionActual?.estado === 'PUBLICADA');

    if (!audicionActual) {
      setData([]);
      setFilteredData([]);
      return;
    }

    const resumen = await TurnoService.listarResumenPorDia(audicionActual.id);
    const franjas = await TurnoService.listarFranjasHorarias(audicionActual.id);

    const mapHoras = {};
    (franjas || []).forEach((f) => {
      if (f?.fecha) {
        if (!mapHoras[f.fecha]) mapHoras[f.fecha] = [];
        mapHoras[f.fecha].push(f.horaDesde || '');
      }
    });

    const parseLocalDate = (yyyyMmDd) => {
      const [y, m, d] = String(yyyyMmDd).split('-').map(Number);
      return new Date(y, (m || 1) - 1, d || 1);
    };

    const formatFecha = (isoDate) => {
      const d = parseLocalDate(isoDate);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}/${d.getFullYear()}`;
    };

    const rows = (resumen || []).map((r) => ({
      fecha: r.fecha,
      fechaFormateada: formatFecha(r.fecha),
      hora: (mapHoras[r.fecha] || []).join(', ') || '-',
      cantidadTurnos: r.cantidadTurnos,
      turnosDisponibles: r.turnosDisponibles,
    }));

    setData(rows);
    setFilteredData(rows);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const fetchData = async () => {
      const encuesta = await preguntasService.getFormulario(perfil.audicionId);
      setFormulario(encuesta);
    };
    fetchData();

  }, []);

  const handleVerCronograma = async (row) => {
    const diaIso = row?.fecha;
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

  const actions = [
    {
      title: 'Ver Cronograma',
      className: 'abmc-btn btn-transparent',
      label: '',
      icon: (
        <span
          className="material-symbols-outlined"
          style={{
            color: 'white',
            fontSize: '22px',
            verticalAlign: 'middle',
          }}
        >
          visibility
        </span>
      ),
      onClick: (row) => handleVerCronograma(row),
    },
  ];

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFiltroDia(value);
    if (!value) return setFilteredData(data);
    const lower = value.toLowerCase();
    setFilteredData(
      data.filter((i) => (i.fechaFormateada || '').toLowerCase().includes(lower))
    );
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

  const handlerCerrarAudicion = async () => {
    const res = await Swal.fire({
      title: '¿Cerrar audición?',
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
      await AudicionService.actualizarParcial(audicion.id, { estado: 'CERRADA' });
      Swal.fire({ title: 'Audición cerrada', icon: 'success' });
      setEsPublicada(false);
    }
  };

  return (
    <main className="audicion-page">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
        </header>

        {/* Estado debajo del título */}
        {audicion && (
          <div style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                backgroundColor: esPublicada ? '#28a745' : '#ffc107',
                color: esPublicada ? 'white' : 'black',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Estado: {esPublicada ? 'PUBLICADA' : 'BORRADOR'}
            </span>
          </div>
        )}

        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Buscar por día"
            value={filtroDia}
            onChange={handleFilterChange}
            className="abmc-input"
          />

          <button
            className="abmc-btn btn-primary"
            disabled={data.length > 0}
            onClick={() => navigate('/audicion/agregar')}
          >
            <span
              className="material-symbols-outlined"
              style={{ verticalAlign: 'middle', color: 'white' }}
            >
              add
            </span>
          </button>
        </div>

        <div className="abmc-table-container">
          <TableABMC
            headers={headers}
            data={filteredData}
            actions={actions}
            columns={['fechaFormateada', 'hora', 'cantidadTurnos', 'turnosDisponibles']}
            emptyMenssage={
              filteredData.length === 0 && data.length > 0
                ? 'No se encuentran fechas que coincidan con el filtro.'
                : 'No se encuentran audiciones actuales.'
            }
          />
        </div>

        <footer className="audicion-footer">
          <div className="content-footer">
            <button
              type="button"
              className="abmc-btn btn-secondary btn-dias"
              onClick={() => navigate('/cuestionario/preview')}
            >
              Visualizar Cuestionario
            </button>
          </div>

          <div className="content-footer">
            {!esPublicada ? (
              <button
                type="button"
                className="abmc-btn btn-primary btn-dias"
                onClick={handlerPublicarAudicion}
              >
                Publicar Audición
              </button>
            ) : audicion?.estado === 'PUBLICADA' ? (
              <button
                type="button"
                className="abmc-btn btn-primary btn-dias"
                onClick={handlerCerrarAudicion}
              >
                Cerrar Audición
              </button>
            ) : null}

            <button
              type="button"
              className="abmc-btn btn-secondary btn-dias"
              onClick={() => navigate('/audicion/editar')}
            >
              Modificar Audición
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Audicion;
