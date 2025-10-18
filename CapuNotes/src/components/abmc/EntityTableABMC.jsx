// src/components/abmc/EntityTableABMC.jsx
import { useEffect, useMemo, useState } from "react";
import BackButton from "../common/BackButton";
import { PencilFill, Trash3Fill, PlusLg } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import EntityEditForm from "./EntityEditForm.jsx";
import "@/styles/abmc.css";

export default function EntityTableABMC({
  title = "Catálogo",
  service,
  schema = [],
  uniqueBy = null,
  entityName = "elemento",
  showBackButton = true,
  renderActions,
  onAdd = null,
  usePopupForm = true,
  sortable = false, // ordenar solo donde se necesite (p.ej. Miembros)
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
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [service]);

  const formFields = useMemo(
    () => schema.filter((f) => f.type !== "submit" && f.type !== "button"),
    [schema]
  );
  const tableFields = useMemo(
    () => formFields.filter((f) => f.table !== false),
    [formFields]
  );

  const filtered = useMemo(() => {
    if (!q) return items;
    const t = q.toLowerCase();
    return items.filter((row) =>
      formFields.some((f) =>
        String(row?.[f.key] ?? "").toLowerCase().includes(t)
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
    if (sortBy !== key) { setSortBy(key); setSortDir("asc"); }
    else { setSortDir((d) => (d === "asc" ? "desc" : "asc")); }
  };

  const headerClass = (key) => {
    if (!sortable) return "";
    if (sortBy !== key) return "th-sortable";
    return `th-sortable sorted-${sortDir}`;
  };

  const openAdd = () => { if (onAdd) return onAdd(); setEditing(null); setIsOpen(true); };
  const closeModal = () => { setIsOpen(false); setEditing(null); };

  const handleSave = async (data) => {
    if (editing) {
      const updated = await service.update({ ...editing, ...data });
      setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    } else {
      const created = await service.create(data);
      setItems((p) => [...p, created]);
    }
    closeModal();
  };

  const requestDelete = async (row) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar ${entityName}?`,
      text: row?.nombre || "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#11103a",
      color: "#E8EAED",
    });
    if (!confirm.isConfirmed) return;
    await service.remove(row.id);
    setItems((prev) => prev.filter((x) => x.id !== row.id));
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1 className="abmc-title">{title}</h1>
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
                      aria-label={
                        sortBy !== f.key
                          ? `Ordenar por ${f.label}`
                          : `Cambiar orden ${sortDir === "asc" ? "descendente" : "ascendente"}`
                      }
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
                          className="btn-accion me-2"
                          title="Editar"
                          onClick={() => { setEditing(row); setIsOpen(true); }}
                        >
                          <PencilFill size={18} />
                        </button>
                        <button
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
          onSave={handleSave}
        />
      )}
    </main>
  );
}
