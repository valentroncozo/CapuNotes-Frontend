import { useState, useEffect } from 'react';
import BackButton from '../common/BackButton';
import { Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Eye, CheckCircle } from "react-bootstrap-icons";
import EditIcon from "@/assets/EditIcon";
import { XCircle } from "react-bootstrap-icons";

import Swal from 'sweetalert2';

import { miembrosService } from '@/services/miembrosService.js';
import { cuerdasService } from '@/services/cuerdasService.js';
import { areasService } from '@/services/areasService.js';

import '../../styles/abmc.css';
import '../../styles/miembros.css';

export default function MiembrosTableABMC({
  title = 'Miembros del coro',
  showBackButton = true,
}) {
  const navigate = useNavigate();
  const [listaMiembros, setListaMiembros] = useState([]);
  const [cuerdas, setCuerdas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCuerda, setFiltroCuerda] = useState('');
  const [ordenEstadoAscendente, setOrdenEstadoAscendente] = useState(true);
  const location = useLocation();

  // =======================
  // CARGA + ORDEN PRINCIPAL
  // =======================
  const load = async () => {
    try {
      const [miembrosData, cuerdasData, areasData] = await Promise.all([
        miembrosService.list(),
        cuerdasService.list(),
        areasService.list(),
      ]);

      // ORDEN: activos → apellido → nombre
      const ordenados = [...miembrosData].sort((a, b) => {
        if (a.activo !== b.activo) return a.activo ? -1 : 1;

        const apA = (a.apellido || '').toLowerCase();
        const apB = (b.apellido || '').toLowerCase();
        const cmpAp = apA.localeCompare(apB, 'es', { sensitivity: 'base' });
        if (cmpAp !== 0) return cmpAp;

        const nomA = (a.nombre || '').toLowerCase();
        const nomB = (b.nombre || '').toLowerCase();
        return nomA.localeCompare(nomB, 'es', { sensitivity: 'base' });
      });

      setListaMiembros(ordenados);
      setCuerdas(cuerdasData);
      setAreas(areasData || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    }
  };

  useEffect(() => {
    load();
  }, [location.state?.recargar]);

  // ================
  // FILTRADOS
  // ================
  const miembrosFiltrados = listaMiembros.filter((m) => {
    const texto = filtroTexto.toLowerCase();

    const fullName = `${m.apellido || ''} ${m.nombre || ''}`.toLowerCase();

    const matchTexto =
      !filtroTexto ||
      fullName.includes(texto) ||
      (m.nombre || '').toLowerCase().includes(texto) ||
      (m.apellido || '').toLowerCase().includes(texto);

    const matchCuerda =
      !filtroCuerda ||
      (m.cuerda?.name || '').toLowerCase() === filtroCuerda.toLowerCase();

    return matchTexto && matchCuerda;
  });

  // =======================
  // CAMBIO DE ESTADO
  // =======================
  const handleCambiarEstado = async (miembro) => {
    const activo = miembro.activo;
    const accion = activo ? 'dar de baja' : 'reactivar';

    const res = await Swal.fire({
      title: `¿Desea ${accion} a ${miembro?.nombre || 'miembro'}?`,
      text: activo
        ? 'El miembro pasará a estado inactivo.'
        : 'El miembro volverá a estar activo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DE9205',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      background: '#11103a',
      color: '#E8EAED',
    });

    if (!res.isConfirmed) return;

    try {
      if (activo) {
        await miembrosService.darDeBaja(
          miembro.id?.nroDocumento,
          miembro.id?.tipoDocumento
        );
      } else {
        await miembrosService.reactivar(
          miembro.id?.nroDocumento,
          miembro.id?.tipoDocumento
        );
      }

      await load();

      Swal.fire({
        icon: 'success',
        title: activo ? 'Miembro dado de baja' : 'Miembro reactivado',
        text: `${miembro.apellido}, ${miembro.nombre} ahora está ${activo ? 'inactivo' : 'activo'
          }.`,
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonColor: '#DE9205',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del miembro.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonColor: '#7c83ff',
      });
    }
  };

  // ORDEN POR ESTADO (mantiene tu iconito ▲▼)
  const ordenarPorEstado = () => {
    const ordenados = [...listaMiembros].sort((a, b) => {
      if (a.activo === b.activo) return 0;
      return ordenEstadoAscendente ? (a.activo ? -1 : 1) : a.activo ? 1 : -1;
    });

    setListaMiembros(ordenados);
    setOrdenEstadoAscendente(!ordenEstadoAscendente);
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        {/* === Encabezado === */}
        <div className="abmc-header">
          {showBackButton && <BackButton />}
          <h1
            className="abmc-title"
            style={{ display: 'inline-block', marginRight: '1rem' }}
          >
            {title}
          </h1>
        </div>

        {/* === Barra superior con buscador y filtro === */}
        <div className="abmc-topbar">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="abmc-input"
          />

          <select
            className="abmc-select"
            value={filtroCuerda}
            onChange={(e) => setFiltroCuerda(e.target.value)}
            style={{ minWidth: 220 }}
          >
            <option value="">Todas las cuerdas</option>
            {cuerdas.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <Button
            className="abmc-btn abmc-btn-primary"
            onClick={() => navigate('/miembros/agregar')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
            </svg>
          </Button>
        </div>

        {/* === Tabla === */}
        <table className="abmc-table abmc-table-rect">
          <thead className="abmc-thead">
            <tr className="abmc-row">
              <th>Apellido, Nombre</th>
              <th>Cuerda</th>
              <th>Área</th>
              <th onClick={ordenarPorEstado} style={{ cursor: 'pointer' }}>
                Estado {ordenEstadoAscendente ? '▲' : '▼'}
              </th>

              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {miembrosFiltrados.length > 0 ? (
              miembrosFiltrados.map((m) => (
                <tr
                  key={`${m.id?.nroDocumento}-${m.id?.tipoDocumento}`}
                  className="abmc-row"
                >
                  {/* 👇 Apellido, Nombre */}
                  <td>{`${m.apellido || ''}, ${m.nombre || ''}`}</td>

                  <td>{m.cuerda?.name || '-'}</td>

                  <td>
                    {(() => {
                      const a = m.area;
                      if (!a) return '-';
                      if (typeof a === 'string') return a;
                      if (typeof a === 'number') {
                        const found = areas.find((x) => x.id === a);
                        return found?.nombre || String(a);
                      }
                      if (a.id) {
                        const found = areas.find((x) => x.id === a.id);
                        return found?.nombre || a.nombre || a.name || '-';
                      }
                      return a.nombre || a.name || '-';
                    })()}
                  </td>

                  <td>
                    <Badge
                      bg={m.activo ? 'success' : 'secondary'}
                      style={{
                        fontSize: '1rem',
                        padding: '3px 12px 5px 12px',
                        lineHeight: '1',
                        borderRadius: '8px',
                        display: 'inline-block',
                      }}
                    >
                      {m.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>

                  {/* === ACCIONES === */}
                  <td className="abmc-actions">

                    {/* VER */}
                    <button
                      type="button"
                      className="abmc-btn abmc-btn-icon"
                      title="Ver"
                      onClick={() =>
                        navigate('/miembros/editar', { state: { miembro: m, soloVer: true } })
                      }
                    >
                      <Eye size={18} />
                    </button>

                    {/* EDITAR */}
                    <button
                      type="button"
                      className="abmc-btn abmc-btn-icon"
                      title="Editar"
                      onClick={() =>
                        navigate('/miembros/editar', { state: { miembro: m } })
                      }
                    >
                      <EditIcon width={18} height={18} />
                    </button>

                    {/* DAR DE BAJA / REACTIVAR */}
                    {m.activo ? (
                      // DAR DE BAJA → usar una ❌
                      <button
                        type="button"
                        className="abmc-btn abmc-btn-icon"
                        title="Dar de baja"
                        onClick={() => handleCambiarEstado(m)}
                      >
                        <XCircle size={18} />
                      </button>
                    ) : (
                      // REACTIVAR → usar el check verde
                      <button
                        type="button"
                        className="abmc-btn abmc-btn-icon"
                        title="Reactivar"
                        onClick={() => handleCambiarEstado(m)}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay miembros registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
