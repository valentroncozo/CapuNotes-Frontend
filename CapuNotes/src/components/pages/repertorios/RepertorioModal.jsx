import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Eye, PlusCircle, Trash } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import Modal from "@/components/common/Modal";
import "@/styles/repertorios.css";

const EMPTY_FILTERS = {
  texto: "",
  categoria: "",
  tiempo: "",
};

export default function RepertorioModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
  availableSongs = [],
  categorias = [],
  tiempos = [],
}) {
  const [nombre, setNombre] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [detalleCancion, setDetalleCancion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialData) {
      setNombre(initialData.nombre || "");
      setSelectedSongs(
        (initialData.canciones || []).map((c) => ({
          ...c,
        }))
      );
    } else {
      setNombre("");
      setSelectedSongs([]);
    }
    setFilters(EMPTY_FILTERS);
    setDetalleCancion(null);
  }, [initialData, isOpen, mode]);

  const selectedIds = useMemo(
    () => selectedSongs.map((song) => Number(song.id)),
    [selectedSongs]
  );

  const filteredAvailable = useMemo(() => {
    const texto = filters.texto.trim().toLowerCase();
    const categoriaId = filters.categoria ? Number(filters.categoria) : null;
    const tiempoId = filters.tiempo ? Number(filters.tiempo) : null;

    return (availableSongs || [])
      .filter((song) => song.activo !== false)
      .filter((song) => !selectedIds.includes(Number(song.id)))
      .filter((song) => {
        if (!texto) return true;
        return song.titulo?.toLowerCase().includes(texto);
      })
      .filter((song) => {
        if (!categoriaId) return true;
        return Array.isArray(song.categoriaIds)
          ? song.categoriaIds.map(Number).includes(categoriaId)
          : false;
      })
      .filter((song) => {
        if (!tiempoId) return true;
        return Array.isArray(song.tiempoLiturgicoIds)
          ? song.tiempoLiturgicoIds.map(Number).includes(tiempoId)
          : false;
      });
  }, [availableSongs, filters, selectedIds]);

  const handleAddSong = (song) => {
    setSelectedSongs((prev) => [...prev, song]);
  };

  const handleRemoveSong = (id) => {
    setSelectedSongs((prev) => prev.filter((song) => Number(song.id) !== Number(id)));
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;
    const updated = Array.from(selectedSongs);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setSelectedSongs(updated);
  };

  const showValidation = (message) => {
    Swal.fire({
      icon: "warning",
      title: "Falta información",
      text: message,
      background: "#11103a",
      color: "#E8EAED",
      confirmButtonColor: "#7c83ff",
    });
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      showValidation("Debés ingresar un nombre para el repertorio.");
      return;
    }
    if (!selectedSongs.length) {
      showValidation("Agregá al menos una canción.");
      return;
    }

    const confirm = await Swal.fire({
      title: mode === "create" ? "Crear repertorio" : "Actualizar repertorio",
      text:
        mode === "create"
          ? "Se guardará el nuevo repertorio con las canciones seleccionadas."
          : "Se actualizará el repertorio y su orden de canciones.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);
    try {
      await onSubmit(mode, {
        nombre: nombre.trim(),
        cancionesIds: selectedSongs.map((song) => song.id),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableLabel = filteredAvailable.length
    ? `${filteredAvailable.length} canción(es) disponibles`
    : "No hay canciones disponibles con esos filtros.";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === "create" ? "Crear Repertorio" : "Editar Repertorio"}
      >
        <div className="repertorio-modal">
          <div className="repertorio-modal-body">
            <div className="repertorio-dual-container">
              <section className="canciones-panel">
                <div className="repertorio-panel-header">
                  <h4 className="repertorio-form-title">Canciones disponibles</h4>
                  <div className="search-row">
                    <input
                      type="text"
                      placeholder="Buscar por título"
                      value={filters.texto}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, texto: e.target.value }))
                      }
                      className="abmc-input"
                    />
                    <select
                      className="abmc-select"
                      value={filters.categoria}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, categoria: e.target.value }))
                      }
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <select
                      className="abmc-select"
                      value={filters.tiempo}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, tiempo: e.target.value }))
                      }
                    >
                      <option value="">Todos los tiempos</option>
                      {tiempos.map((tiempo) => (
                        <option key={tiempo.id} value={tiempo.id}>
                          {tiempo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="available-grid repertorio-header grid">
                  <span>Título</span>
                  <span className="actions-label">Acciones</span>
                </div>
                <div className="panel-scroll available-list">
                  <p className="repertorio-subtitle">{availableLabel}</p>
                  {filteredAvailable.length ? (
                    filteredAvailable.map((song) => (
                      <div key={`av-${song.id}`} className="available-row available-grid">
                        <span>{song.titulo}</span>
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            type="button"
                            className="abmc-btn abmc-btn-primary"
                            onClick={() => handleAddSong(song)}
                          >
                            <PlusCircle size={16} />
                          </button>
                          <button
                            type="button"
                            className="abmc-btn abmc-btn-secondary"
                            onClick={() => setDetalleCancion(song)}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="list-empty">Sin canciones para mostrar.</div>
                  )}
                </div>
              </section>

              <section className="repertorio-panel">
                <div className="repertorio-panel-header">
                  <h4 className="repertorio-form-title">Repertorio seleccionado</h4>
                  <button
                    type="button"
                    className="abmc-btn abmc-btn-secondary"
                    onClick={() => setSelectedSongs([])}
                  >
                    Quitar todas
                  </button>
                </div>
                <div className="repertorio-form-row">
                  <label className="repertorio-form-title">Nombre del repertorio</label>
                  <input
                    className="abmc-input"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="repertorio-header grid">
                  <span className="order">Ord.</span>
                  <span>Título</span>
                  <span className="actions-label">Acciones</span>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="repertorio-selected">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="panel-scroll repertorio-list"
                      >
                        {selectedSongs.length ? (
                          selectedSongs.map((song, index) => (
                            <Draggable
                              key={`sel-${song.id}-${index}`}
                              draggableId={`sel-${song.id}`}
                              index={index}
                            >
                              {(draggableProvided, snapshot) => (
                                <div
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  className={`draggable-item ${
                                    snapshot.isDragging ? "dragging" : ""
                                  }`}
                                >
                                  <span className="order">{index + 1}</span>
                                  <span>{song.titulo}</span>
                                  <button
                                    type="button"
                                    className="abmc-btn abmc-btn-secondary"
                                    onClick={() => handleRemoveSong(song.id)}
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="repertorio-empty">
                            No agregaste canciones al repertorio aún.
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </section>
            </div>
            <div className="repertorio-footer">
              <button
                type="button"
                className="abmc-btn abmc-btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="abmc-btn abmc-btn-primary"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {mode === "create" ? "Crear repertorio" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <CancionDetalleModal
        isOpen={Boolean(detalleCancion)}
        onClose={() => setDetalleCancion(null)}
        cancion={detalleCancion}
      />
    </>
  );
}

function CancionDetalleModal({ isOpen, onClose, cancion }) {
  if (!cancion) return null;
  const categorias = (cancion.categoriasNombres || []).join(", ");
  const tiempos = (cancion.tiemposLiturgicosNombres || []).join(", ");
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={cancion.titulo}>
      <div className="repertorio-modal">
        <div className="repertorio-modal-body">
          <div className="repertorio-panel">
            <p>
              <strong>Letra:</strong>
            </p>
            <p style={{ whiteSpace: "pre-line" }}>{cancion.letra || "—"}</p>
            <p>
              <strong>Arreglo:</strong> {cancion.arregloUrl || "—"}
            </p>
            <p>
              <strong>Categorías:</strong> {categorias || "—"}
            </p>
            <p>
              <strong>Tiempos litúrgicos:</strong> {tiempos || "—"}
            </p>
            <p>
              <strong>Activo:</strong> {cancion.activo ? "Sí" : "No"}
            </p>
          </div>
          <div className="repertorio-footer">
            <button
              type="button"
              className="abmc-btn abmc-btn-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
