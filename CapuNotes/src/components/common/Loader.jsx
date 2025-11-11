// src/components/common/Loader.jsx
import React from "react";
import "@/styles/loader.css";

export default function Loader() {
  return (
    <div className="logo-loader-container">
      <img
        src="/logo-coro-sin-fondo.png"
        alt="CapuNotes"
        className="logo-loader"
      />
      <span className="loader-text">Cargando...</span>
    </div>
  );
}

