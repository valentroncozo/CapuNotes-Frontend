import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Eye, PlusCircle, Trash } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import CancionModal from "@/components/pages/canciones/CancionModal";
import "@/styles/repertorios.css";

const EMPTY_FILTERS = {
  texto: "",
  categoria: "",
  tiempo: "",
};

const DROPPABLE_AVAILABLE = "available";
const DROPPABLE_SELECTED = "selected";

export default function RepertorioEditor({
  mode = "create",
  initialData,
  availableSongs = [],
  categorias = [],
  tiempos = [],
  onSubmit,
  onCancel,
}) {
  const [nombre, setNombre] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [detalleCancion, setDetalleCancion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const fallbackName = initialData.id ? `Repertorio -${initialData.id}-` : "";
      setNombre(initialData.nombre || fallbackName);
      setSelectedSongs(
        (initialData.canciones || []).map((c, index) => {
          const baseId = Number(c.cancionId ?? c.id);
          const found = availableSongs.find((song) => Number(song.id) === baseId);
          return {
            ...(found || {}),
            id: baseId,
            titulo: found?.titulo || c.titulo,
            orden: c.orden ?? index + 1,
          };
        })
      );
    } else {
      const fallbackName = initialData?.id ? `Repertorio -${initialData.id}-` : "";
      setNombre(fallbackName);
      setSelectedSongs([]);
    }
    setFilters(EMPTY_FILTERS);
    setDetalleCancion(null);
  }, [initialData, mode, availableSongs]);

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

  const handleDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (
      source.droppableId === DROPPABLE_SELECTED &&
      destination.droppableId === DROPPABLE_SELECTED
    ) {
      setSelectedSongs((prev) => {
        const updated = Array.from(prev);
        const [moved] = updated.splice(source.index, 1);
        updated.splice(destination.index, 0, moved);
        return updated;
      });
      return;
    }

    if (
      source.droppableId === DROPPABLE_AVAILABLE &&
      destination.droppableId === DROPPABLE_SELECTED
    ) {
      const songId = draggableId.replace("available-", "");
      const song =
        filteredAvailable.find((song) => String(song.id) === songId) ||
        availableSongs.find((song) => String(song.id) === songId);
      if (song && !selectedSongs.some((sel) => String(sel.id) === songId)) {
        setSelectedSongs((prev) => [...prev, song]);
      }
      return;
    }

    if (
      source.droppableId === DROPPABLE_SELECTED &&
      destination.droppableId === DROPPABLE_AVAILABLE
    ) {
      const songId = draggableId.replace("sel-", "");
      setSelectedSongs((prev) =>
        prev.filter((song) => String(song.id) !== songId)
      );
    }
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
      title: mode === "create" ? "Agregar repertorio" : "Actualizar repertorio",
      text:
        mode === "create"
          ? "Se agregará el nuevo repertorio con las canciones seleccionadas."
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <section className="repertorio-editor">
          <div className="repertorio-dual-container">
          <section className="canciones-panel">
            <div className="repertorio-panel-header">
              <h4 className="repertorio-form-title">Canciones disponibles</h4>
              <div className="search-row search-row-full">
                <input
                  type="text"
                  placeholder="Buscar por título"
                  value={filters.texto}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, texto: e.target.value }))
                  }
                  className="abmc-input repertorio-search-input"
                />
              </div>
              <div className="repertorio-filters-row">
                <select
                  className="abmc-select repertorio-filter-select"
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
                  className="abmc-select repertorio-filter-select"
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
            <div className="panel-scroll">
              <Droppable droppableId={DROPPABLE_AVAILABLE}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="available-list"
                  >
                    <p className="repertorio-subtitle">{availableLabel}</p>
                    {filteredAvailable.length ? (
                      filteredAvailable.map((song, index) => (
                        <Draggable
                          key={`available-${song.id}`}
                          draggableId={`available-${song.id}`}
                          index={index}
                        >
                          {(dragProvided, snapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`available-row available-grid ${
                                snapshot.isDragging ? "dragging" : ""
                              }`}
                            >
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
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="list-empty">Sin canciones para mostrar.</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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

            <div className="panel-scroll">
              <Droppable droppableId={DROPPABLE_SELECTED}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="repertorio-list"
                  >
                    {selectedSongs.length ? (
                      selectedSongs.map((song, index) => {
                        const draggableKey = `sel-${song.id}`;
                        return (
                          <Draggable
                            key={draggableKey}
                            draggableId={draggableKey}
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
                                <div style={{ display: "flex", gap: "0.25rem" }}>
                                  <button
                                    type="button"
                                    className="abmc-btn abmc-btn-secondary"
                                    onClick={() => setDetalleCancion(song)}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="abmc-btn abmc-btn-secondary"
                                    onClick={() => handleRemoveSong(song.id)}
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      <div className="repertorio-empty">
                        No agregaste canciones al repertorio aún.
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </section>
        </div>
        <div className="repertorio-footer">
          <button
            type="button"
            className="abmc-btn abmc-btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {mode === "create" ? "Agregar repertorio" : "Guardar cambios"}
          </button>
        </div>
      </section>
      </DragDropContext>

      <CancionModal
        isOpen={Boolean(detalleCancion)}
        onClose={() => setDetalleCancion(null)}
        mode="view"
        initialData={detalleCancion}
        categorias={categorias}
        tiempos={tiempos}
      />
    </>
  );
}
