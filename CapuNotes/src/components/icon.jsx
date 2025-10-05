// src/components/Icon.jsx
import React from "react";
import PropTypes from "prop-types";
import "./Icon.css"; // estilos compartidos opcionales

export default function Icon({ name, size = "1.5rem", color = "var(--accent)" }) {
  return (
    <span
      className="material-symbols-outlined icon"
      style={{ fontSize: size, color: color }}
    >
      {name}
    </span>
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
};
