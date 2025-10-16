import "../../styles/theme.css";

export default function TextField({
  label, name, value="", onChange,
  placeholder="", required=false, type="text",
  error="", helper="", className=""
}){
  return (
    <label className={`block w-full ${className}`}>
      <span className="mb-1 block text-sm" style={{color:"var(--muted)"}}>
        {label}{required && <span style={{color:"var(--accent)"}}> *</span>}
      </span>
      <input
        className="w-full px-3 py-2 rounded-[12px] border"
        style={{
          background:"var(--card-color)",
          color:"var(--ink)",
          borderColor: error ? "var(--danger)" : "var(--line)",
          outline:"none",
          boxShadow:"none"
        }}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e)=>onChange?.(e.target.value)}
      />
      {error ? (
        <small style={{color:"var(--danger)"}}>{error}</small>
      ) : helper ? (
        <small style={{color:"var(--muted)"}}>{helper}</small>
      ) : null}
    </label>
  );
}
