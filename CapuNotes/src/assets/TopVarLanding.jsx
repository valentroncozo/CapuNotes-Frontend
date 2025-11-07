const TopVarLanding = ({ id = 'topvar-clip', ariaHidden = true }) => {
  
  // Coordenadas originales (basadas en viewBox 1440x689)

  // Coordenadas normalizadas (dividiendo X por 1440 y Y por 689)
  // Nota: El punto '1443' en X fue truncado a 1440 (1.0) para asegurar que no se salga del objectBoundingBox.
  const NORMALIZED_PATH = "M0.0448 0.9515C0.1178 0.9749 0.1589 0.8681 0.2307 0.9515C0.3200 0.8475 0.3326 0.8975 0.3932 0.9515C0.4991 0.8490 0.5334 0.9590 0.5969 0.9515C0.7195 0.8423 0.7948 1.1025 0.9274 0.9515C0.9478 0.9282 0.9895 0.9121 1.0000 0.9015V0.4760V-0.0072H0V0.9077C0.0181 0.8907 0.0312 0.8990 0.0448 0.9515Z";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      style={{ position: 'absolute' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          {/* Este path está escalado para usar coordenadas 0..1 (X/1440, Y/689) */}
          <path d={NORMALIZED_PATH}/>
        </clipPath>
      </defs>
    </svg>
  );
};

export default TopVarLanding;