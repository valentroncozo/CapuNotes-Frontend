// src/app/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }

  // No declaramos parámetros para evitar no-unused-vars
  componentDidCatch() {
    // Podés loguear en un servicio externo aquí si lo necesitás.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Ocurrió un error en la interfaz.</h2>
          <p>Intenta recargar la página o volver al inicio.</p>
          <pre style={{ whiteSpace: "pre-wrap", opacity: 0.7 }}>
            {this.state.err?.message || String(this.state.err)}
          </pre>
          <a href="/principal">Ir al inicio</a>
        </div>
      );
    }
    return this.props.children;
  }
}
