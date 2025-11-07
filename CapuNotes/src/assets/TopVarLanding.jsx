const TopVarLanding = ({ id = 'topvar-clip', ariaHidden = true }) => {
  return (
    // SVG debe estar en el DOM (puede estar oculto). Usamos objectBoundingBox para normalizar 0..1
    <svg
      width="0"
      height="0"
      viewBox="0 0 1 1"
      style={{ position: 'absolute' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          {/* Path con coordenadas normalizadas (0..1). Ajusta la forma según necesites */}
          <path d="M0.0664762 0.697008C0.174692 0.714367 0.235628 0.635041 0.342057 0.697008C0.474256 0.61982 0.493258 0.656918 0.583047 0.697008C0.740193 0.620885 0.791052 0.703659 0.885148 0.697008C1.06698 0.615894 1.1786 0.809157 1.3752 0.697008C1.40556 0.679686 1.42942 0.667716 1.44806 0.659856V0H0V0.664462C0.026818 0.651816 0.046325 0.658004 0.0664762 0.697008Z"/>


        </clipPath>
      </defs>
    </svg>
  );
};

export default TopVarLanding;

