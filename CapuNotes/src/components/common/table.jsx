// src/components/common/table.jsx
import { useState, useMemo } from "react";
import Button from "react-bootstrap/Button";
import "@/styles/table.css";
import "@/styles/forms.css";

const getValueByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

export default function TableABMC({
  headers = [],
  data = [],
  columns = [],
  actions = [],
  emptyMessage = "No hay registros",
  sortable = false,
}) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sorted = useMemo(() => {
    if (!sortable || !sortBy) return data;
    const dir = sortDir === "desc" ? -1 : 1;
    return [...data].sort((a, b) => {
      const va = String(getValueByPath(a, sortBy) ?? "").toLowerCase();
      const vb = String(getValueByPath(b, sortBy) ?? "").toLowerCase();
      return va.localeCompare(vb, "es") * dir;
    });
  }, [data, sortBy, sortDir, sortable]);

  const toggleSort = (key) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const thClass = (key) =>
    sortBy === key ? `th-sortable sorted-${sortDir}` : "th-sortable";

  return (
    <table className="abmc-table abmc-table-rect">
      <thead className="abmc-thead">
        <tr className="abmc-row">
          {headers.map((h, i) => (
            <th
              key={i}
              className={sortable ? thClass(columns[i]) : undefined}
              onClick={sortable ? () => toggleSort(columns[i]) : undefined}
            >
              {h}
            </th>
          ))}
          {actions.length > 0 && <th>Acciones</th>}
        </tr>
      </thead>

      <tbody>
        {sorted.length > 0 ? (
          sorted.map((row, i) => (
            <tr key={row.id ?? i} className="abmc-row">
              {columns.map((col, j) => (
                <td key={j}>{getValueByPath(row, col) ?? "—"}</td>
              ))}
              {actions.length > 0 && (
                <td className="abmc-actions">
                  {actions.map((act, k) => (
                    <Button
                      key={k}
                      className={act.className}
                      title={act.title}
                      onClick={() => act.onClick(row)}
                    >
                      {act.icon} <span>{act.label}</span>
                    </Button>
                  ))}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + (actions.length ? 1 : 0)} className="text-center">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
