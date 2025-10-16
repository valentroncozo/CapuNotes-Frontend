import "../../styles/theme.css";
import CloseIcon from "../ui/icons/CloseIcon";
import GearIcon from "../ui/icons/GearIcon";
import { useEffect, useState } from "react";

export default function Drawer({ open, onClose, sections=[], onItemClick, onLogout }){
  const [gearOpen, setGearOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(()=>{ if(!open) setGearOpen(false); },[open]);

  return (
    <div className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true">
      <div className="drawer-header">
        <h5 className="offcanvas-title">Menú</h5>

        <div className="appshell-header-controls">
          <button
            className="appshell-gearbtn"
            type="button"
            aria-label="Ajustes"
            onClick={(e)=>{ e.stopPropagation(); setGearOpen(v=>!v); }}
          >
            <GearIcon/>
          </button>
          {gearOpen && (
            <div className="appshell-gear-panel" role="menu">
              <button className="appshell-gear-item" onClick={onLogout}>Cerrar sesión</button>
            </div>
          )}
          <button type="button" className="appshell-closebtn" onClick={onClose} aria-label="Cerrar">
            <CloseIcon/>
          </button>
        </div>
      </div>

      <div className="drawer-body" onClick={()=> gearOpen && setGearOpen(false)}>
        {sections.map((sec) => (
          <div key={sec.id} className="mb-2">
            {sec.type === "group" ? (
              <div className="appshell-accordion-outer">
                <button
                  className={`appshell-accordion-trigger ${openGroup===sec.id ? "open":""}`}
                  onClick={()=> setOpenGroup(openGroup===sec.id ? null : sec.id)}
                  aria-expanded={openGroup===sec.id}
                >
                  {sec.label}
                  <span className="appshell-accordion-caret">
                    {openGroup===sec.id ? "▴" : "▾"}
                  </span>
                </button>
                {openGroup===sec.id && (
                  <div className="appshell-accordion-content">
                    {sec.items.map(item=>(
                      <a key={item.to} href={item.to} className="nav-link"
                         onClick={(e)=>{ e.preventDefault(); onItemClick?.(item.to); }}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a href={sec.to} className="nav-link"
                 onClick={(e)=>{ e.preventDefault(); onItemClick?.(sec.to); }}>
                {sec.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
