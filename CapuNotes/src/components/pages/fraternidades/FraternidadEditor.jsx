import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Eye, PlusCircle, Trash } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import miembrosService from "@/services/miembrosService";
import PopUpVerMiembro from "@/components/pages/miembros/popUpVerMiembro";
import Loader from "@/components/common/Loader";

import "@/styles/repertorios.css";
import "@/styles/fraternidades.css";


const DROPPABLE_AVAILABLE = "available";
const DROPPABLE_SELECTED = "selected";

const memberKey = (member = {}) => {
  const tipo =
    (member.id?.tipoDocumento || member.tipoDocumento || "DNI").toUpperCase();
  const nro = member.id?.nroDocumento || member.nroDocumento || "";
  if (!nro) return null;
  return `${tipo}-${nro}`;
};

const normalizeMembers = (list = []) => {
  const map = new Map();
  list.forEach((member) => {
    const key = memberKey(member);
    if (!key) return;
    map.set(key, {
      ...member,
      id: {
        tipoDocumento: (
          member.id?.tipoDocumento ||
          member.tipoDocumento ||
          "DNI"
        ).toUpperCase(),
        nroDocumento: member.id?.nroDocumento || member.nroDocumento || "",
      },
      nombre: member.nombre || "",
      apellido: member.apellido || "",
      area: member.area || member.areaNombre || null,
      cuerda: member.cuerda || member.cuerdaNombre || null,
    });
  });
  return Array.from(map.values());
};

export default function FraternidadEditor({
  mode = "create",
  initialData,
  availableMembers = [],
  areas = [],
  cuerdas = [],
  onSubmit,
  onCancel,
}) {
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [selected, setSelected] = useState(
    normalizeMembers(initialData?.miembros || [])
  );
  const [available, setAvailable] = useState(normalizeMembers(availableMembers));
  const [filters, setFilters] = useState({ area: "", cuerda: "" });
  const [search, setSearch] = useState("");
  const [detalleMiembro, setDetalleMiembro] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const normalizedSelected = normalizeMembers(initialData?.miembros || []);
    const takenKeys = new Set(
      normalizedSelected.map((m) => memberKey(m))
    );
    const normalizedAvailable = normalizeMembers(availableMembers).filter(
      (m) => !takenKeys.has(memberKey(m))
    );
    setNombre(initialData?.nombre || "");
    setSelected(normalizedSelected);
    setAvailable(normalizedAvailable);
    setLoading(false); //apagar loader
  }, [initialData, availableMembers]);

  const filteredAvailable = useMemo(() => {
    const areaId = filters.area ? Number(filters.area) : null;
    const cuerdaId = filters.cuerda ? Number(filters.cuerda) : null;
    const term = search.trim().toLowerCase();

    return available
      .filter((member) => {
        if (!areaId) return true;
        return Number(member.areaId) === areaId;
      })
      .filter((member) => {
        if (!cuerdaId) return true;
        return Number(member.cuerdaId ?? member.cuerda?.id) === cuerdaId;
      })
      .filter((member) => {
        if (!term) return true;
        const full = `${member.apellido || ""} ${member.nombre || ""
          }`.toLowerCase();
        return full.includes(term);
      })
      .sort((a, b) =>
        `${a.apellido || ""} ${a.nombre || ""}`.localeCompare(
          `${b.apellido || ""} ${b.nombre || ""}`,
          "es",
          { sensitivity: "base" }
        )
      );
  }, [available, filters, search]);

  const handleAdd = (member) => {
    const key = memberKey(member);
    if (!key) return;
    setSelected((prev) => normalizeMembers([...prev, member]));
    setAvailable((prev) =>
      prev.filter((m) => memberKey(m) !== key)
    );
  };

  const handleRemove = (member) => {
    const key = memberKey(member);
    if (!key) return;
    setSelected((prev) =>
      prev.filter((m) => memberKey(m) !== key)
    );
    setAvailable((prev) => normalizeMembers([...prev, member]));
  };

  const handleClearSelected = () => {
    if (!selected.length) return;
    setAvailable((prev) =>
      normalizeMembers([...prev, ...selected])
    );
    setSelected([]);
  };

  const handleRandom = async () => {
    if (!available.length) {
      Swal.fire({
        icon: "info",
        title: "No hay miembros disponibles",
        text: "Todos los miembros ya fueron seleccionados.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#DE9205",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Generar fraternidad aleatoria",
      text: "Ingresa cuántos miembros querés sumar.",
      input: "number",
      inputAttributes: {
        min: 1,
        max: available.length,
        step: 1,
      },
      inputValue: Math.min(
        available.length,
        Math.max(1, selected.length || 1)
      ),
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#de9205",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Generar",
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!result.isConfirmed) return;
    const cantidad = parseInt(result.value, 10);
    if (Number.isNaN(cantidad) || cantidad < 1) return;
    if (cantidad > available.length) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "No hay suficientes miembros disponibles.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#DE9205",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const pool = [...available];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const escogidos = pool.slice(0, cantidad);
    const escogidosKeys = new Set(
      escogidos.map((m) => memberKey(m))
    );

    setSelected((prev) =>
      normalizeMembers([...prev, ...escogidos])
    );
    setAvailable((prev) =>
      prev.filter((m) => !escogidosKeys.has(memberKey(m)))
    );
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
      setSelected((prev) => {
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
      const key = draggableId.replace("available-", "");
      const member =
        filteredAvailable.find((m) => memberKey(m) === key) ||
        available.find((m) => memberKey(m) === key);
      if (member) handleAdd(member);
      return;
    }

    if (
      source.droppableId === DROPPABLE_SELECTED &&
      destination.droppableId === DROPPABLE_AVAILABLE
    ) {
      const key = draggableId.replace("selected-", "");
      const member = selected.find((m) => memberKey(m) === key);
      if (member) handleRemove(member);
    }
  };

  const showValidation = (message) => {
    Swal.fire({
      icon: "warning",
      title: "Falta información",
      text: message,
      background: "#11103a",
      color: "#E8EAED",
    });
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      showValidation("Ingresá un nombre para la fraternidad.");
      return;
    }
    if (selected.length === 0) {
      showValidation("Seleccioná al menos un miembro.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit?.({
        nombre: nombre.trim(),
        miembros: selected,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewMember = async (member) => {
    try {
      const data = await miembrosService.getById(
        member.id?.nroDocumento || member.nroDocumento,
        member.id?.tipoDocumento || member.tipoDocumento || "DNI"
      );
      setDetalleMiembro(data);
    } catch (err) {
      console.error("❌ Error al cargar miembro", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo cargar el miembro",
        text: err?.response?.data || "Intentá más tarde.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  const availableLabel = filteredAvailable.length
    ? `${filteredAvailable.length} miembro(s) disponibles`
    : "No hay miembros con esos filtros.";

  if (loading) {
    return (
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "4rem"
      }}>
        <Loader />
      </div>
    );
  }


  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* ACÁ EMPIEZA TU UI COMPLETA — NO LA TOQUÉ EN NADA */}

        <section className="repertorio-editor fraternidad-editor">
          <div className="repertorio-dual-container">
            {/* ===========================================================
                PANEL DE DISPONIBLES
            =========================================================== */}
            <section className="canciones-panel">
              <div className="repertorio-panel-header">
                <h4 className="repertorio-form-title">Miembros disponibles</h4>
              </div>

              <div className="search-row search-row-full">
                <input
                  type="text"
                  placeholder="Buscar por nombre o apellido"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="abmc-input repertorio-search-input"
                />
              </div>

              <div className="repertorio-filters-row">
                <select
                  className="abmc-select repertorio-filter-select"
                  value={filters.area}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      area: e.target.value,
                    }))
                  }
                >
                  <option value="">Todas las áreas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>

                <select
                  className="abmc-select repertorio-filter-select"
                  value={filters.cuerda}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      cuerda: e.target.value,
                    }))
                  }
                >
                  <option value="">Todas las cuerdas</option>
                  {cuerdas.map((cuerda) => (
                    <option
                      key={cuerda.id}
                      value={cuerda.id}
                    >
                      {cuerda.name || cuerda.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="available-grid">
                <span>Miembro</span>
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
                      <p className="repertorio-subtitle">
                        {availableLabel}
                      </p>

                      {filteredAvailable.length ? (
                        filteredAvailable.map((member, index) => {
                          const key = memberKey(member);
                          return (
                            <Draggable
                              key={`available-${key}`}
                              draggableId={`available-${key}`}
                              index={index}
                            >
                              {(dragProvided, snapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className={`available-row available-grid ${snapshot.isDragging ? "dragging" : ""
                                    }`}
                                >
                                  <span className="fraternidad-member-line">
                                    {member.apellido}, {member.nombre}
                                    <span className="fraternidad-member-subtitle">
                                      {member.cuerda || "Sin cuerda"} ·{" "}
                                      {member.area || "Sin área"}
                                    </span>
                                  </span>

                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "0.25rem",
                                    }}
                                  >


                                    <button
                                      className="abmc-btn abmc-btn-secondary"
                                      onClick={() =>
                                        handleViewMember(member)
                                      }
                                    >
                                      <Eye size={16} />
                                    </button>

                                    <button
                                      type="button"
                                      className="abmc-btn abmc-btn-primary"
                                      onClick={() => handleAdd(member)}
                                    >
                                      <PlusCircle size={16} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <div className="list-empty">
                          Sin miembros para mostrar.
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </section>

            {/* ===========================================================
                PANEL DE SELECCIONADOS
            =========================================================== */}
            <section className="repertorio-panel">
              <div className="repertorio-panel-header">
                <h4 className="repertorio-form-title">Fraternidad</h4>

                <div className="fraternidad-panel-actions">

                </div>
              </div>

              <div className="repertorio-form-row">
                <label className="repertorio-form-title">
                  Nombre de la fraternidad
                </label>
                <input
                  className="abmc-input"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />


              </div>
              <div className="fraternidad-buttons-row">
                <button
                  type="button"
                  className="abmc-btn abmc-btn-secondary"
                  onClick={handleClearSelected}
                  disabled={selected.length === 0}
                >
                  Quitar todos
                </button>


                <button
                  type="button"
                  className="abmc-btn abmc-btn-secondary"
                  onClick={handleRandom}
                >
                  Generar aleatoria
                </button>
              </div>


              <div className="repertorio-header grid">
                <span className="order">#</span>
                <span>Miembro</span>
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
                      {selected.length ? (
                        selected.map((member, index) => {
                          const key = memberKey(member);

                          return (
                            <Draggable
                              key={`selected-${key}`}
                              draggableId={`selected-${key}`}
                              index={index}
                            >
                              {(dragProvided, snapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className={`draggable-item ${snapshot.isDragging ? "dragging" : ""
                                    }`}
                                >
                                  <span className="order">
                                    {index + 1}
                                  </span>

                                  <span className="fraternidad-member-line">
                                    {member.apellido}, {member.nombre}
                                    <span className="fraternidad-member-subtitle">
                                      {member.cuerda ||
                                        "Sin cuerda"}{" "}
                                      ·{" "}
                                      {member.area || "Sin área"}
                                    </span>
                                  </span>

                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "0.25rem",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="abmc-btn abmc-btn-secondary"
                                      onClick={() =>
                                        handleViewMember(member)
                                      }
                                    >
                                      <Eye size={16} />
                                    </button>

                                    <button
                                      type="button"
                                      className="abmc-btn abmc-btn-secondary"
                                      onClick={() =>
                                        handleRemove(member)
                                      }
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
                          No agregaste miembros a la fraternidad aún.
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
              {mode === "create"
                ? "Crear fraternidad"
                : "Guardar cambios"}
            </button>
          </div>
        </section>
      </DragDropContext>

      {/* ====================================================================
          POPUP DE MIEMBRO — FUNCIONA PERFECTO
      ==================================================================== */}
      {detalleMiembro && (
        <PopUpVerMiembro
          isOpen={Boolean(detalleMiembro)}
          onClose={() => setDetalleMiembro(null)}
          miembro={detalleMiembro}
        />
      )}
    </>
  );
}
