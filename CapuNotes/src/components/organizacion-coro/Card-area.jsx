// src/components/organizacion-coro/Card-area.jsx
import '../../styles/area-card.css';
import Button from 'react-bootstrap/Button';

const CardArea = ({ id, nombre, descripcion, onEdit, onDelete }) => {
  return (
    <section className="area-card mb-3" tabIndex={id}>
      <h3><strong>{nombre}</strong></h3>
      <p className="area-desc">{descripcion || '—'}</p>

      <div className="actions-container">
        <Button className="btn btn-modificar" onClick={() => onEdit?.({ id, nombre, descripcion })}>
          Modificar
        </Button>
        <Button className="btn btn-warning" onClick={() => onDelete?.(id)}>
          Eliminar
        </Button>
      </div>
    </section>
  );
};

export default CardArea;
