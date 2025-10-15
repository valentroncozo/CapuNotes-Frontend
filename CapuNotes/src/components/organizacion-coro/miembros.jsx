import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/miembros.css';
import { Search, PencilFill, XCircleFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'capunotes_miembros';

export default function Miembros() {
  const navigate = useNavigate();
  const [listaMiembros, setListaMiembros] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setListaMiembros(guardados);
  }, []);

  const miembrosFiltrados = listaMiembros.filter((m) => {
    if (!filtro) return true;
    const q = filtro.toLowerCase();
    return (m.nombre || '').toLowerCase().includes(q);
  });

  const handleBuscar = () => {
    // el filtro ya aplica al vuelo, acá no hace falta nada
  };

  const handleAgregar = () => {
    navigate('/miembros/agregar');
  };

  const handleEditar = (miembro) => {
    navigate('/miembros/editar', { state: { miembro } });
  };

  const handleEliminar = async (index) => {
    const m = listaMiembros[index];
    const res = await Swal.fire({
      title: `¿Eliminar a ${m?.nombre || 'miembro'}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#11103a',
      color: '#E8EAED',
    });
    if (!res.isConfirmed) return;

    const nuevaLista = listaMiembros.filter((_, i) => i !== index);
    setListaMiembros(nuevaLista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaLista));

    await Swal.fire({
      title: 'Eliminado',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
      background: '#11103a',
      color: '#E8EAED',
    });
  };

  return (
    <main className="pantalla-miembros">
      <div className="miembros-container">
        <Row className="mb-4">
          <Col xs={12}>
            <h2 className="miembros-title text-center">Miembros del Coro</h2>
            <hr className="divisor-amarillo" />
          </Col>
        </Row>

        <Row className="mb-4 align-items-center">
          <Col xs={12} md={8} className="mb-2 mb-md-0">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre"
                className="search-input"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
              <Button variant="outline-light" onClick={handleBuscar} title="Buscar" className="ms-2">
                <Search />
              </Button>
            </InputGroup>
          </Col>

          <Col xs={12} md={4} className="text-md-end">
            <div className="botonera-miembros">
              <Button className="btn-agregar" onClick={handleAgregar}>
                Agregar miembro
              </Button>
            </div>
          </Col>
        </Row>

        <div className="tabla-wrapper">
          <Table className="tabla-miembros" responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cuerda</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembrosFiltrados.length > 0 ? (
                miembrosFiltrados.map((m, index) => (
                  <tr key={m.id ?? `${m.nombre}-${index}`}>
                    <td>{m.nombre}</td>
                    <td>{m.cuerda || '-'}</td>
                    <td>{m.area || '-'}</td>
                    <td>{m.estado || '-'}</td>
                    <td className="acciones">
                      <Button
                        className="btn-accion me-2"
                        variant="warning"
                        onClick={() => handleEditar(m)}
                        title="Editar"
                      >
                        <PencilFill size={18} />
                      </Button>
                      <Button
                        className="btn-accion eliminar"
                        variant="danger"
                        onClick={() => handleEliminar(index)}
                        title="Eliminar"
                      >
                        <XCircleFill size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No hay miembros registrados</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </main>
  );
}
