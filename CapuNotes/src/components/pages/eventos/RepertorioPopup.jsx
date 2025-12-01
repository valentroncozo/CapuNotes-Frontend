import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/common/Modal.jsx';
import '@/styles/globals.css';
import '@/styles/popup.css';
import { repertoriosService } from '@/services/repertoriosService.js';
import { eventoService } from '@/services/eventoService.js';
import Swal from 'sweetalert2';
import Loader from '@/components/common/Loader.jsx';

const RepertorioPopup = ({ evento, onClose, onSaved, isOpen = true }) => {
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
      await eventoService.assignRepertorios(
        eventoId,
        evento.tipoEvento,
        selectedIds
      );

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
        text: error?.response?.data?.mensaje || 'Revisá los datos e intentá nuevamente.',
        background: '#11103a',
        color: '#E8EAED',
        confirmButtonColor: '#DE9205',
        confirmButtonText: 'Aceptar',
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

  const modalActions = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancelar
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={saving || loading}
        onClick={handleSave}
      >
        {loading ? 'Cargando...' : saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Repertorios"
      className="evento-repertorio-modal"
      actions={modalActions}
    >
      <div className="evento-repertorio-body">
        <p className="evento-repertorio-resumen">
          {evento?.nombre || 'Evento sin nombre'} — {evento?.tipoEvento || 'Sin tipo'}
        </p>
        <hr className="divisor-amarillo" />

        {loading ? (
          <div
            className="evento-repertorio-loading"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "1rem 0"
            }}
          >
            <Loader />
          </div>
        ) : (
          <div className="evento-repertorio-scroll">
            <section className="repertorios-lista">
              <h4>Seleccionar repertorios existentes</h4>
              
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
              <h4>Crear y asociar nuevo repertorio</h4>
              <p className="texto-suave">
                Se abrirá el formulario habitual y, si guardás correctamente, lo asignaremos a este
                evento.
              </p>
              <button
                type="button"
                className="abmc-btn btn-primary"
                onClick={handleNavigateToCreate}
              >
                Crear repertorio
              </button>
            </section>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RepertorioPopup;
