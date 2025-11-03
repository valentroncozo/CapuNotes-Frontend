import React, { useState, useEffect } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import PopUpEventos from './popUpEventos.jsx';
import ConfirmDeletePopup from './ConfirmDeletePopup.jsx';
import '@/styles/globals.css';
import '@/styles/eventos.css';

const Eventos = () => {
  const [popupMode, setPopupMode] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Simulación de carga de eventos
    const simulatedEventos = [
      {
        nombre: 'Casamiento Sofi y Juan',
        lugar: 'Villa Allende',
        tipo: 'Tipo evento 1',
      },
      {
        nombre: 'Bautismo Sofía',
        lugar: 'Nueva Córdoba',
        tipo: 'Tipo evento 2',
      },
      { nombre: 'Misa Pascuas', lugar: 'Iglesia', tipo: 'Tipo evento' },
      {
        nombre: 'Casamiento Lara y Tomás',
        lugar: 'Carlos Paz',
        tipo: 'Tipo evento 1',
      },
      { nombre: 'Ensayo', lugar: 'Nueva Córdoba', tipo: 'Tipo evento 2' },
      { nombre: 'Retiro', lugar: 'Río Ceballos', tipo: 'Tipo evento' },
    ];
    setEventos(simulatedEventos);
  }, []);

  const handleOpenPopup = (mode, evento = null) => {
    setPopupMode(mode);
    setSelectedEvento(evento);
  };

  const handleClosePopup = () => {
    setPopupMode(null);
    setSelectedEvento(null);
  };

  const handleDeleteEvent = () => {
    console.log('Evento eliminado');
    setShowDeletePopup(false);
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
            ➕
          </button>
        </div>
      </div>

      <div className="eventos-grid">
        {eventos.map((evento, index) => (
          <div key={index} className="evento-card">
            <h3>
              <span className="evento-icon">✏️</span> {evento.nombre}
            </h3>
            <p>
              <span className="evento-icon">📍</span> {evento.lugar}
            </p>
            <p>
              <span className="evento-icon">🏷️</span> {evento.tipo}
            </p>
            <div className="evento-actions">
              <button
                className="evento-btn ver"
                onClick={() => handleOpenPopup('ver', evento)}
              >
                👁️
              </button>
              <button
                className="evento-btn editar"
                onClick={() => handleOpenPopup('editar', evento)}
              >
                ✏️
              </button>
              <button
                className="evento-btn eliminar"
                onClick={() => setShowDeletePopup(true)}
              >
                ❌
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
          eventoSeleccionado={selectedEvento}
          onClose={handleClosePopup}
          onSave={() => {
            console.log('Evento guardado');
            handleClosePopup();
          }}
        />
      )}
    </div>
  );
};

export default Eventos;
