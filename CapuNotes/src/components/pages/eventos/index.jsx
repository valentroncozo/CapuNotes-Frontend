import React, { useState, useEffect, useMemo } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import PopUpEventos from './popUpEventos.jsx';
import ConfirmDeletePopup from './ConfirmDeletePopUp.jsx';
import RepertorioPopup from './RepertorioPopup.jsx';
import '@/styles/eventos.css';
import Swal from 'sweetalert2';
import { eventoService } from '@/services/eventoService.js';
import { ensayosService } from "@/services/ensayosService.js";
import { presentacionesService } from "@/services/presentacionesService.js";

import '@/styles/abmc.css';

const parseEventoError = (error) => {
  if (!error?.response) return null;
  const status = error.response.status;
  const raw = String(error.response.data || '').toLowerCase();
  if (status === 400) {
    if (raw.includes('fecha')) {
      return 'La fecha ingresada no es válida.';
    }
    if (raw.includes('no debe')) {
      return 'Completá los campos obligatorios y volvé a intentar.';
    }
    return 'Revisá los datos del evento e intentá nuevamente.';
  }
  return null;
};

const Eventos = () => {
  const [popupMode, setPopupMode] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showRepertorioPopup, setShowRepertorioPopup] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEventos = useMemo(() => {
    const q = String(searchTerm || '')
      .trim()
      .toLowerCase();
    if (!q) return eventos || [];
    return (eventos || []).filter((e) => {
      const nombre = String(e.nombre || '').toLowerCase();
      const lugar = String(e.lugar || '').toLowerCase();
      return nombre.includes(q) || lugar.includes(q);
    });
  }, [eventos, searchTerm]);

  // cargar eventos al iniciar
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventoService.listPendientes();
        setEventos(data);
      } catch (error) {
        console.error('❌ Error al obtener eventos:', error);
      }
    };
    fetchEventos();
  }, []);

  // Abrir y cerrar popups
  const handleOpenPopup = async (mode, evento = null) => {
    if (mode === "editar" && evento) {
      try {
        const full = await eventoService.getById(evento.id);
        setSelectedEvento(full);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el evento para editar.",
          background: "#11103a",
          color: "#E8EAED",
        });
        return;
      }
    } else {
      // Crear → enviamos base vacía
      if (mode === "crear") {
        setSelectedEvento({
          id: null,
          nombre: "",
          descripcion: "",
          fechaInicio: "",
          hora: "",
          lugar: "",
          tipoEvento: "",
          estado: "PENDIENTE",
        });
      } else {
        // Ver/otro caso
        setSelectedEvento(evento);
      }
    }

    setPopupMode(mode);
  };

  const handleOpenRepertorioPopup = (evento) => {
    setSelectedEvento(evento);
    setShowRepertorioPopup(true);
  };

  const handleClosePopup = () => {
    setPopupMode(null);
    setSelectedEvento(null);
  };

  const handleCloseRepertorioPopup = () => {
    setShowRepertorioPopup(false);
    setSelectedEvento(null);
  };

  // Función para manejar la eliminación del evento
  const handleDeleteEvento = (id) => {
    setEventos((prevEventos) =>
      prevEventos.filter((evento) => evento.id !== id)
    );
  };

  const handleRepertorioAssigned = (eventoId, cantidadRepertorios) => {
    setEventos((prev) =>
      prev.map((ev) =>
        ev.id === eventoId ? { ...ev, cantidadRepertorios } : ev
      )
    );
  };

  // Nota: la acción de eliminar se maneja desde ConfirmDeletePopup (onDeleted)

  return (
    <main className="eventos-container">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <div className="abmc-title">
            <h1 className="abmc-title">Eventos</h1>
          </div>
        </header>

        {/* 🔍 Buscador y botón agregar */}
        <div className="eventos-search">
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="eventos-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="eventos-profile">

            <button
              className="abmc-btn abmc-btn-primary"
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

        {/* 🔹 Listado de eventos */}
        <div className="eventos-grid">
          {filteredEventos.map((evento) => {
            const hasRepertorios = (evento.cantidadRepertorios || 0) > 0;
            return (
              <article key={evento.id} className="evento-card">
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="26px"
                    fill="#2e2c2cff"
                  >
                    <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                  </svg>
                  <strong>{evento.nombre}</strong>
                </p>

                <p className="evento-tipo" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {evento.tipoEvento === "ENSAYO" ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="none"
                        stroke="#2e2c2cff"
                        strokeWidth="60"
                      >
                        <path d="M480-360q-33 0-56.5-23.5T400-440v-240q0-33 23.5-56.5T480-760q33 0 56.5 23.5T560-680v240q0 33-23.5 56.5T480-360Zm-40 200v-103q-86-14-143-79t-57-158h80q0 66 47 113t113 47q66 0 113-47t47-113h80q0 93-57 158t-143 79v103h-80Z" />
                      </svg>

                      <span>Ensayo</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#2e2c2cff"
                      >
                        <path d="M560-760v370q0 58-40.5 99T420-250q-59 0-99.5-41T280-390q0-59 40.5-99t99.5-40q23 0 44 7.5t36 20.5v-289h160ZM420-330q25 0 42.5-17.5T480-390q0-25-17.5-42.5T420-450q-25 0-42.5 17.5T360-390q0 25 17.5 42.5T420-330Z" />

                      </svg>

                      <span>Presentación</span>
                    </>
                  )}
                </p>


                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#2e2c2cff"
                  >
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                  </svg>
                  {evento.fechaInicio
                    ? evento.fechaInicio.split("-").reverse().join("/")
                    : ""}

                </p>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#2e2c2cff"
                  >
                    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
                  </svg>
                  {evento.hora ? evento.hora.substring(0, 5) : ""}
                </p>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#2e2c2cff"
                  >
                    <path d="M480-80q-106 0-173-33.5T240-200q0-24 14.5-44.5T295-280l63 59q-9 4-19.5 9T322-200q13 16 60 28t98 12q51 0 98.5-12t60.5-28q-7-8-18-13t-21-9l62-60q28 16 43 36.5t15 45.5q0 53-67 86.5T480-80Zm1-220q99-73 149-146.5T680-594q0-102-65-154t-135-52q-70 0-135 52t-65 154q0 67 49 139.5T481-300Zm-1 100Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z" />
                  </svg>
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
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                  </button>
                  <button
                    className={`evento-btn repertorios redondeado ${hasRepertorios ? 'activo' : ''}`}
                    onClick={() => handleOpenRepertorioPopup(evento)}
                    title="Asignar repertorios"
                    aria-label="Asignar repertorios"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="currentColor"
                    >
                      <path d="M120-200v-520l280-80 320 80 120-40v520l-320 80-280-80-120 40Zm80-60 200 58v-399l-200-59v400Zm280 58 240-60v-401l-240 60v401Zm-280-458 200 58 240-58-200-58-240 58Zm240 58Zm0 401Zm-80-241Z" />
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
              </article>
            );
          })}
        </div>

        {/* 🔸 Popup eliminar */}
        {showDeletePopup && (
          <ConfirmDeletePopup
            evento={selectedEvento}
            onClose={() => setShowDeletePopup(false)}
            onDeleted={handleDeleteEvento} // Actualiza el estado al eliminar
          />
        )}

        {/* 🔸 Popup crear / editar */}
        {popupMode && (
          <PopUpEventos
            modo={popupMode}
            eventoSeleccionado={selectedEvento}
            onClose={handleClosePopup}
            onSave={async (nuevoEvento) => {
              try {
                console.log("🟡 Evento a guardar:", nuevoEvento);

                let createdOrUpdated;

                // ===================================
                // 🔹 CREAR
                // ===================================
                if (popupMode === "crear") {
                  if (nuevoEvento.tipoEvento === "ENSAYO") {
                    createdOrUpdated = await ensayosService.create(nuevoEvento);
                  } else {
                    createdOrUpdated = await presentacionesService.create(nuevoEvento);
                  }
                }

                // ===================================
                // 🔹 EDITAR
                // ===================================
                if (popupMode === "editar") {
                  if (selectedEvento.tipoEvento === "ENSAYO") {
                    createdOrUpdated = await ensayosService.update(selectedEvento.id, nuevoEvento);
                  } else {
                    createdOrUpdated = await presentacionesService.update(selectedEvento.id, nuevoEvento);
                  }
                }

                // ===================================
                // Obtener DTO completo del evento
                // ===================================
                const full = await eventoService.getById(
                  createdOrUpdated.id ?? selectedEvento.id
                );

                // ===================================
                // Actualizar lista
                // ===================================
                // Recargar la lista real desde el backend (solo pendientes)
                const refreshed = await eventoService.listPendientes();
                setEventos(refreshed);


                // ===================================
                // 🔹 Mensaje OK
                // ===================================
                Swal.fire({
                  icon: "success",
                  title:
                    popupMode === "crear"
                      ? "Evento creado"
                      : "Evento actualizado",
                  text:
                    popupMode === "crear"
                      ? "El evento se creó correctamente."
                      : "Los cambios se guardaron correctamente.",
                  timer: 1500,
                  showConfirmButton: false,
                  background: "#11103a",
                  color: "#E8EAED",
                });

                handleClosePopup();
              } catch (error) {
                console.error("❌ Error al guardar el evento:", error);
                const inlineMsg = parseEventoError(error);
                if (inlineMsg) return { errorMessage: inlineMsg };

                Swal.fire({
                  icon: "error",
                  title: "Error al guardar",
                  text: "No se pudo guardar el evento. Intenta nuevamente.",
                  background: "#11103a",
                  color: "#E8EAED",
                });

                return {
                  errorMessage: "No pudimos guardar el evento. Intentá nuevamente.",
                };
              }
            }}

          />
        )}

        {showRepertorioPopup && selectedEvento && (
          <RepertorioPopup
            evento={selectedEvento}
            onClose={handleCloseRepertorioPopup}
            onSaved={handleRepertorioAssigned}
          />
        )}
      </div>
    </main>
  );
};

export default Eventos;