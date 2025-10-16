import { useEffect } from "react";
import "../../styles/theme.css";
import CloseIcon from "./icons/CloseIcon";

export default function Modal({ open, title, children, onClose, footer=null, width=520 }){
  useEffect(()=>{
    if(!open) return;
    const onKey = (e)=>{ if(e.key==="Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[open, onClose]);

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div className="absolute inset-0" style={{background:"rgba(0,0,0,.55)"}} onClick={onClose}/>
      <div
        className="relative rounded-[16px] border p-4"
        style={{ width, background:"var(--primary-color)", borderColor:"var(--line)", boxShadow:"var(--shadow)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0 text-lg" style={{color:"var(--ink)"}}>{title}</h3>
          <button className="appshell-closebtn" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>
        <div className="mb-4">{children}</div>
        {footer && <div className="flex gap-2 justify-end">{footer}</div>}
      </div>
    </div>
  );
}
