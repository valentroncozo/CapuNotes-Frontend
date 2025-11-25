// src/components/abmc/EntityTableABMC.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import GenericEditPopup from "./GenericEditPopup";
import BackButton from "../common/BackButton";
import TrashIcon from "@/assets/TrashIcon";
import EditIcon from "@/assets/EditIcon";
import "@/styles/abmc.css";
import AddIcon from "@/assets/AddIcon";

// Alerta genérica para registros duplicados
function showDuplicateAlert(uniqueBy) {
  Swal.fire({
    icon: "warning",
    title: "Duplicado",
    text: `Ya existe un registro con ese ${uniqueBy}.`,
    background: "#11103a",
    color: "#E8EAED",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#DE9205",
  });
}

export default function EntityTableABMC({
  title = "Entidad",
  service,
  schema = [],
  uniqueBy = "nombre",
  entityName = "registro",
  showBackButton = true,
  forceOpenCreate = false,
}) {
  const [items, setItems] = useState([]);
  const [nuevo, setNuevo] = useState({});
  const [nuevoError, setNuevoError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  /* -----------------------------------------
     AUTOPEN
  ------------------------------------------*/
  useEffect(() => {
    if (forceOpenCreate) {
      setSelected({});
      setEditOpen(true);
    }
  }, [forceOpenCreate]);

  /* -----------------------------------------
     Cargar lista inicial
  ------------------------------------------*/
  const load = async () => {
    try {
      const data = await service.list();

      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) =>
            (a[uniqueBy] || "").localeCompare(b[uniqueBy] || "", "es", {
              sensitivity: "base",
            })
          )
        : [];

      setItems(sorted);
    } catch (err) {
      console.error("❌ Error al cargar la lista:", err);
      setItems([]);
      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: err?.response?.data || "No se pudieron cargar los datos.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* -----------------------------------------
     Campos obligatorios
  ------------------------------------------*/
  const missingRequiredLabels = (obj) => {
    const labels = [];
    for (const f of schema) {
      if (f.required && !String(obj[f.key] ?? "").trim()) labels.push(f.label);
    }
    return labels;
  };

  const showMissingAlert = (labels) => {
    const list = labels.map((l) => `<li>${l}</li>`).join("");
    Swal.fire({
      icon: "warning",
      title: "Campos obligatorios",
      html: `<p>Completá los campos requeridos:</p><ul style="text-align:left;margin:0 auto;max-width:300px">${list}</ul>`,
      background: "#11103a",
      color: "#E8EAED",
      confirmButtonColor: "#7c83ff",
    });
  };

  /* -----------------------------------------
     Normalizar (para duplicados)
  ------------------------------------------*/
  const normalize = (str) =>
    str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const isDuplicate = (obj) => {
    if (!uniqueBy) return false;

    const nuevo = normalize(obj[uniqueBy]);
    if (!nuevo) return false;

    return items.some((it) => normalize(it[uniqueBy]) === nuevo);
  };

  /* -----------------------------------------
     Guardar nuevo
  ------------------------------------------*/
  const handleAgregar = async (e) => {
    e.preventDefault();

    const missing = missingRequiredLabels(nuevo);
    if (missing.length) return showMissingAlert(missing);

    if (isDuplicate(nuevo)) return showDuplicateAlert(uniqueBy);

    if (entityName.toLowerCase() === "área" && !nuevo.descripcion?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta completar",
        text: "Debés ingresar una descripción para el área.",
        background: "#11103a",
        color: "#E8EAED",
      });
      return;
    }

    try {
      await service.create(nuevo);
      await load();
      setNuevo({});

      Swal.fire({
        icon: "success",
        title: "Creado correctamente",
        text: `${entityName} se creó con éxito.`,
        background: "#11103a",
        color: "#E8EAED",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Error al crear:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "No se pudo crear el registro.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  /* -----------------------------------------
     Eliminar
  ------------------------------------------*/
  const handleEliminar = async (id, displayName) => {
    const femenino = ["cuerda", "área", "audición", "especialidad"];
    const articulo = femenino.includes(entityName.toLowerCase())
      ? entityName.charAt(0).toUpperCase() + entityName.slice(1)
      : entityName;

    const res = await Swal.fire({
      title: `¿Eliminar ${articulo} ${displayName}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#DE9205",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      await service.remove(id);
      await load();
      Swal.fire({
        icon: "success",
        title: `${articulo} eliminado`,
        text: ` "${displayName}" se eliminó correctamente.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `No se puede eliminar ${articulo}`,
        text: "Tiene elementos asociados.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  /* -----------------------------------------
     Guardar edición
  ------------------------------------------*/
  const handleEditSave = async (updated) => {
    const baseValue = updated?.[uniqueBy];
    if (baseValue) {
      const nuevoValor = normalize(updated?.[uniqueBy]);

      const duplicado = items.some(
        (it) => normalize(it?.[uniqueBy]) === nuevoValor && it.id !== updated.id
      );

      if (duplicado) {
        showDuplicateAlert(uniqueBy);
        return false;
      }
    }

    if (!updated.descripcion && entityName.toLowerCase() === "área") {
      Swal.fire({
        icon: "warning",
        title: "Falta completar",
        text: "Debés ingresar una descripción para el área.",
        background: "#11103a",
        color: "#E8EAED",
      });
      return;
    }

    try {
      if (updated?.id) {
        await service.update(updated);
        Swal.fire({
          icon: "success",
          title: "Actualizado correctamente",
          text: `${entityName} se actualizó con éxito.`,
          background: "#11103a",
          color: "#E8EAED",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await service.create(updated);
        Swal.fire({
          icon: "success",
          title: "Creado correctamente",
          text: `${entityName} se creó con éxito.`,
          background: "#11103a",
          color: "#E8EAED",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      await load();
      setSelected(null);
      setEditOpen(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "No se pudo guardar.",
        background: "#11103a",
        color: "#E8EAED",
      });
    }
  };

  /* -----------------------------------------
     Columnas visibles
  ------------------------------------------*/
  const visibleFields = schema.filter(
    (f) => !["button", "submit", "label"].includes(f.type)
  );

  const columnas = visibleFields.map((f) => f.label);

  /* -----------------------------------------
     Filtros y orden
  ------------------------------------------*/
  const filtrados = items
    .filter((i) => {
      if (!filtro) return true;
      return String(i[uniqueBy] ?? "")
        .toLowerCase()
        .includes(filtro.toLowerCase());
    })
    .sort((a, b) =>
      String(a[uniqueBy] ?? "")
        .toLowerCase()
        .localeCompare(String(b[uniqueBy] ?? "").toLowerCase(), "es", {
          sensitivity: "base",
        })
    );

  const displayKey = uniqueBy;

  /* -----------------------------------------
     RENDER
  ------------------------------------------*/
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
        </div>

        {/* TOPBAR */}
        <div className="abmc-topbar" style={{ marginTop: 0 }}>
          {nuevoError && (
            <div style={{ padding: "0 12px", width: "100%" }}>
              <p
                style={{
                  background: "rgba(255,193,7,0.12)",
                  border: "1px solid #DE9205",
                  color: "#DE9205",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  margin: "0 0 8px 0",
                  fontSize: "0.9rem",
                }}
              >
                {nuevoError}
              </p>
            </div>
          )}
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="abmc-input"
          />

          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            onClick={() => {
              setSelected({});
              setEditOpen(true);
            }}
          >
            <AddIcon fill="var(--text-light)" />
          </button>
        </div>

        {/* TABLA */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr>
              {columnas.map((c) => (
                <th key={c}>{c}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length === 0 && (
              <tr className="abmc-row">
                <td colSpan={columnas.length + 1} style={{ textAlign: "center" }}>
                  No hay registros
                </td>
              </tr>
            )}

            {filtrados.map((item) => (
              <tr key={item.id} className="abmc-row">
                {visibleFields.map((f) => (
                  <td key={f.key}>{item[f.key] ?? "—"}</td>
                ))}

                <td>
                  <div className="abmc-actions">
                    <button
                      type="button"
                      className="abmc-btn abmc-btn-icon"
                      title="Editar"
                      onClick={() => {
                        setSelected(item);
                        setEditOpen(true);
                      }}
                    >
                      <EditIcon />
                    </button>

                    <button
                      type="button"
                      className="abmc-btn abmc-btn-icon"
                      title="Eliminar"
                      onClick={() =>
                        handleEliminar(item.id, String(item[displayKey] ?? entityName))
                      }
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {editOpen && (
        <GenericEditPopup
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          entityName={entityName}
          schema={schema}
          entity={selected}
          onSave={handleEditSave}
        />
      )}
    </main>
  );
}
