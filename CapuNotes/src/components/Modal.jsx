// src/components/Modal.jsx
import { useEffect, useRef } from "react";
import "./popup.css";

export default function Modal({ isOpen, onClose, title, children, actions }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    // foco inicial
    const t = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="pop-backdrop" onMouseDown={onBackdrop}>
      <div
        className="pop-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="pop-header">
          <h3 id="modal-title" className="pop-title">{title}</h3>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
        </header>
        <div className="pop-body">{children}</div>
        {actions && <footer className="pop-footer">{actions}</footer>}
      </div>
    </div>
  );
}
