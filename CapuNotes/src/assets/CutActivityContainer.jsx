const TopVarLanding = ({ id = 'activity-cut', ariaHidden = true }) => {
  
  // Coordenadas normalizadas (X/1437, Y/647)
  const NORMALIZED_PATH = "M0 0.0906C0.0877 0.1571 0.1354 0.2051 0.2505 0.0906C0.3462 0.0291 0.4004 0.0090 0.5010 0.0906C0.6022 0.2032 0.6554 0.2052 0.7516 0.0906C0.8605 -0.0446 0.9129 -0.0149 1.0020 0.0906V0.8936C0.9360 1.0267 0.8865 1.0439 0.7516 0.8936C0.6414 0.7768 0.5872 0.7839 0.5010 0.8936C0.4168 1.0189 0.3507 1.0000 0.2505 0.8936C0.1299 0.7644 0.0835 0.8119 0 0.8936V0.0906Z";

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
          {/* Path normalizado (coordenadas 0..1) */}
          <path d={NORMALIZED_PATH}/>
        </clipPath>
      </defs>
    </svg>
  );
};

export default TopVarLanding;