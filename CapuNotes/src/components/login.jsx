import { useState } from 'react';
import './login.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import WavyClipPath from '../assets/WavyClipPath';
import MobileWavyClipPath from '../assets/MobileWavyClipPath';
import AccountUser from '../assets/AccountUserIcon' 
import PasswordToggleIcon from '../assets/PasswordToggleIcon';


const validateField = (name,value, currentErrors) => {
    let errors = '';
    
    if(value.trim() === ''){
      errors = `* ${name} es obligatorio no puede estar vacio.`;
    } else {
      errors = null;
    }
    return {...currentErrors, [name.toLowerCase()]: errors };
  }



export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    e.preventDefault();
    // Construir el objeto final de errores usando la función validateField
    let finalErrors = {};
    finalErrors = validateField('Usuario', username, finalErrors);
    finalErrors = validateField('Contraseña', password, finalErrors);

    // La función validateField devuelve un objeto con claves en minúsculas
    const isValid = !finalErrors.usuario && !finalErrors.contraseña;
    setErrors(finalErrors);

    if (isValid) {
      onLogin(username, password);
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'Usuario'){
      setUsername(value);
    } else if (name === 'Contraseña'){
      setPassword(value);
    }
    const updatedErrors = validateField(name, value, errors);
    setErrors(updatedErrors);
  }

  return (
    <main className="login-container">

      <WavyClipPath/>

      {/* Bloque azul con onda */}
      <div className="login-form-container"> 
        <MobileWavyClipPath />

        {/* Formulario */}
        <Form onSubmit={handleSubmit} 
        noValidate 
        className="formulario-login">

          <h1 className="logo-text">Iniciar Sesion en su cuenta de 
            <strong> CapuNotes</strong></h1>
          <Form.Group className='custom-input-group'>
           
            <AccountUser className="account-icon"/>
           
            <Form.Control
              type="text"
              className="custom-input"
              placeholder="Usuario"
              value={username}
              onChange={handleInputChange}
              name="Usuario"
              required
            />


          </Form.Group>
          <p className='menssaje-error-login'>{errors.usuario}</p>

              
        
          <Form.Group className="custom-input-group">
            
              <PasswordToggleIcon 
                isVisible={showPassword} 
                onToggle={togglePasswordVisibility} 
              />

              <Form.Control
                type={showPassword ? "text" : "password"}
                className="custom-input"
                placeholder="Contraseña"
                value={password}
                onChange={handleInputChange}
                name="Contraseña"
                required
              />

          </Form.Group>
          
          <p className='menssaje-error-login'>{errors.contraseña}</p>

          <Form.Group className='custom-input-group'>
            <Button type="submit" 
            className="button-login">
              Ingresar
            </Button>
          </Form.Group>

        </Form>

      </div>

      <img
        src="../public/fondo.jpg"
        alt="fondo"
        className="img-fondo"
      />

    </main>
  );
}
