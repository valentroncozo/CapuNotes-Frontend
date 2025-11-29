// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Si ya creaste tokens/globals, activalos. Si no, dejá index.css como estaba.
import '@/styles/globals.css'
import { PermisosProvider } from "@/context/PermisosContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PermisosProvider>
      <App />
    </PermisosProvider>
  </React.StrictMode>,
)
