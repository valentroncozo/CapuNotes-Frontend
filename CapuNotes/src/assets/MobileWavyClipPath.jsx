
// Componente que define la ruta de recorte para CSS
const MobileWavyClipPath = () => (
  // Ocultamos el SVG principal, solo necesitamos que esté en el DOM para la referencia
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 413 400"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
  >
    <defs>
      {/* Definimos el clipPath con un ID único y unidades en userSpaceOnUse */}
   <clipPath id="mobile-wavy-shape-clip" clipPathUnits="objectBoundingBox">
    {/* Top wave: la curva está en la parte superior (coordenadas 0..1) */}
    <path d="M0,0.25 C0.15,0.1 0.35,0.45 0.5,0.35 C0.65,0.25 0.85,0.05 1,0.2 L1,1 L0,1 Z" />
  </clipPath>
    </defs>
  </svg>
)

export default MobileWavyClipPath
