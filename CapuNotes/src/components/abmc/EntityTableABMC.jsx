// src/components/abmc/EntityTableABMC.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import GenericEditPopup from "./GenericEditPopup";
import BackButton from "../common/BackButton";
import TrashIcon from "@/assets/TrashIcon";
import EditIcon from "@/assets/EditIcon";
import "@/styles/abmc.css";

// Alerta genérica para registros duplicados
function showDuplicateAlert(uniqueBy) {
  Swal.fire({
    icon: "warning",
    title: "Duplicado",
    text: `Ya existe un registro con ese ${uniqueBy}.`,
    background: "#11103a",
    color: "#E8EAED",
    confirmButtonColor: "#7c83ff",
  });
}


export default function EntityTableABMC({
  title = "Entidad",
  service,
  schema = [],
  uniqueBy = "nombre",
  entityName = "registro",
  showBackButton = true,
}) {
  const [items, setItems] = useState([]);
  const [nuevo, setNuevo] = useState({});
  const [filtro, setFiltro] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const data = await service.list();

      // Ordenar alfabéticamente por el campo "nombre"
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) =>
          (a.nombre || "").localeCompare(b.nombre || "", "es", { sensitivity: "base" })
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


  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleChangeNuevo = (e) => {
    const { name, value } = e.target;
    setNuevo((prev) => ({ ...prev, [name]: value }));
  };

  const missingRequiredLabels = (obj) => {
    const labels = [];
    for (const f of schema) {
      if (f.required && !String(obj[f.key] ?? "").trim()) labels.push(f.label);
    }
    return labels;
  };

  const isDuplicate = (obj) => {
    if (!uniqueBy) return false;
    const base = String(obj[uniqueBy] ?? "").trim().toLowerCase();
    if (!base) return false;
    return items.some((it) => String(it[uniqueBy] ?? "").toLowerCase() === base);
  };

  const showMissingAlert = (labels) => {
    const list = labels.map((l) => `<li>${l}</li>`).join("");
    Swal.fire({
      icon: "warning",
      title: "Campos obligatorios",
      html: `<p>Completá los campos requeridos:</p><ul style="text-align:left;margin:0 auto;max-width:300px">${list}</ul>`,
      confirmButtonText: "OK",
      background: "#11103a",
      color: "#E8EAED",
      confirmButtonColor: "#7c83ff",
    });
  };

  const handleAgregar = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios del schema
    const missing = missingRequiredLabels(nuevo);
    if (missing.length) return showMissingAlert(missing);

    // 🔔 Validar duplicado (ya lo tenés)
    if (isDuplicate(nuevo)) {
      showDuplicateAlert(uniqueBy);
      return;
    }

    // ⚠️ Validación extra solo para ÁREA (si falta descripción)
    if (entityName.toLowerCase() === "área" && !nuevo.descripcion?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta completar",
        text: "Debés ingresar una descripción para el área.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }

    try {
      await service.create(nuevo);
      await load();
      setNuevo({});

      // ✅ Aviso de éxito
      Swal.fire({
        icon: "success",
        title: "Creado correctamente",
        text: `${entityName} se creó con éxito.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
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
        confirmButtonColor: "#7c83ff",
      });
    }
  };


  const handleEliminar = async (id, displayName) => {
    // 🔠 Detectar género de la entidad
    const femenino = ["cuerda", "área", "audición", "especialidad"]; // podés agregar más si querés
    const articulo = femenino.includes(entityName.toLowerCase()) ? entityName.charAt(0).toUpperCase() + entityName.slice(1).toLowerCase() : entityName;

    // 🔔 Confirmación antes de borrar
    const res = await Swal.fire({
      title: `¿Eliminar ${articulo} ${displayName}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true, // 👉 mantiene Cancelar a la izquierda
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      await service.remove(id);
      await load();

      // ✅ Aviso de éxito al eliminar
      Swal.fire({
        icon: "success",
        title: `${articulo} eliminad${femenino.includes(entityName.toLowerCase()) ? "a" : "o"}`,
        text: `${articulo} "${displayName}" se eliminó correctamente.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#11103a",
        color: "#E8EAED",
      });
    } catch (err) {
      console.error("❌ Error al eliminar:", err);

      Swal.fire({
        icon: "error",
        title: `No se puede eliminar ${articulo}`,
        text: "Tiene elementos asociados o un error impide eliminarlo.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        reverseButtons: true,
      });
    }
  };

  const handleEditSave = async (updated) => {
    // 🔹 Validar duplicado (si aplica)
    if (uniqueBy && Array.isArray(items)) {
      const baseValue = updated?.[uniqueBy];

      if (baseValue) {
        const base = String(baseValue).trim().toLowerCase();

        const duplicado = items.some(
          (it) =>
            String(it?.[uniqueBy] ?? "").trim().toLowerCase() === base &&
            it.id !== updated.id
        );

        if (duplicado) {
          showDuplicateAlert(uniqueBy);
          return;
        }
      }
    }

    try {
      await service.update(updated);
      await load();

      // ✅ Aviso de éxito
      Swal.fire({
        icon: "success",
        title: "Actualizado correctamente",
        text: `${entityName} se actualizó con éxito.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Error al actualizar:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "No se pudo actualizar el registro.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };


  // Campos visibles en la tabla (excluir controles: button, submit, label)
  const visibleFields = schema.filter(
    (f) => !["button", "submit", "label"].includes(f.type)
  );

  const columnas = visibleFields.map((f) => f.label);

  // Filtrado y orden alfabético
  const filtrados = items
    .filter((i) => {
      if (!filtro) return true;
      const q = filtro.toLowerCase();
      return visibleFields.some((f) =>
        String(i[f.key] ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const campo = uniqueBy || visibleFields[0]?.key;
      const textoA = String(a[campo] ?? "").toLowerCase();
      const textoB = String(b[campo] ?? "").toLowerCase();
      return textoA.localeCompare(textoB, "es", { sensitivity: "base" });
    });

  const displayKey = uniqueBy || schema[0]?.key;

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title" style={{ fontSize: "1.5rem" }}>{title}</h1>
        </div>

        <form className="abmc-topbar" onSubmit={handleAgregar}>
          {schema.map((f) =>
            f.type === "select" ? (
              <select
                key={f.key}
                name={f.key}
                value={nuevo[f.key] || ""}
                onChange={handleChangeNuevo}
                className="abmc-select"
                aria-label={f.label}
              >
                <option value="">{f.label}</option>
                {(f.options || []).map((opt) => {
                  const value = opt.value ?? opt;
                  const label = opt.label ?? opt;
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : f.type === "text" ? (
              <input
                key={f.key}
                type={f.type || "text"}
                name={f.key}
                placeholder={f.label}
                value={nuevo[f.key] || ""}
                onChange={handleChangeNuevo}
                className="abmc-input"
                aria-label={f.label}
              />
            ) : f.type === "button" ? (
              <button
                key={f.key}
                type="button"
                onClick={f.handler}
                className={`abmc-btn abmc-btn-${f.key}`}
              >
                {f.label}
              </button>
            ) : f.type === "submit" ? (
              <button
                key={f.key}
                type="submit"
                className="abmc-btn abmc-btn-primary"
                aria-label="Agregar nuevo registro"
              >
                <span className="material-icons">+</span>
              </button>
            ) : f.type === "label" ? (
              <label key={f.key} className="abmc-label">{f.label}</label>
            ) : null
          )}
        </form>

        {/* Subtítulos específicos para entidades */}
        {entityName.toLowerCase() === "cuerda" && (
          <h2 className="abmc-subtitle" style={{ fontSize: "1.5rem" }}>Cuerdas registradas</h2>
        )}
        {entityName.toLowerCase() === "área" && (
          <h2 className="abmc-subtitle" style={{ fontSize: "1.5rem" }}>Áreas registradas</h2>
        )}

        <div className="abmc-topbar" style={{ marginTop: 0 }}>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="abmc-input"
            aria-label="Buscar por nombre"
          />
        </div>

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
                      aria-label="Editar"
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
                      aria-label="Eliminar"
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
