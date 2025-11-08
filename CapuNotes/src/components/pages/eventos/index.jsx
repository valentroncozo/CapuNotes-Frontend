import React, { useState, useEffect } from "react";
import BackButton from "@/components/common/BackButton.jsx";
import PopUpEventos from "./popUpEventos.jsx";
import ConfirmDeletePopup from "./ConfirmDeletePopup.jsx";
import "@/styles/globals.css";
import "@/styles/eventos.css";
import { eventoService } from "@/services/eventoService.js"; // 👈 corregido

const Eventos = () => {
  const [popupMode, setPopupMode] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [eventos, setEventos] = useState([]);

  // 🔹 Cargar eventos al iniciar
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventoService.list();
        setEventos(data);
      } catch (error) {
        console.error("❌ Error al obtener eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  // 🔹 Abrir y cerrar popups
  const handleOpenPopup = (mode, evento = null) => {
    setPopupMode(mode);
    setSelectedEvento(evento);
  };

  const handleClosePopup = () => {
    setPopupMode(null);
    setSelectedEvento(null);
  };

  // 🔹 Eliminar evento
  const handleDeleteEvent = async () => {
    try {
      if (!selectedEvento) return;

      await eventoService.remove(
        selectedEvento.id,
        selectedEvento.tipoEvento || selectedEvento.tipo
      );

      setEventos((prev) => prev.filter((e) => e.id !== selectedEvento.id));
      setShowDeletePopup(false);
      setSelectedEvento(null);
    } catch (error) {
      console.error("❌ Error al eliminar el evento:", error);
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

      {/* 🔍 Buscador y botón agregar */}
      <div className="eventos-search">
        <input
          type="text"
          placeholder="Buscar por nombre o lugar"
          className="eventos-search-input"
        />
        <div className="eventos-profile">
          <button
            className="evento-btn agregar"
            onClick={() => handleOpenPopup("crear")}
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

      {/* 🔹 Listado de eventos */}
      <div className="eventos-grid">
        {eventos.map((evento) => (
          <div key={evento.id} className="evento-card">
            <p>{evento.nombre}</p>
            <p>{evento.tipoEvento}</p>
            <p>
              {evento.fechaInicio} - {evento.hora}
            </p>
            <p>{evento.lugar}</p>

            <div className="evento-actions">
              <button
                className="evento-btn editar redondeado"
                onClick={() => handleOpenPopup("editar", evento)}
              >
                ✏️
              </button>
              <button
                className="evento-btn eliminar redondeado"
                onClick={() => {
                  setSelectedEvento(evento);
                  setShowDeletePopup(true);
                }}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔸 Popup eliminar */}
      {showDeletePopup && (
        <ConfirmDeletePopup
          evento={selectedEvento}
          onClose={() => setShowDeletePopup(false)}
          onDeleted={(id) =>
            setEventos((prev) => prev.filter((e) => e.id !== id))
          }
        />
      )}

      {/* 🔸 Popup crear / editar */}
      {popupMode && (
        <PopUpEventos
          modo={popupMode}
          eventoSeleccionado={{
            nombre: selectedEvento?.nombre || "",
            tipoEvento: selectedEvento?.tipoEvento || "",
            fechaInicio: selectedEvento?.fechaInicio || "",
            hora: selectedEvento?.hora || "",
            lugar: selectedEvento?.lugar || "",
          }}
          onClose={handleClosePopup}
          onSave={async (nuevoEvento) => {
            try {
              if (popupMode === "crear") {
                await eventoService.create(nuevoEvento);
              } else if (popupMode === "editar") {
                await eventoService.update(selectedEvento.id, nuevoEvento);
              }
              const data = await eventoService.list();
              setEventos(data);
              handleClosePopup();
            } catch (error) {
              console.error("❌ Error al guardar el evento:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Eventos;

