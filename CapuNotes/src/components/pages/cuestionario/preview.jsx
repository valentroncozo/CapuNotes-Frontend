import '@/styles/abmc.css';
import '@/styles/cuestionario.css';
import { useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton.jsx';
import { useNavigate } from 'react-router-dom';
import AudicionService from '@/services/audicionService.js';
import preguntasService from '@/services/preguntasService.js';

export default function CuestionarioPreviewPage({ title = 'Visualización de Cuestionario' }) {
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

  useEffect(() => { load(); }, []);

  const quitar = async (id) => {
    if (!audicion?.id) return;
    await preguntasService.quitarDeAudicion(audicion.id, id);
    await load();
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
                <input className="abmc-input cuest-input" value={p.valor} disabled readOnly />
                <div className="abmc-actions">
                  <button className="abmc-btn abmc-btn-secondary" type="button" onClick={() => navigate('/cuestionario/configuracion')}>Modificar</button>
                  <button className="abmc-btn abmc-btn-danger" type="button" onClick={() => quitar(p.id)}>Quitar del cuestionario</button>
                </div>
              </li>
            ))}
          </ul>

          <button className="abmc-btn abmc-btn-primary" type="button" onClick={() => navigate('/cuestionario/configuracion')}>
            Seleccionar más preguntas
          </button>
        </section>
      </div>
    </main>
  );
}
