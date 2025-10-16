import { useMemo, useState } from "react";
import "../../styles/abmc.css";
import SearchIcon from "../ui/icons/SearchIcon.jsx";
import PlusIcon from "../ui/icons/PlusIcon.jsx";
import EditIcon from "../ui/icons/EditIcon.jsx";
import TrashIcon from "../ui/icons/TrashIcon.jsx";
import GenericEditPopup from "./GenericEditPopup.jsx";

/**
 * Props esperadas:
 * - title: string
 * - data: array
 * - loading: bool
 * - error: string | null
 * - schema: {
 *     entity: string,
 *     columns: [{ key, label, required? }],
 *     form: [{ key, label, required?, type?: "text"|"select", options?: [{value,label}] }]
 *   }
 * - create(values), update(values), remove(id)
 */
export default function EntityTableABMC({
  title,
  data = [],
  loading = false,
  error = null,
  schema = {},
  create = async () => {},
  update = async () => {},
  remove = async () => {},
}) {
  const safeSchema = {
    entity: schema?.entity ?? "Registro",
    columns: Array.isArray(schema?.columns) ? schema.columns : [],
    form: Array.isArray(schema?.form) ? schema.form : [],
  };

  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const t = q.toLowerCase();
    return data.filter((row) =>
      safeSchema.columns.some((c) =>
        String(row?.[c.key] ?? "").toLowerCase().includes(t)
      )
    );
  }, [q, data, safeSchema.columns]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const onDelete = (row) => {
    const id = row?.id ?? row?._id ?? row?.uuid ?? row?.key;
    if (!id) return;
    if (window.confirm(`¿Eliminar ${safeSchema.entity.toLowerCase()}?`)) {
      remove(id);
    }
  };

  const onSubmit = async (values) => {
    if (editing) await update({ ...(editing || {}), ...values });
    else await create(values);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="abmc-card">
      <div className="abmc-header">
        <h3 className="abmc-title">{title}</h3>

        <div className="abmc-actions">
          <div className="abmc-search">
            <SearchIcon className="abmc-search-icon" />
            <input
              type="search"
              placeholder="Buscar..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={openNew}>
            <PlusIcon /> Nuevo
          </button>
        </div>
      </div>

      {error && (
        <div className="abmc-error">{error}</div>
      )}

      <table className="abmc-table">
        <thead>
          <tr>
            {safeSchema.columns.map((c) => (
              <th key={c.key}>
                {c.label}
                {c.required ? " *" : ""}
              </th>
            ))}
            <th className="abmc-col-actions">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={safeSchema.columns.length + 1} className="abmc-empty">
                Cargando…
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={safeSchema.columns.length + 1} className="abmc-empty">
                Sin registros.
              </td>
            </tr>
          ) : (
            filtered.map((row, idx) => (
              <tr key={row?.id ?? row?._id ?? row?.uuid ?? idx}>
                {safeSchema.columns.map((c) => (
                  <td key={c.key}>{String(row?.[c.key] ?? "")}</td>
                ))}
                <td className="abmc-row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Editar"
                    onClick={() => openEdit(row)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Eliminar"
                    onClick={() => onDelete(row)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalOpen && (
        <GenericEditPopup
          entity={safeSchema.entity}
          fields={safeSchema.form}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          initialValues={editing ? pickFormValues(editing, safeSchema.form) : {}}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

function pickFormValues(row, fields = []) {
  const o = {};
  for (const f of fields) o[f.key] = row?.[f.key] ?? "";
  return o;
}
