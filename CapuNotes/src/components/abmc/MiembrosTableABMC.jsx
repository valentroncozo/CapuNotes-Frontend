
import { useState, useEffect } from 'react';
import BackButton from "../common/BackButton";
import { Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PencilFill, XCircleFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

import '../../styles/abmc.css';
import '../../styles/miembros.css';

const STORAGE_KEY = 'capunotes_miembros';



export default function EntityTableABMC({ title = "Miembros del coro", showBackButton = true }) {
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
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          { showBackButton && <BackButton/>}
          <h1 className="abmc-title">{title}</h1>
        </div>

        <div className="abmc-topbar">

            <label>Filtrar Por: </label>

            <input
              type="text"
              id="filtro"
              placeholder="Buscar por nombre"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="abmc-input"
              aria-label="Buscar"
            />
            
            <select
              className="abmc-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              aria-label="Filtrar por área"
            >
              <option value="">Todas las áreas</option>
              <option value="soprano">Soprano</option>
              <option value="alto">Alto</option>
              <option value="tenor">Tenor</option>
              <option value="bajo">Bajo</option>
            </select>
            
            <select
              className="abmc-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              aria-label="Filtrar por cuerda"
            >
              <option value="">Todas las cuerdas</option>
              <option value="soprano">Soprano</option>
              <option value="alto">Alto</option>
              <option value="tenor">Tenor</option>
              <option value="bajo">Bajo</option>
            </select>

            <Button className="abmc-btn abmc-btn-primary" onClick={handleAgregar}>
              Agregar miembro
            </Button>
        </div>

        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className='abmc-row'>
                <th>Nombre y apellido</th>
                <th>Cuerda</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Acciones</th>

            </tr>
          </thead>
          <tbody>
             {miembrosFiltrados.length > 0 ? (
                miembrosFiltrados.map((m, index) => (
                  <tr  className="abmc-row" key={m.id ?? `${m.nombre}-${index}`}>
                    <td>{m.nombre + ', ' + m.apellido}</td>
                    <td>{m.cuerda || '-'}</td>
                    <td>{m.area || '-'}</td>
                    <td>{m.estado || '-'}</td>
                    <td className="abmc-actions">
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
        </table>
      </div>

    </main>
  );
}
