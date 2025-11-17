import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import BackButton from "../common/BackButton";
import GenericEditPopup from "./GenericEditPopup";
import AddIcon from "@/assets/AddIcon";
import EditIcon from "@/assets/EditIcon";
import TrashIcon from "@/assets/TrashIcon";
import { CheckCircleFill } from "react-bootstrap-icons";
import "@/styles/abmc.css";

const femenino = ["cuerda", "área", "audición", "especialidad"];

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

export default function EntityABMCSimple({
  title = "Entidad",
  service,
  schema = [],
  uniqueBy = "nombre",
  entityName = "registro",
  showBackButton = true,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await service.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al cargar la lista:", err);
      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: err?.response?.data || "No se pudieron cargar los datos.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleFields = schema.filter(
    (f) => !["button", "submit", "label"].includes(f.type)
  );

  const displayKey = uniqueBy || visibleFields[0]?.key;

  const handleEditSave = async (updated) => {
    if (!updated) return;

    const missing = visibleFields
      .filter((f) => f.required)
      .filter((f) => !String(updated[f.key] ?? "").trim())
      .map((f) => f.label);

    if (missing.length) {
      const list = missing.map((l) => `<li>${l}</li>`).join("");
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        html: `<p>Completá los campos requeridos:</p><ul style="text-align:left;margin:0 auto;max-width:300px">${list}</ul>`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
      return;
    }

    if (uniqueBy) {
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
      if (updated.id) {
        await service.update(updated);
        Swal.fire({
          icon: "success",
          title: "Actualizado correctamente",
          text: `${entityName} actualizado con éxito.`,
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await service.create(updated);
        Swal.fire({
          icon: "success",
          title: "Creado correctamente",
          text: `${entityName} creado con éxito.`,
          background: "#11103a",
          color: "#E8EAED",
          confirmButtonColor: "#7c83ff",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      await load();
      setEditOpen(false);
      setSelected(null);
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "No se pudo guardar el registro.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const handleEliminar = async (item) => {
    const articulo =
      femenino.includes(entityName.toLowerCase())
        ? entityName.charAt(0).toUpperCase() + entityName.slice(1).toLowerCase()
        : entityName;

    const res = await Swal.fire({
      title: `¿Eliminar ${articulo} ${item[displayKey] || ""}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DE9205",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      await service.remove(item.id);
      await load();
      Swal.fire({
        icon: "success",
        title: `${articulo} eliminado`,
        text: `${item[displayKey] || entityName} fue inhabilitado.`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "No se pudo eliminar el registro.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const handleReactivar = async (item) => {
    const articulo =
      femenino.includes(entityName.toLowerCase())
        ? entityName.charAt(0).toUpperCase() + entityName.slice(1).toLowerCase()
        : entityName;

    const res = await Swal.fire({
      title: `¿Reactivar ${articulo} ${item[displayKey] || ""}?`,
      text: "El registro volverá a estar activo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, reactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#11103a",
      color: "#E8EAED",
    });

    if (!res.isConfirmed) return;

    try {
      await service.reactivar(item.id);
      await load();
      Swal.fire({
        icon: "success",
        title: `${articulo} reactivado`,
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Error al reactivar:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data || "No se pudo reactivar el registro.",
        background: "#11103a",
        color: "#E8EAED",
        confirmButtonColor: "#7c83ff",
      });
    }
  };

  const filteredActive = useMemo(() => {
    const q = (filtro || "").toLowerCase().trim();
    return items
      .filter((item) => item.activo !== false)
      .filter((item) => {
        if (!q) return true;
        return visibleFields.some((f) =>
          String(item[f.key] ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
  }, [filtro, items, visibleFields]);

  const inactiveItems = items.filter((item) => item.activo === false);

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
        </div>

        <div className="abmc-topbar" style={{ marginTop: 0 }}>
          <input
            type="text"
            className="abmc-input"
            placeholder="Buscar"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
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

        <table className="abmc-table abmc-table-rect abmc-table--aligned">
          <thead className="abmc-thead">
            <tr>
              {visibleFields.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={visibleFields.length + 1} style={{ textAlign: "center" }}>
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && filteredActive.length === 0 && (
              <tr>
                <td
                  colSpan={visibleFields.length + 1}
                  style={{ textAlign: "center" }}
                >
                  No hay registros activos.
                </td>
              </tr>
            )}
            {!loading &&
              filteredActive.map((item) => (
                <tr key={item.id}>
                  {visibleFields.map((f) => (
                    <td key={`${item.id}-${f.key}`}>{item[f.key] ?? "—"}</td>
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
                        onClick={() => handleEliminar(item)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {inactiveItems.length > 0 && (
          <section style={{ marginTop: "2rem" }}>
            <h3>Registros inactivos</h3>
            <table className="abmc-table abmc-table-rect abmc-table--aligned">
              <thead className="abmc-thead">
                <tr>
                  {visibleFields.map((f) => (
                    <th key={`inactive-${f.key}`}>{f.label}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inactiveItems.map((item) => (
                  <tr key={`inactive-${item.id}`}>
                    {visibleFields.map((f) => (
                      <td key={`inactive-${item.id}-${f.key}`}>{item[f.key] ?? "—"}</td>
                    ))}
                    <td>
                    <button
                      type="button"
                      className="abmc-btn abmc-btn-icon"
                      title="Reactivar"
                      onClick={() => handleReactivar(item)}
                    >
                      <CheckCircleFill />
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
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
