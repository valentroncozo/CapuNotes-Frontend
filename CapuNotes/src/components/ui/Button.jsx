import "../../styles/theme.css";

export default function Button({
  children,
  variant="primary",
  type="button",
  onClick,
  className=""
}){
  const base = "inline-flex items-center gap-2 px-3 py-2 rounded-[12px] border transition-all";
  const styles = {
    primary: `bg-[var(--accent)] text-black border-transparent hover:opacity-90`,
    ghost: `bg-transparent text-[var(--ink)] border-[var(--line)] hover:bg-[rgba(179,205,250,.12)]`,
    danger: `bg-[var(--danger)] text-white border-transparent hover:opacity-90`
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
