// src/components/pages/audiciones/agregar.jsx
import BackButton from '@/components/common/BackButton.jsx';
import '@/styles/abmc.css';
import '@/styles/forms.css';

export default function AudicionAgregar({ title = 'Agregar audición' }) {
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <header className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">{title}</h1>
          <hr className="divisor-amarillo" />
        </header>

        {/* TODO: formulario de alta de audición */}
        <div className="form-grid">
          <div className="field">
            <label>Fecha</label>
            <input className="input" type="date" />
          </div>

          <div className="field">
            <label>Cantidad de turnos</label>
            <input className="input" type="number" min="0" placeholder="0" />
          </div>

          <div className="field">
            <label>Observaciones</label>
            <textarea className="input" rows={4} placeholder="Notas opcionales…" />
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => { /* TODO: guardar */ }}>
            Guardar
          </button>
        </div>
      </div>
    </main>
  );
}
