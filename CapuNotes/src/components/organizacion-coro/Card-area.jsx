import '../../styles/area-card.css';
import Button from 'react-bootstrap/Button';

const CardArea = ({  id, name, description}) => {
    
  return (
    <section className="area-card mb-3" tabIndex={id}>
        <h3 className=""><strong>{name}</strong></h3>
        <p className="area-desc">
        {description}
        </p>
        <div className="actions-container">
            <Button className="btn btn-modificar">
                Modificar
            </Button>
            <Button className="btn btn-warning">
                Eliminar
            </Button>
        </div>
        </section>
    );
}

export default CardArea;