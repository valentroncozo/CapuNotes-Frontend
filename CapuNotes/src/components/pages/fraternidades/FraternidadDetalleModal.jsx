import Modal from "@/components/common/Modal";
import "@/styles/abmc.css";

export default function FraternidadDetalleModal({ fraternidad, isOpen, onClose }) {
  if (!fraternidad) return null;

  const miembros = Array.isArray(fraternidad.miembros) ? fraternidad.miembros : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${fraternidad.nombre}`}
      className="fraternidad-detalle-modal"
    >
      <p style={{ marginBottom: "0.75rem", textAlign: "right" }}>
        Cantidad de miembros: <strong>{fraternidad.cantidadMiembros || miembros.length}</strong>
      </p>

      {miembros.length === 0 ? (
        <p>No hay miembros registrados en esta fraternidad.</p>
      ) : (
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Área</th>
              <th>Cuerda</th>
            </tr>
          </thead>
          <tbody>
            {miembros.map((m) => (
              <tr key={`${m.id?.tipoDocumento || m.tipoDocumento}-${m.id?.nroDocumento || m.nroDocumento}`} className="abmc-row">
                <td>{m.apellido || "-"}</td>
                <td>{m.nombre || "-"}</td>
                <td>{m.area || m.areaNombre || "-"}</td>
                <td>{m.cuerda || m.cuerdaNombre || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
}
