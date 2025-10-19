import { useEffect, useMemo, useState } from "react";
import BackButton from "../common/BackButton";
import { PencilFill, Trash3Fill, PlusLg } from "react-bootstrap-icons";
import EntityEditForm from "./EntityEditForm.jsx";
import "@/styles/abmc.css";

// ALERTAS unificadas
import { success, error, confirmDelete } from "@/utils/alerts.js";

export default function EntityTableABMC({
  title = "Catálogo",
  service,
  schema = [],
  entityName = "elemento",
  showBackButton = true,
  usePopupForm = true,
  sortable = false,
  onAdd = null,
  renderActions,
}) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Orden
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await service.list();
        if (mounted) setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) {
          setItems([]);
          error({ title: "Error al cargar", text: e?.message || "No se pudo obtener la lista." });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [service]);

  const formFields = useMemo(
    () => schema.filter((f) => f.type !== "submit" && f.type !== "button"),
    [schema]
  );
  const tableFields = useMemo(() => formFields.filter((f) => f.table !== false), [formFields]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const t = q.toLowerCase();
    return items.filter((row) =>
      formFields.some((f) =>
        String(row?.[f.key] ?? "")
          .toLowerCase()
          .includes(t)
      )
    );
  }, [items, q, formFields]);

  const sorted = useMemo(() => {
    if (!sortable || !sortBy) return filtered;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const av = String(a?.[sortBy] ?? "").toLowerCase();
      const bv = String(b?.[sortBy] ?? "").toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sortBy, sortDir, sortable]);

  const toggleSort = (key) => {
    if (!sortable) return;
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const headerClass = (key) => {
    if (!sortable) return "";
    if (sortBy !== key) return "th-sortable";
    return `th-sortable sorted-${sortDir}`;
  };

  // Abrir alta
  const openAdd = () => {
    if (typeof onAdd === "function") return onAdd();
    if (usePopupForm) {
      setEditing(null);
      setIsOpen(true);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
  };

  // Guardar (create/update) — ALERTA ÚNICA DESDE AQUÍ
  const handleSave = async (data) => {
    try {
      if (editing) {
        const updated = await service.update({ ...editing, ...data });
        setItems((p) => p.map((x) => (String(x.id) === String(updated.id) ? updated : x)));
        await success({
          title: "Actualizado correctamente",
          text: `${capitalize(entityName)} guardado.`,
        });
      } else {
        const created = await service.create(data);
        setItems((p) => [...p, created]);
        await success({
          title: "Creado correctamente",
          text: `${capitalize(entityName)} guardado.`,
        });
      }
      closeModal();
    } catch (e) {
      const msg = e?.message || "No se pudo guardar el registro.";
      await error({ title: "Error al guardar", text: msg });
      // no cerramos el modal en error
    }
  };

  const requestDelete = async (row) => {
    const confirm = await confirmDelete({
      title: `¿Eliminar ${capitalize(entityName)}?`,
      text: row?.nombre || "",
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await service.remove(row.id);
      setItems((prev) => prev.filter((x) => String(x.id) !== String(row.id)));
      await success({ title: "Eliminado correctamente" });
    } catch (e) {
      await error({
        title: "Error al eliminar",
        text: e?.message || "No se pudo eliminar el registro.",
      });
    }
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
          <hr className="divisor-amarillo" />
        </div>

        <div className="abmc-topbar">
          <input
            type="text"
            className="abmc-input"
            placeholder={`Buscar ${entityName}...`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            className="abmc-btn abmc-btn-primary"
            onClick={openAdd}
            title={`Agregar ${entityName}`}
          >
            <PlusLg className="me-1" /> Agregar
          </button>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              {tableFields.map((f) => (
                <th key={f.key} className={headerClass(f.key)}>
                  <span className="th-label">{f.label}</span>
                  {sortable && (
                    <button
                      type="button"
                      className="th-caret-btn"
                      onClick={() => toggleSort(f.key)}
                    >
                      <span className="th-caret" aria-hidden />
                    </button>
                  )}
                </th>
              ))}
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr className="abmc-row">
                <td colSpan={tableFields.length + 1}>Cargando...</td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr className="abmc-row">
                <td colSpan={tableFields.length + 1}>Sin registros</td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr className="abmc-row" key={row.id}>
                  {tableFields.map((f) => (
                    <td key={f.key}>{String(row?.[f.key] ?? "-")}</td>
                  ))}
                  <td className="abmc-actions">
                    {renderActions ? (
                      renderActions(row, { requestDelete })
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-accion me-2"
                          title="Editar"
                          onClick={() => {
                            setEditing(row);
                            setIsOpen(true);
                          }}
                        >
                          <PencilFill size={18} />
                        </button>
                        <button
                          type="button"
                          className="btn-accion eliminar"
                          title="Eliminar"
                          onClick={() => requestDelete(row)}
                        >
                          <Trash3Fill size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {usePopupForm && (
        <EntityEditForm
          isOpen={isOpen}
          onClose={closeModal}
          entityName={entityName}
          schema={formFields}
          entity={editing}
          onSave={handleSave} // <- el contenedor maneja las alertas
        />
      )}
    </main>
  );
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
