
// Componente que define la ruta de recorte para CSS
const MobileWavyClipPath = () => (
  // Ocultamos el SVG principal, solo necesitamos que esté en el DOM para la referencia
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
  >
    <defs>
      {/* Definimos el clipPath con un ID único */}
      <clipPath id="mobile-wavy-shape-clip" clipPathUnits="objectBoundingBox" >
        {/* El primer path, que define la forma principal */}
        <path
          d="M213.258 34.19c-96.116 74.677-131.139 13.406-212.257 0H0l.724 368.043c4.08 11.333 10.368 16.111 25.308 22.767h356.431c17.016-3.201 23.202-9.258 30.036-25.39L413 34.19h-1.502s-102.123-74.677-198.24 0Z"
        />
        {/*
          IMPORTANTE: El segundo path en tu SVG original parece ser un trazo
          que sigue el borde del primer path. Para clipping, solo necesitamos
          la forma del PATH que quieres usar para el recorte.
          Usamos solo el primer <path> que define el área.
        */}
      </clipPath>
    </defs>
  </svg>
)

export default MobileWavyClipPath
