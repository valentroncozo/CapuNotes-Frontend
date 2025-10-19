// src/components/common/Modal.jsx
import { useEffect, useRef } from "react";
import "@/styles/popup.css";

/**
 * Modal base genérico.
 * - Muestra botón "✕" en el header por defecto (showHeaderClose = true)
 * - Cierra con Escape y al hacer click en el backdrop.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  showHeaderClose = true, // 👈 ahora por defecto viene la cruz en el header
  closeLabel = "Cerrar",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
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
    <div className="pop-backdrop" onClick={onBackdrop} onMouseDown={onBackdrop}>
      <div
        className="pop-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="pop-header">
          <h3 id="modal-title" className="pop-title">
            {title}
          </h3>

          {showHeaderClose && (
            <button
              className="icon-btn"
              aria-label={closeLabel}
              onClick={onClose}
              type="button"
              title={closeLabel}
            >
              ✕
            </button>
          )}
        </header>

        <div className="pop-body">{children}</div>

        {actions && <footer className="pop-footer">{actions}</footer>}
      </div>
    </div>
  );
}
