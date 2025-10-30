import EyeOnIcon from './VisibilityOnIcon'
import EyeOffIcon from './VisibilityOffIcon'
import '@/styles/icons.css'
export default function PasswordToggleIcon({ isVisible, onToggle }) {
    return (
        <a className="container-toggle" onClick={onToggle}>

            {isVisible 
            ? <EyeOffIcon className="eyes-icon"/> 
            : <EyeOnIcon className="eyes-icon"/>}

        </a>
        
        
    )
}


