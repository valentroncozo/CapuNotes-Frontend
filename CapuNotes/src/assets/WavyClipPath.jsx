

// Este componente solo contiene las DEFINICIONES del clip-path.
const WavyClipPath = () => {
  return (
    // Es crucial que este SVG esté en el DOM, pero puede estar oculto.
    <svg 
      width="0" 
      height="0" 
      viewBox="0 0 1400 1024"
      style={{ position: 'absolute' }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/*
          1. <clipPath> debe tener un ID único para que CSS lo referencie.
          2. Path simplificado y normalizado para mejor rendimiento
        */}
        <clipPath id="wavy-shape-clip" clipPathUnits="objectBoundingBox">
          <path 
            d="M0,0 L0,1 L0.8,1 C0.88,0.93 0.87,0.85 0.83,0.8 C0.83,0.8 0.69,0.71 0.77,0.59 C0.8,0.53 0.95,0.42 0.86,0.34 C0.78,0.3 0.8,0.16 0.89,0.16 C0.99,0.16 0.95,0 0.95,0 L0,0Z" 
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default WavyClipPath;