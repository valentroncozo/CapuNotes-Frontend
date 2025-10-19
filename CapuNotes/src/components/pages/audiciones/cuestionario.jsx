// src/components/pages/audiciones/cuestionario.jsx
import BackButton from "@/components/common/BackButton.jsx";
import "@/styles/abmc.css";

export default function ConfigurarCuestionario() {
  return (
    <main className="abmc-page">
      <div className="abmc-card">
        <div className="abmc-header">
          <BackButton />
          <h1 className="abmc-title">Configurar cuestionario</h1>
        </div>
        <p>Editor de preguntas del cuestionario de audiciones. (Contenido a definir)</p>
      </div>
    </main>
  );
}
