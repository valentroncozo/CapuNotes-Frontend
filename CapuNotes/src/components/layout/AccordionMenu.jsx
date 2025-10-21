// src/components/layout/AccordionMenu.jsx
/**
 * Acordeón reusable para el menú lateral del AppShell.
 * - title: string (título del acordeón)
 * - open: boolean (estado abierto/cerrado)
 * - setOpen: fn(boolean => boolean) (setter del estado)
 * - items: [{ label: string, path: string }]
 * - onNavigate: fn(path) (callback para navegar y cerrar el drawer)
 */
export default function AccordionMenu({ title, open, setOpen, items = [], onNavigate }) {
  return (
    <div className="appshell-accordion-outer" style={{ marginTop: 10 }}>
      <button
        className={`appshell-accordion-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <span className="appshell-accordion-caret">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="appshell-accordion-content">
          {items.map(({ label, path }) => (
            <a
              key={path}
              href={path}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(path);
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
