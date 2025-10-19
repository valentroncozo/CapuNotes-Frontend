// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";

// Bootstrap base (necesario para react-bootstrap Button en table.jsx)
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
