// Tarjeta simple de encabezado reutilizable para el dashboard
export default function WelcomeCard({ title, subtitle, description }) {
  return (
    <div
      className="p-4 rounded-4"
      style={{
        background: "var(--surface, #0c0f2b)",
        color: "var(--ink, #eae9ff)",
        border: "1px solid var(--line, rgba(255,255,255,.12))",
      }}
    >
      <div className="d-flex flex-column">
        <h3 className="m-0" style={{ fontWeight: 600 }}>
          {title}
        </h3>
        {subtitle && (
          <div className="opacity-80" style={{ marginTop: 2 }}>
            {subtitle}
          </div>
        )}
        {description && (
          <div className="opacity-75 mt-2" style={{ maxWidth: 720 }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
