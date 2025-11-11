
const UbicacionIcon = (props) => (
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="ffff"
    {...props}
  >
    <g
      stroke="var(--text-light)" // Color principal para el borde
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      {/* 1. Gota/Pin (solo borde) */}
      <path d="M28 13.334c0 9.333-12 17.333-12 17.333s-12-8-12-17.334a12 12 0 1 1 24 0Z" />
      
      {/* 2. Círculo interior (borde y relleno) */}
      <path
        // El borde usa 'currentColor' (color principal).
        // El relleno usa la prop 'secondaryColor' o el color principal si no se pasa.
        fill='transparent'
        d="M16 17.334a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      />
    </g>
  </svg>
);

export default UbicacionIcon