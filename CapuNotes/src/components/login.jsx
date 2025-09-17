import { Form, Button } from 'react-bootstrap';
import { PersonFill, LockFill } from 'react-bootstrap-icons';
import './login.css';

export default function Login() {
  return (
    <div className="login-container">
      {/* Bloque azul con onda */}
      <div className="login-form-onda">
        <h1 className="logo-text">CapyNotes</h1>
        <div className="logo-icon">⚙️</div>
        <Form>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <PersonFill />
            </span>
            <Form.Control type="text" placeholder="Usuario" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <LockFill />
            </span>
            <Form.Control type="password" placeholder="Contraseña" />
          </div>
          <Button type="submit" className="btn-ingresar w-100">
            Ingresar
          </Button>
        </Form>
      </div>
    </div>
  );
}
