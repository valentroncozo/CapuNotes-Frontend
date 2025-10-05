import './titulo-cards.css';

export default function WelcomeCard({ title, subtitle }) {
  return (
    <div className="welcome-card">
      <img
        src="/Logo coro sin fondo.png"
        alt="Logo CapuNotes"
        className="welcome-card__logo"
      />
      <div className="welcome-card__text">
        <h3 className="welcome-card__title">{title}</h3>
        <p className="welcome-card__subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
