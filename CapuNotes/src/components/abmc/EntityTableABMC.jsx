// src/components/abmc/EntityTableABMC.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import GenericEditPopup from "./GenericEditPopup";
import BackButton from "../utils/BackButton";
import "../../styles/abmc.css";

/* Iconitos inline (SVG) */
function EditIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
      <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z" fill="currentColor"/>
    </svg>
  );
}
function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7zm3-3h6l1 2H8l1-2z" fill="currentColor"/>
    </svg>
  );
}

export default function EntityTableABMC({
  title = "Entidad",
  service,
  schema = [],
  uniqueBy = "nombre",   // puede ser null/undefined para no chequear duplicados
  entityName = "registro",
  showBackButton = true,
}) {
  const [items, setItems] = useState([]);
  const [nuevo, setNuevo] = useState({});
  const [filtro, setFiltro] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const data = await service.list();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    const missing = missingRequiredLabels(nuevo);
    if (missing.length) return showMissingAlert(missing);

    if (isDuplicate(nuevo)) {
      Swal.fire({
        icon: "warning",
        title: "Duplicado",
        text: `Ya existe un registro con ese ${uniqueBy}.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }

    await service.create(nuevo);
    setNuevo({});
    load();
  };

  const handleEliminar = async (id, displayName) => {
    const res = await Swal.fire({
      title: `¿Eliminar ${displayName}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
    });
    if (!res.isConfirmed) return;
    await service.remove(id);
    load();
  };

  const handleEditSave = async (updated) => {
    await service.update(updated);
    load();
  };

  const columnas = schema.map((f) => f.label);

  const filtrados = items.filter((i) => {
    if (!filtro) return true;
    const q = filtro.toLowerCase();
    return schema.some((f) => String(i[f.key] ?? "").toLowerCase().includes(q));
  });

  const displayKey = uniqueBy || schema[0]?.key;

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
        </div>

        {/* Topbar de alta */}
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
            ) : (
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
            )
          )}
          <button type="submit" className="abmc-btn abmc-btn-primary">
            Agregar
          </button>
        </form>

        {/* Buscar */}
        <div className="abmc-topbar" style={{ marginTop: 0 }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="abmc-input"
            aria-label="Buscar"
          />
        </div>

        {/* Tabla */}
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
                {schema.map((f) => (
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

      {/* Popup genérico estilo AreaEditPopup */}
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
