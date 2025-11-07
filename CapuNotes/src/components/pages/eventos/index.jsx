import React, { useState, useEffect } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import PopUpEventos from './popUpEventos.jsx';
import ConfirmDeletePopup from './ConfirmDeletePopup.jsx';
import '@/styles/globals.css';
import '@/styles/eventos.css';
import { eventosService } from '@/services/eventosService.js';

const Eventos = () => {
  const [popupMode, setPopupMode] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventosService.listarEventos();
        setEventos(data);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };
    fetchEventos();
  }, []);

  const handleOpenPopup = (mode, evento = null) => {
    setPopupMode(mode);
    setSelectedEvento(evento);
  };

  const handleClosePopup = () => {
    setPopupMode(null);
    setSelectedEvento(null);
  };

  const handleDeleteEvent = async () => {
    try {
      if (!selectedEvento) return;

      await eventosService.eliminarEvento(
        selectedEvento.id,
        selectedEvento.tipoEvento || selectedEvento.tipo
      );

      setEventos((prev) => prev.filter((e) => e.id !== selectedEvento.id));
      setShowDeletePopup(false);
      setSelectedEvento(null);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  return (
    <div className="eventos-container">
      <header className="abmc-header">
        <BackButton />
        <div className="abmc-title">
          <h1>Eventos</h1>
        </div>
      </header>
      <hr className="divisor-amarillo" />

      <div className="eventos-search">
        <input
          type="text"
          placeholder="Buscar por nombre e lugar"
          className="eventos-search-input"
        />
        <div className="eventos-profile">
          <button
            className="evento-btn agregar"
            onClick={() => handleOpenPopup('crear')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="eventos-grid">
        {eventos.map((evento, index) => (
          <div key={index} className="evento-card">
            <p>
              <span className="evento-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#4a4a4a"
                >
                  <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                </svg>
              </span>{' '}
              {evento.nombre}
            </p>
            <p>
              <span className="evento-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#4a4a4a"
                >
                  <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
                </svg>
              </span>{' '}
              {evento.tipoEvento}
            </p>

            <p>
              <span className="evento-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#4a4a4a"
                >
                  <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                </svg>
              </span>{' '}
              {evento.fechaInicio} - {evento.hora}
            </p>

            <p>
              <span className="evento-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#4a4a4a"
                >
                  <path d="M480-80q-106 0-173-33.5T240-200q0-24 14.5-44.5T295-280l63 59q-9 4-19.5 9T322-200q13 16 60 28t98 12q51 0 98.5-12t60.5-28q-7-8-18-13t-21-9l62-60q28 16 43 36.5t15 45.5q0 53-67 86.5T480-80Zm1-220q99-73 149-146.5T680-594q0-102-65-154t-135-52q-70 0-135 52t-65 154q0 67 49 139.5T481-300Zm-1 100Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z" />
                </svg>
              </span>{' '}
              {evento.lugar}
            </p>
            <div className="evento-actions">
              <button
                className="evento-btn editar redondeado"
                onClick={() => handleOpenPopup('editar', evento)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
                </svg>
              </button>
              <button
                className="evento-btn eliminar redondeado"
                onClick={() => {
                  setSelectedEvento(evento);
                  setShowDeletePopup(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeletePopup && (
        <ConfirmDeletePopup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleDeleteEvent}
        />
      )}

      {popupMode && (
        <PopUpEventos
          modo={popupMode}
          eventoSeleccionado={{
            nombre: selectedEvento?.nombre || '',
            tipoEvento: selectedEvento?.tipoEvento || '',
            fecha: selectedEvento?.fechaInicio || '',
            hora: selectedEvento?.hora || '',
            lugar: selectedEvento?.lugar || '',
          }}
          onClose={handleClosePopup}
          onSave={async (nuevoEvento) => {
            try {
              if (popupMode === 'crear') {
                // Crear nuevo evento
                await eventosService.crearEvento(nuevoEvento);
              } else if (popupMode === 'editar') {
                // Modificar evento existente
                await eventosService.actualizarEvento(
                  selectedEvento.id,
                  nuevoEvento
                );
              }

              const data = await eventosService.listarEventos();
              setEventos(data);
              handleClosePopup();
            } catch (error) {
              console.error('Error al guardar el evento:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Eventos;
