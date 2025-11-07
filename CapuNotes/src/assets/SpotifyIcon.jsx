
const SpotifyIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32" // Mantiene las dimensiones del dibujo
    fill="none"
    {...props} // Permite pasar className, style, width, height, etc.
  >
    <path
      // Usamos "currentColor" para que el color del ícono se controle con la propiedad 'color' de CSS/React
      fill="currentColor" 
      d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.88 0 16 0Zm7.361 23.12c-.32.479-.88.64-1.361.32-3.76-2.32-8.48-2.801-14.081-1.521-.558.162-1.039-.239-1.199-.719-.16-.561.24-1.04.72-1.2 6.08-1.361 11.36-.8 15.52 1.76.56.24.639.879.401 1.36Zm1.92-4.4c-.401.56-1.121.8-1.682.4-4.319-2.64-10.879-3.44-15.919-1.84-.639.16-1.36-.16-1.52-.8-.16-.64.16-1.361.8-1.521 5.84-1.759 13.04-.878 18 2.161.481.241.72 1.04.321 1.6Zm.16-4.48C20.32 11.2 11.76 10.88 6.88 12.401c-.8.239-1.6-.241-1.84-.961-.24-.801.24-1.6.96-1.841 5.68-1.68 15.04-1.36 20.961 2.161.719.4.959 1.36.559 2.08-.399.561-1.36.799-2.079.4Z"
    />
  </svg>
)

export default SpotifyIcon