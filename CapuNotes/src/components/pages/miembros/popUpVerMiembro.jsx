import Modal from "@/components/common/Modal.jsx";
import "@/styles/miembros.css";
import { Badge } from "react-bootstrap";


export default function PopUpVerMiembro({ isOpen, onClose, miembro }) {
  if (!miembro) return null;

  //FIX SEGURO – evita el error sin romper nada
  const tipoDoc =
    miembro.id?.tipoDocumento ||
    miembro.tipoDocumento ||
    "-";

  const nroDoc =
    miembro.id?.nroDocumento ||
    miembro.nroDocumento ||
    "-";

  const cuerda =
    miembro.cuerda?.name ||
    miembro.cuerda?.nombre ||
    miembro.cuerda ||
    "-";

  const area =
    miembro.area?.nombre ||
    miembro.area ||
    "-";
  // 👆👆 FIN DEL FIX

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${miembro.nombre} ${miembro.apellido}`}
      className="pop-miembro"
    >
      <div className="ver-miembro-grid">

        {/*reemplazo directo, mismo UI */}
        <p><strong>Tipo y Nro de documento:</strong> {tipoDoc} - {nroDoc}</p>
        <p><strong>Cuerda:</strong> {cuerda}</p>
        <p><strong>Área:</strong> {area}</p>

        <p><strong>Correo:</strong> {miembro.correo || "-"}</p>
        <p><strong>Teléfono:</strong> {miembro.nroTelefono || "-"}</p>

        <p><strong>Fecha nacimiento:</strong> {miembro.fechaNacimiento || "-"}</p>
        <p><strong>Lugar de origen:</strong> {miembro.lugarOrigen || "-"}</p>
        <p><strong>Carrera / Profesión:</strong> {miembro.carreraProfesion || "-"}</p>
        <p><strong>Instrumento:</strong> {miembro.instrumentoMusical || "-"}</p>

        <p>
          <strong>Estado:</strong>{" "}
          <Badge
            bg={miembro.activo ? "success" : "secondary"}
            style={{
              fontSize: "1rem",
              padding: "3px 12px 5px 12px",
              borderRadius: "8px",
            }}
          >
            {miembro.activo ? "Activo" : "Inactivo"}
          </Badge>
        </p>


      </div>
    </Modal>
  );
}

