const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32" // Mantiene las dimensiones del dibujo
    fill="none"
    {...props} // Permite pasar className, style, width, height, etc.
  >
    <path
      // Usamos "currentColor" para que el color del trazo se controle con la propiedad 'color'
      stroke="currentColor" 
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M23.3337 8.6665H23.347M9.33366 2.6665H22.667C26.3489 2.6665 29.3337 5.65127 29.3337 
      9.33317V22.6665C29.3337 26.3484 26.3489 29.3332 22.667 29.3332H9.33366C5.65176 29.3332 
      2.66699 26.3484 2.66699 22.6665V9.33317C2.66699 5.65127 5.65176 2.6665 9.33366 2.6665ZM21.3337 
      15.1598C21.4982 16.2695 21.3087 17.4028 20.792 18.3985C20.2753 19.3943 19.4579 20.2017 18.4558 
      20.7061C17.4538 21.2104 16.3183 21.386 15.2107 21.2077C14.1032 21.0295 13.08 20.5066 12.2868 
      19.7134C11.4935 18.9202 10.9706 17.897 10.7924 16.7895C10.6142 15.6819 10.7897 14.5464 11.2941 
      13.5443C11.7984 12.5423 12.6059 11.7248 13.6016 11.2082C14.5974 10.6915 15.7307 10.502 16.8403 
      10.6665C17.9722 10.8344 19.0201 11.3618 19.8293 12.1709C20.6384 12.98 21.1658 14.0279 21.3337 
      15.1598Z"
    />
  </svg>
)

export default InstagramIcon