import '@/styles/abmc.css';
import '@/styles/cuestionario.css';
import { useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import { useNavigate } from 'react-router-dom';
import AudicionService from '@/services/audicionService.js';
import preguntasService from '@/services/preguntasService.js';
import Swal from 'sweetalert2';

export default function CuestionarioPreviewPage({
  title = 'Visualización de Cuestionario',
}) {
  const navigate = useNavigate();
  const [audicion, setAudicion] = useState(null);
  const [formulario, setFormulario] = useState([]);

  const load = async () => {
    const a = await AudicionService.getActual();
    setAudicion(a);
    if (a?.id) {
      const form = await preguntasService.getFormulario(a.id);
      setFormulario(form);
    } else {
      setFormulario([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const quitar = async (id) => {
    if (!audicion?.id) return;

    const result = await Swal.fire({
      title: '¿Estás seguro que deseas quitar esta pregunta del cuestionario?',
      icon: 'warning',
      iconColor: 'var(--accent)', // Color del ícono de advertencia
      showCancelButton: true,
      confirmButtonColor: 'var(--bg)', // Estilo de 'Modificar'
      cancelButtonColor: 'var(--bg)', // Estilo de 'Quitar del cuestionario'
      confirmButtonText:
        '<button class="abmc-btn abmc-btn-primary">Aceptar</button>',
      cancelButtonText:
        '<button class="abmc-btn abmc-btn-secondary">Cancelar</button>',
      reverseButtons: true, // Cambia el orden de los botones
      background: 'var(--bg)', // Fondo del SweetAlert
      color: 'var(--text-light)', // Color del texto
    });

    if (result.isConfirmed) {
      await preguntasService.quitarDeAudicion(audicion.id, id);
      await load();
      Swal.fire({
        title: 'Pregunta quitada',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: 'var(--bg)', // Fondo del SweetAlert
        color: 'var(--text-light)', // Color del texto
      });
    }
  };

  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
          <hr className="divisor-amarillo" />
        </header>

        <section className="cuest-section">
          <h3 className="cuest-subtitle">Preguntas de conocimiento personal</h3>
          <ul className="cuest-list">
            {formulario.map((p) => (
              <li key={p.id} className="cuest-row">
                <input
                  className="abmc-input cuest-input"
                  value={p.valor}
                  disabled
                  readOnly
                />
                <div className="abmc-actions">
                  <button
                    className="abmc-btn abmc-btn-primary"
                    type="button"
                    onClick={() => navigate('/cuestionario/configuracion')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                  </button>
                  <button
                    className="abmc-btn abmc-btn-quitar"
                    type="button"
                    onClick={quitar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M200-440v-80h560v80H200Z" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="abmc-btn abmc-btn-primary"
            type="button"
            onClick={() => navigate('/cuestionario/configuracion')}
          >
            Seleccionar más preguntas
          </button>
        </section>
      </div>
    </main>
  );
}
