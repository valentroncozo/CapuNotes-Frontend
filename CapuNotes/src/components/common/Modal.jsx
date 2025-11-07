// src/components/common/Modal.jsx
import { useEffect, useRef } from "react";
import "@/styles/popup.css";

export default function Modal({ isOpen, onClose, title, children, actions }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // mantener la referencia actualizada de onClose sin forzar re-ejecución del efecto principal
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen]);

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
