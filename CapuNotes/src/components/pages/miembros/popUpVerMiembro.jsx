import Modal from "@/components/common/Modal.jsx";
import "@/styles/miembros.css";

export default function PopUpVerMiembro({ isOpen, onClose, miembro }) {
  if (!miembro) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Miembro: ${miembro.nombre} ${miembro.apellido}`}
      className="pop-miembro"   // por si querés ajustar estilos después
    >
      <div className="ver-miembro-grid">

        <p><strong>Documento:</strong> {miembro.id.tipoDocumento} {miembro.id.nroDocumento}</p>
        <p><strong>Cuerda:</strong> {miembro.cuerda?.name || "-"}</p>
        <p><strong>Área:</strong> {miembro.area || "-"}</p>

        <p><strong>Correo:</strong> {miembro.correo || "-"}</p>
        <p><strong>Teléfono:</strong> {miembro.nroTelefono || "-"}</p>

        <p><strong>Fecha nacimiento:</strong> {miembro.fechaNacimiento || "-"}</p>
        <p><strong>Carrera / Profesión:</strong> {miembro.carreraProfesion || "-"}</p>

        <p><strong>Lugar de origen:</strong> {miembro.lugarOrigen || "-"}</p>
        <p><strong>Instrumento:</strong> {miembro.instrumentoMusical || "-"}</p>

        <p><strong>Estado:</strong> {miembro.activo ? "Activo" : "Inactivo"}</p>

      </div>
    </Modal>
  );
}

