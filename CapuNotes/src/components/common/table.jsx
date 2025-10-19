// src/components/common/table.jsx
import '@/styles/table.css';
import '@/styles/forms.css';

/** Obtiene un valor anidado: "usuario.nombre" */
const getValueByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

/**
 * Tabla ABMC estandarizada
 * - Usa clases propias (NO react-bootstrap)
 * - Botones con nuestro sistema: className de cada action (ej: 'btn btn-primary')
 * - Sin HTML inválido dentro de <table>
 */
export default function TableABMC({
  headers = [],
  data = [],
  actions = [],
  columns = [],
  emptyMenssage = 'No hay registros',
}) {
  const hasActions = Array.isArray(actions) && actions.length > 0;

  return (
    <table className="abmc-table abmc-table-rect">
      <thead className="abmc-thead">
        <tr className="abmc-row">
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
          {!headers.some(h => String(h).toLowerCase().includes('accion')) && hasActions && (
            <th>Acciones</th>
          )}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((d, rowIndex) => (
            <tr key={d.id ?? rowIndex} className="abmc-row">
              {columns.length > 0
                ? columns.map((col, i) => <td key={i}>{String(getValueByPath(d, col) ?? '—')}</td>)
                : Object.values(d).map((val, i) => <td key={i}>{String(val ?? '—')}</td>)
              }

              {hasActions && (
                <td className="abmc-actions">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      className={action.className || 'btn btn-primary'}
                      onClick={() => action.onClick?.(d)}
                      title={action.title || action.label}
                      type="button"
                    >
                      {action.icon ? <span style={{ display: 'inline-flex', marginRight: 6 }}>{action.icon}</span> : null}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr className="abmc-row">
            <td colSpan={Math.max(1, headers.length + (hasActions ? 1 : 0))} style={{ textAlign: 'center' }}>
              {emptyMenssage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
