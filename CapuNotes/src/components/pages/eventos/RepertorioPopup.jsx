import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/globals.css';
import '@/styles/popup.css';
import { repertoriosService } from '@/services/repertoriosService.js';
import { eventoService } from '@/services/eventoService.js';
import Swal from 'sweetalert2';

const RepertorioPopup = ({ evento, onClose, onSaved }) => {
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const eventoId = evento?.id;

  useEffect(() => {
    if (!eventoId) return;
    const load = async () => {
      try {
        setLoading(true);
        const [repertorios, detalle] = await Promise.all([
          repertoriosService.list(),
          eventoService.getById(eventoId),
        ]);
        setAvailable(Array.isArray(repertorios) ? repertorios : []);
        setSelectedIds((detalle?.repertorios || []).map((rep) => Number(rep.id)));
      } catch (error) {
        console.error('❌ Error cargando repertorios del evento:', error);
        Swal.fire({
          icon: 'error',
          title: 'No pudimos cargar los repertorios',
          text: 'Intenta nuevamente en unos segundos.',
          background: '#11103a',
          color: '#E8EAED',
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventoId, onClose]);

  const sortedAvailable = useMemo(
    () => [...available].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [available]
  );

  const toggleRepertorio = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((repId) => repId !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!eventoId) return;
    setSaving(true);
    try {
      await eventoService.update(eventoId, {
        tipoEvento: evento.tipoEvento,
        repertorioIds: selectedIds,
      });
      Swal.fire({
        icon: 'success',
        title: 'Repertorios actualizados',
        text: 'Guardamos los cambios en el evento.',
        timer: 1200,
        showConfirmButton: false,
        background: '#11103a',
        color: '#E8EAED',
      });
      onSaved?.(eventoId, selectedIds.length);
      onClose();
    } catch (error) {
      console.error('❌ Error al asignar repertorios:', error);
      Swal.fire({
        icon: 'error',
        title: 'No pudimos guardar',
        text: 'Revisá los datos e intentá nuevamente.',
        background: '#11103a',
        color: '#E8EAED',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNavigateToCreate = () => {
    navigate('/repertorios/nuevo', {
      state: {
        eventoContext: {
          eventoId,
          tipoEvento: evento?.tipoEvento,
          repertorioIds: selectedIds,
        },
        redirectTo: '/eventos',
      },
    });
    onClose();
  };

  if (loading) {
    return (
      <div className="popup-container">
        <p>Cargando repertorios...</p>
      </div>
    );
  }

  return (
    <div className="popup-container" style={{ maxWidth: 700 }}>
      <header className="abmc-header">
        <div className="abmc-title">
          <h1>Repertorios del evento</h1>
          <p style={{ fontSize: '0.9rem', marginTop: '4px', color: '#ccc' }}>
            {evento?.nombre} — {evento?.tipoEvento}
          </p>
        </div>
      </header>

      <hr className="divisor-amarillo" />

      <div className="popup-content" style={{ overflowY: 'auto' }}>
        <section className="repertorios-lista">
          <h2>Seleccionar repertorios existentes</h2>
          {sortedAvailable.length === 0 ? (
            <p>No hay repertorios activos disponibles.</p>
          ) : (
            <ul className="lista-simple">
              {sortedAvailable.map((rep) => (
                <li key={rep.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rep.id)}
                      onChange={() => toggleRepertorio(rep.id)}
                    />
                    <span>
                      {rep.nombre}{' '}
                      <small style={{ color: '#aaa' }}>
                        {rep.cantidadCanciones || rep.canciones?.length || 0} canciones
                      </small>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="repertorios-crear">
          <h2>Crear y asociar nuevo repertorio</h2>
          <p className="texto-suave">
            Se abrirá el formulario habitual y, si guardás correctamente, lo asignaremos a este evento.
          </p>
          <button type="button" className="btn-secondary" onClick={handleNavigateToCreate}>
            Crear repertorio
          </button>
        </section>
      </div>

      <div className="popup-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn-primary" disabled={saving} onClick={handleSave}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
};

export default RepertorioPopup;
