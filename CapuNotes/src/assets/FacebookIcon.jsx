const FacebookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32" // Mantiene las dimensiones del dibujo
    fill="none"
    {...props} // Permite pasar className, style, width, height, etc.
  >
    <path
      // Usamos "currentColor" para que el color del trazo se controle con la propiedad 'color' de CSS/React
      stroke="currentColor" 
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M24 2.667h-4a6.667 6.667 0 0 0-6.667 6.666v4h-4v5.333h4v10.667h5.333V18.667h4L24 13.332h-5.334v-4A1.333 1.333 0 0 1 20 8h4V2.667Z"
    />
  </svg>
)

export default FacebookIcon