import Button from "react-bootstrap/Button";
import "@/styles/table.css";
import "@/styles/forms.css";

const getValueByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const TableABMC = ({
  headers = [],
  data = [],
  actions = [],
  columns = [],
  emptyMenssage = "No hay registros",
}) => {
  return (
    <table className="abmc-table abmc-table-rect">
      <thead className="abmc-thead">
        <tr className="abmc-row">
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((d, rowIndex) => (
            <tr key={d.id ?? rowIndex} className="abmc-row">
              {columns.length > 0 ? (
                <>
                  {columns.map((col, i) => (
                    <td key={i}>{String(getValueByPath(d, col) ?? "-")}</td>
                  ))}

                  <td className="abmc-actions">
                    {actions.length > 0 ? (
                      actions.map((action, index) => (
                        <Button
                          key={index}
                          className={action.className}
                          onClick={() => action.onClick(d)}
                          title={action.title}
                        >
                          {action.icon} <span>{action.label}</span>
                        </Button>
                      ))
                    ) : (
                      // Si no hay acciones, placeholder para mantener la columna
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </>
              ) : (
                // Fallback válido en tablas: una sola celda abarcando todas las columnas (incluida Acciones si estaba en headers)
                <td colSpan={headers.length}>Debe especificar las columnas a mostrar</td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="text-center">
              {emptyMenssage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableABMC;
