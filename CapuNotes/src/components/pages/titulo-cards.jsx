import '../../styles/titulo-cards.css';

export default function WelcomeCard({ title }) {
  return (
    <div className="welcome-card">
      {/* ✅ Logo actualizado sin espacio ni /public */}
      <img
        src="/logo-coro-sin-fondo.png"
        alt="Logo CapuNotes"
        className="welcome-card__logo"
      />
      <div className="welcome-card__text">
        <h3 className="welcome-card__title">{title}</h3>
      </div>
    </div>
  );
}
